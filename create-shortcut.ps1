$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutFile = "$DesktopPath\UniversalCLI.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutFile)

$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$NodeExe = (Get-Command node).Source -Replace 'node.exe',''

# Look for Node if present, or just pass generic shell launch
if ($NodeExe) {
    $Shortcut.TargetPath = "$NodeExe\node.exe"
    $Shortcut.Arguments = """$ScriptPath\index.js"""
} else {
    $Shortcut.TargetPath = "node"
    $Shortcut.Arguments = """$ScriptPath\index.js"""
}

$Shortcut.WorkingDirectory = $ScriptPath
$Shortcut.WindowStyle = 1
$Shortcut.Description = "Universal CLI configured by Admin"
$Shortcut.Save()

Write-Host "Shortcut created at $ShortcutFile"

# Note: In Windows, forcing elevated privileges directly on a standard shortcut created via COM is tricky without advanced flags.
# An alternative is setting 'RunAs' in advanced properties, but for this utility, this creates the valid desktop proxy.
