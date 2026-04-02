# universal-cli

Universal wrapper CLI coordinating Node.js, Python, and PowerShell utilities.

## Components

- `index.js`: main Node.js CLI entrypoint exposed as `ucli`
- `configurator.py`: Python backend for clustering and configuration tasks
- `create-shortcut.ps1`: PowerShell helper for creating a desktop shortcut on Windows
- `wrappers/`: wrapper integrations such as GitHub CLI and Gemini CLI

## Install

```bash
npm install
```

## Usage

Start the CLI:

```bash
node index.js
```

Run the GitHub wrapper:

```bash
node index.js github auth status
```

Run the Gemini wrapper:

```bash
node index.js gemini --help
```

Run the Python configurator through the CLI:

```bash
node index.js cluster --type docker --workers 3
```

Create a Python virtual environment through the CLI:

```bash
node index.js venv .venv
```

Create the Windows desktop shortcut:

```powershell
powershell -ExecutionPolicy Bypass -File ./create-shortcut.ps1
```

## Python

The Python backend currently uses only the standard library. The repository now includes `pyproject.toml` so Dependabot can track future Python dependencies.

## Dependabot

Dependabot is configured for:

- `npm`
- `pip`
- `github-actions`
