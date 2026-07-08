#!/usr/bin/env python3
"""
NetworkBuster - VENV Unified Service Launcher & Chronological Telemetry Logger
Launches Node.js server (Vite/Express) and Flask server within the venv,
pre-compiles pycache, and logs CPU/Memory stats via psutil with a 'reverse in time' history.
"""

import os
import sys
import time
import json
import psutil
import subprocess
import threading
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, render_template_string
from flask_cors import CORS

# 1. Project paths setup
PROJECT_ROOT = Path(__file__).parent.resolve()
LOG_DIR = PROJECT_ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "telemetry.log"

# 2. Pre-compile python files to ensure __pycache__ is populated
print("[1/5] Compiling python files for pycache optimization...")
subprocess.run([sys.executable, "-m", "compileall", str(PROJECT_ROOT)], capture_output=True)
print("✓ pycache generation complete.")

# 3. Create Flask Application
app = Flask(__name__)
CORS(app)

# Global variables to track background subprocesses
node_process = None
monitoring_active = True

def get_process_info(proc):
    """Retrieve process resource usage using psutil."""
    if not proc or proc.poll() is not None:
        return {"status": "OFFLINE", "cpu": 0.0, "memory": 0.0}
    try:
        p = psutil.Process(proc.pid)
        # Include child processes in resource calculation
        cpu_percent = p.cpu_percent(interval=0.1)
        mem_info = p.memory_info().rss / (1024 * 1024) # MB
        for child in p.children(recursive=True):
            try:
                cpu_percent += child.cpu_percent(interval=0.1)
                mem_info += child.memory_info().rss / (1024 * 1024)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return {
            "status": "ONLINE",
            "pid": proc.pid,
            "cpu": round(cpu_percent, 2),
            "memory": round(mem_info, 2)
        }
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        return {"status": "OFFLINE", "cpu": 0.0, "memory": 0.0}

def telemetry_logger_loop():
    """Periodically logs system and process resource metrics using psutil."""
    global node_process, monitoring_active
    print("⚡ Starting background resource monitoring loop...")
    while monitoring_active:
        try:
            # System wide stats
            sys_cpu = psutil.cpu_percent(interval=0.5)
            sys_mem = psutil.virtual_memory().percent
            
            # App process stats
            node_stats = get_process_info(node_process)
            flask_pid = os.getpid()
            try:
                fp = psutil.Process(flask_pid)
                flask_cpu = fp.cpu_percent(interval=0.1)
                flask_mem = fp.memory_info().rss / (1024 * 1024)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                flask_cpu, flask_mem = 0.0, 0.0

            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "system": {
                    "cpu_percent": sys_cpu,
                    "mem_percent": sys_mem
                },
                "node_service": node_stats,
                "flask_service": {
                    "status": "ONLINE",
                    "pid": flask_pid,
                    "cpu": round(flask_cpu, 2),
                    "memory": round(flask_mem, 2)
                }
            }

            # Write JSON log entry
            with open(LOG_FILE, "a") as lf:
                lf.write(json.dumps(log_entry) + "\n")
                
        except Exception as e:
            print(f"Error in telemetry monitoring: {e}")
        
        time.sleep(2)

# HTML dashboard template
DASHBOARD_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>NetworkBuster Unified Telemetry Engine</title>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Space+Mono&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #0d1117;
            color: #c9d1d9;
            font-family: 'Space Mono', monospace;
            margin: 0;
            padding: 20px;
        }
        h1, h2 {
            font-family: 'Orbitron', sans-serif;
            color: #58a6ff;
            text-shadow: 0 0 10px rgba(88, 166, 255, 0.2);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .status-online {
            color: #3fb950;
            font-weight: bold;
        }
        .status-offline {
            color: #f85149;
            font-weight: bold;
        }
        .log-section {
            background: #090c10;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 15px;
            height: 400px;
            overflow-y: auto;
        }
        .log-entry {
            border-bottom: 1px solid #21262d;
            padding: 8px 0;
            font-size: 0.85rem;
        }
        .timestamp {
            color: #8b949e;
        }
        .highlight {
            color: #ff7b72;
        }
        .green {
            color: #58a6ff;
        }
        .btn {
            background-color: #21262d;
            border: 1px solid #30363d;
            color: #c9d1d9;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            transition: 0.2s;
        }
        .btn:hover {
            background-color: #30363d;
            border-color: #8b949e;
        }
        .nav-links {
            margin-bottom: 20px;
        }
        .nav-links a {
            color: #58a6ff;
            text-decoration: none;
            margin-right: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⏰ NetworkBuster Unified Telemetry Engine</h1>
        <div class="nav-links">
            <a href="/">Dashboard</a> | 
            <a href="/api/telemetry/stats">JSON Live Stats</a> | 
            <a href="/api/telemetry/reverse">JSON Reverse History</a>
        </div>
        
        <div class="grid">
            <!-- Node Service Info -->
            <div class="card">
                <h2>🌐 Node.js Service (npm start / Vite)</h2>
                <div id="node-stats">Loading stats...</div>
            </div>
            <!-- Flask Service Info -->
            <div class="card">
                <h2>🐍 Flask Telemetry Service</h2>
                <div id="flask-stats">Loading stats...</div>
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2>🔄 Chronological Telemetry Log (Reverse in Time)</h2>
                <button class="btn" onclick="fetchReverseHistory()">Refresh Timeline</button>
            </div>
            <div class="log-section" id="reverse-logs">
                Loading history...
            </div>
        </div>
    </div>

    <script>
        async function fetchLiveStats() {
            try {
                const response = await fetch('/api/telemetry/stats');
                const data = await response.json();
                
                document.getElementById('node-stats').innerHTML = `
                    <p>Status: <span class="${data.node_service.status === 'ONLINE' ? 'status-online' : 'status-offline'}">${data.node_service.status}</span></p>
                    <p>PID: ${data.node_service.pid || 'N/A'}</p>
                    <p>CPU Usage: <span class="highlight">${data.node_service.cpu}%</span></p>
                    <p>Memory RAM: <span class="green">${data.node_service.memory} MB</span></p>
                `;
                
                document.getElementById('flask-stats').innerHTML = `
                    <p>Status: <span class="status-online">${data.flask_service.status}</span></p>
                    <p>PID: ${data.flask_service.pid}</p>
                    <p>CPU Usage: <span class="highlight">${data.flask_service.cpu}%</span></p>
                    <p>Memory RAM: <span class="green">${data.flask_service.memory} MB</span></p>
                    <p>System CPU: ${data.system.cpu_percent}% | System RAM: ${data.system.mem_percent}%</p>
                `;
            } catch (err) {
                console.error("Error fetching live stats:", err);
            }
        }

        async function fetchReverseHistory() {
            try {
                const response = await fetch('/api/telemetry/reverse');
                const logEntries = await response.json();
                const logContainer = document.getElementById('reverse-logs');
                
                if (logEntries.length === 0) {
                    logContainer.innerHTML = "<p>No telemetry entries logged yet.</p>";
                    return;
                }
                
                logContainer.innerHTML = logEntries.map(entry => `
                    <div class="log-entry">
                        <span class="timestamp">[${entry.timestamp}]</span> 
                        <strong>SYSTEM:</strong> CPU: ${entry.system.cpu_percent}%, MEM: ${entry.system.mem_percent}% | 
                        <strong>NODE:</strong> ${entry.node_service.status} (CPU: ${entry.node_service.cpu}%, RAM: ${entry.node_service.memory}MB) | 
                        <strong>FLASK:</strong> CPU: ${entry.flask_service.cpu}%, RAM: ${entry.flask_service.memory}MB
                    </div>
                `).join('');
            } catch (err) {
                console.error("Error fetching history:", err);
            }
        }

        // Auto update live stats every 2 seconds, and history on load
        fetchLiveStats();
        fetchReverseHistory();
        setInterval(fetchLiveStats, 2000);
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Serves the Unified Telemetry Dashboard."""
    return render_template_string(DASHBOARD_HTML)

@app.route('/api/telemetry/stats')
def stats():
    """Returns real-time service metrics using psutil."""
    global node_process
    sys_cpu = psutil.cpu_percent(interval=0.1)
    sys_mem = psutil.virtual_memory().percent
    node_stats = get_process_info(node_process)
    flask_pid = os.getpid()
    try:
        fp = psutil.Process(flask_pid)
        flask_cpu = fp.cpu_percent(interval=0.1)
        flask_mem = fp.memory_info().rss / (1024 * 1024)
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        flask_cpu, flask_mem = 0.0, 0.0

    return jsonify({
        "system": {
            "cpu_percent": sys_cpu,
            "mem_percent": sys_mem
        },
        "node_service": node_stats,
        "flask_service": {
            "status": "ONLINE",
            "pid": flask_pid,
            "cpu": round(flask_cpu, 2),
            "memory": round(flask_mem, 2)
        }
    })

@app.route('/api/telemetry/history')
def history():
    """Returns chronological telemetry log history."""
    entries = []
    if LOG_FILE.exists():
        with open(LOG_FILE, "r") as f:
            for line in f:
                if line.strip():
                    try:
                        entries.append(json.loads(line.strip()))
                    except Exception:
                        continue
    return jsonify(entries)

@app.route('/api/telemetry/reverse')
def reverse_history():
    """Returns chronological telemetry log history reversed in time (latest first)."""
    entries = []
    if LOG_FILE.exists():
        with open(LOG_FILE, "r") as f:
            for line in f:
                if line.strip():
                    try:
                        entries.append(json.loads(line.strip()))
                    except Exception:
                        continue
    # Reverse list to implement "reverse in time" chronological traversal
    entries.reverse()
    return jsonify(entries)

def main():
    global node_process, monitoring_active
    print("==================================================================")
    print("  ⏰ NetworkBuster Unified VENV Service & Telemetry System  ")
    print("==================================================================")
    
    # 4. Start Node.js / Vite service via npm start
    print("[2/5] Starting Node.js/Vite application via 'npm start'...")
    try:
        node_process = subprocess.Popen(
            ["npm", "start"],
            cwd=str(PROJECT_ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print(f"✓ Node.js service launched. (PID: {node_process.pid})")
    except Exception as e:
        print(f"❌ Failed to launch Node.js service: {e}")

    # 5. Start background telemetry logging thread
    print("[3/5] Starting telemetry logging background thread...")
    telemetry_thread = threading.Thread(target=telemetry_logger_loop, daemon=True)
    telemetry_thread.start()
    
    # 6. Run Flask telemetry app
    print("[4/5] Running Flask telemetry dashboard on http://localhost:5005...")
    try:
        # Run Flask server locally
        app.run(host="0.0.0.0", port=5005, debug=False, use_reloader=False)
    except KeyboardInterrupt:
        print("\n🛑 KeyboardInterrupt detected. Cleaning up processes...")
    finally:
        # Cleanup processes on exit
        print("[5/5] Shutting down services...")
        monitoring_active = False
        if node_process:
            print(f"  Stopping Node.js service (PID: {node_process.pid})...")
            try:
                # Terminate recursively to kill child processes
                parent = psutil.Process(node_process.pid)
                for child in parent.children(recursive=True):
                    child.terminate()
                parent.terminate()
                print("  ✓ Node.js service terminated.")
            except Exception as e:
                print(f"  ⚠ Node.js cleanup error: {e}")
        print("👋 Services successfully stopped.")

if __name__ == "__main__":
    main()
