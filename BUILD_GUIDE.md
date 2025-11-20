# Build Guide - Mood Tracker Executable

This guide explains how to build standalone executables for the Mood Tracker application.

## Prerequisites

- Node.js 16 or higher installed
- npm or yarn package manager
- 4GB+ free disk space for build process

## Build Process

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Build the Executable

Choose the appropriate command for your target platform:

#### Build for Current Platform
```bash
npm run package
```

This will create an executable for the platform you're currently running on.

#### Build for Specific Platforms

**Windows:**
```bash
npm run package:win
```
Creates: `dist-electron/Mood Tracker Setup.exe`

**macOS:**
```bash
npm run package:mac
```
Creates: `dist-electron/Mood Tracker.dmg`

**Linux:**
```bash
npm run package:linux
```
Creates: `dist-electron/Mood Tracker.AppImage` and `.deb` package

### 3. Locate the Built Files

After building, find your executables in the `dist-electron/` directory:

```
dist-electron/
├── Mood Tracker Setup.exe      (Windows)
├── Mood Tracker.dmg             (macOS)
├── Mood Tracker.AppImage        (Linux)
└── mood-tracker_1.0.0_amd64.deb (Linux)
```

## Distribution

### Windows
- Distribute the `.exe` installer
- Users run the installer and follow the wizard
- Application is installed to `C:\Program Files\Mood Tracker` by default

### macOS
- Distribute the `.dmg` file
- Users open the DMG and drag the app to Applications folder
- First run may require right-click → Open due to Gatekeeper

### Linux
- **AppImage**: Distribute the `.AppImage` file
  - Users make it executable: `chmod +x Mood-Tracker.AppImage`
  - Run directly: `./Mood-Tracker.AppImage`
- **Debian/Ubuntu**: Distribute the `.deb` file
  - Install with: `sudo dpkg -i mood-tracker_1.0.0_amd64.deb`

## Build Size

Expected sizes:
- Windows: ~180-220 MB
- macOS: ~200-250 MB
- Linux: ~180-220 MB

These sizes include:
- Electron runtime
- Node.js runtime
- Application code
- All dependencies

## Customization

### Change Application Icon

1. Create a 512x512 PNG image
2. Save as `electron/icon.png`
3. Update `electron-builder.json` to reference the icon
4. Rebuild the application

### Change Application Name

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Name"
}
```

Also update `electron-builder.json`:
```json
{
  "productName": "Your App Name"
}
```

## Troubleshooting

### Build Fails with "Cannot find module"
- Delete `node_modules` and `frontend/node_modules`
- Run `npm install` again in both root and frontend directories

### Build Takes Too Long
- First build is slower (10-20 minutes) due to downloading Electron binaries
- Subsequent builds are faster (2-5 minutes)

### "Not Signed" Warning on macOS
- For distribution, you need an Apple Developer account to sign the app
- For personal use, users can right-click → Open to bypass Gatekeeper

### Windows Defender Flags the Executable
- This is common with Electron apps
- For distribution, consider code signing with a certificate
- For personal use, add an exclusion in Windows Defender

## Code Signing (Optional)

For production distribution, consider code signing:

**Windows:** Requires a code signing certificate
**macOS:** Requires Apple Developer account ($99/year)
**Linux:** Generally not required

## Auto-Updates (Future Enhancement)

To add auto-update functionality:
1. Use `electron-updater` package
2. Host releases on GitHub or private server
3. Configure in `electron/main.cjs`

## Questions?

For more information about Electron Builder, visit:
https://www.electron.build/
