function App() {
    const telemetry = [
        ['uplink', '450 MBPS', 'ok'],
        ['downlink', '890 MBPS', 'ok'],
        ['latency', '12 MS', 'stable'],
        ['thermal', '34C', 'nominal'],
        ['gpu', '92%', 'optimal'],
        ['matrix', 'LIVE', 'alt']
    ]

    const routes = [
        'network://core/active',
        'network://mesh/alpha',
        'network://audio/stream',
        'network://ai/training',
        'network://security/scan'
    ]

    const stream = [
        'SESSION INITIATED',
        'NODE LINK SYNCHRONIZED',
        'AI LOOP POLLING',
        'MESH ROUTE VERIFIED',
        'TERMINAL MODE ENABLED'
    ]

    return (
        <div className="terminal-mode-shell blackout-terminal">
            <div className="terminal-grid" />
            <div className="terminal-noise" />
            <div className="data-streams" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, index) => (
                    <span
                        key={index}
                        className="data-stream"
                        style={{
                            left: `${(index * 11 + 4) % 100}%`,
                            animationDelay: `${(index % 9) * 0.42}s`,
                            animationDuration: `${4.5 + (index % 5) * 0.7}s`
                        }}
                    />
                ))}
            </div>
            <div className="matrix-layer" aria-hidden="true">
                {Array.from({ length: 38 }).map((_, index) => (
                    <span
                        key={index}
                        className="matrix-column"
                        style={{
                            left: `${(index * 9 + 6) % 100}%`,
                            animationDelay: `${(index % 10) * 0.35}s`,
                            animationDuration: `${7 + (index % 6)}s`
                        }}
                    >
                        {Array.from({ length: 16 }).map((__, rowIndex) => (
                            <i key={`${index}-${rowIndex}`} style={{ animationDelay: `${(rowIndex * 0.16) + (index * 0.1)}s` }} />
                        ))}
                    </span>
                ))}
            </div>

            <div className="terminal-panel">
                <header className="terminal-header">
                    <div className="terminal-brand-wrap">
                        <span className="terminal-pill">UNIVERSAL OVERLAY</span>
                        <span className="terminal-tag">TERMINAL MODE</span>
                    </div>
                    <div className="terminal-status">
                        <span className="status-led" />
                        LIVE
                    </div>
                </header>

                <main className="terminal-body">
                    <aside className="terminal-sidebar">
                        <div className="panel-block">
                            <p className="panel-label">SYSTEM</p>
                            <h2>PRECISELIENS</h2>
                            <ul>
                                <li>MODE // ORBITAL HIVE</li>
                                <li>NODE // 27.84.11</li>
                                <li>STATE // SYNCHRONIZED</li>
                            </ul>
                        </div>

                        <div className="panel-block">
                            <p className="panel-label">SIGNAL</p>
                            <div className="signal-bars" aria-label="Signal strength">
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    </aside>

                    <section className="terminal-console">
                        <div className="console-bar">
                            <span>mission_control</span>
                            <span>root@networkbuster</span>
                        </div>

                        <div className="console-output">
                            {stream.map((line, index) => (
                                <div key={line} className="console-line">
                                    <span className="prompt">[{index + 1}]</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>

                        <div className="command-row">
                            <span className="prompt">$</span>
                            <span>overlay --mode terminal --universal --live</span>
                        </div>
                    </section>

                    <aside className="terminal-metrics">
                        <div className="panel-block compact">
                            <p className="panel-label">TELEMETRY</p>
                            {telemetry.map(([name, value, tone]) => (
                                <div className="metric-row" key={name}>
                                    <span>{name}</span>
                                    <strong className={tone}>{value}</strong>
                                </div>
                            ))}
                        </div>

                        <div className="panel-block compact">
                            <p className="panel-label">ROUTES</p>
                            <ul className="route-list">
                                {routes.map((route) => (
                                    <li key={route}>{route}</li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    )
}

export default App

