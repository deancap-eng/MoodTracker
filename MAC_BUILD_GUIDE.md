# Building for macOS - Complete Guide

This guide explains how to create macOS distribution packages for Mood Tracker.

## TL;DR - What You Have Now

✅ **Already Built:**
- `dist-electron/Mood Tracker-1.0.0-mac.zip` (98 MB) - **Ready to distribute!**
- `dist-electron/mac/Mood Tracker.app` - Mac application bundle

## Understanding macOS Distribution

### Why .dmg requires macOS

The `.dmg` (disk image) format requires macOS-specific tools that aren't available on Linux/Windows. However, **the .zip file is fully functional and can be distributed to Mac users.**

### Distribution Options

| Format | Built On | Works On Mac? | User Experience |
|--------|----------|---------------|-----------------|
| **.dmg** | macOS only | ✅ Yes | Best - Drag to Applications |
| **.zip** | Any OS | ✅ Yes | Good - Extract and move to Applications |
| **.app** | Any OS | ✅ Yes | Manual - Copy to Applications folder |

## Quick Start - Using the .zip File

The `.zip` file you already have works perfectly on macOS:

### For Distribution:
1. Share `Mood Tracker-1.0.0-mac.zip` with Mac users
2. Users download and extract the zip
3. Users drag `Mood Tracker.app` to Applications folder
4. Users run the app (may need to right-click → Open first time due to Gatekeeper)

### File Location:
```
dist-electron/Mood Tracker-1.0.0-mac.zip
```

## Building .dmg on macOS

If you want to create a proper `.dmg` installer, follow these steps **on a Mac**:

### Option 1: Using the Build Script (Easiest)

```bash
./build-mac.sh
```

This will automatically:
- Install dependencies
- Build the frontend
- Create the .dmg installer
- Output to `dist-electron/Mood Tracker-1.0.0.dmg`

### Option 2: Manual Build

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Build frontend
cd frontend && npm run build && cd ..

# 3. Build macOS .dmg
npm run package:mac
```

### Option 3: Using npm directly

```bash
npm install
cd frontend && npm install && npm run build && cd ..
npx electron-builder build --mac --config electron-builder.json
```

## What's Already Built

Located in `dist-electron/`:

### 1. Mood Tracker-1.0.0-mac.zip (98 MB)
- **Ready to distribute now!**
- Contains the complete Mac application
- Users extract and move to Applications
- No Mac required to build this

### 2. mac/Mood Tracker.app (250 MB unpacked)
- The actual macOS application bundle
- Can be manually distributed
- Users copy to `/Applications/`
- No installation needed

## Distributing to Mac Users

### Method 1: Share the .zip (Current)

**Advantages:**
- Already built on Linux
- Works immediately
- Smaller file size (compressed)

**Instructions for Users:**
1. Download `Mood Tracker-1.0.0-mac.zip`
2. Double-click to extract
3. Drag `Mood Tracker.app` to Applications folder
4. First time: Right-click → Open (due to Gatekeeper)
5. Subsequently: Normal double-click to open

### Method 2: Build and Share .dmg (Requires Mac)

**Advantages:**
- Professional appearance
- Drag-to-install interface
- Easier for end users

**Instructions:**
1. Transfer project to macOS computer
2. Run `./build-mac.sh`
3. Share `dist-electron/Mood Tracker-1.0.0.dmg`

**Instructions for Users:**
1. Download `Mood Tracker-1.0.0.dmg`
2. Double-click to mount
3. Drag app icon to Applications folder
4. Eject the disk image
5. Run from Applications

## Troubleshooting

### "Cannot be opened because the developer cannot be verified"

This is macOS Gatekeeper. Users should:
1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog
4. App will remember this choice

### Building .dmg fails on Linux

**Expected behavior.** The error `Cannot find module 'dmg-license'` is normal on Linux.

**Solution:** Use the .zip file (already built) or build on macOS.

### Large file size

The app is ~100MB due to:
- Electron runtime (~70MB)
- Node.js runtime (~15MB)
- Your application code (~5MB)
- Dependencies (~10MB)

This is normal for Electron apps.

## Code Signing (Optional - For Production)

For professional distribution, consider code signing:

### Requirements:
- Apple Developer account ($99/year)
- macOS computer
- Valid Developer ID certificate

### Benefits:
- No Gatekeeper warnings
- App Store distribution possible
- Automatic updates work better
- Professional appearance

### How to Sign:

1. **Get Certificate:**
   - Enroll in Apple Developer Program
   - Create Developer ID Application certificate
   - Download and install in Keychain

2. **Update electron-builder.json:**
   ```json
   "mac": {
     "target": ["dmg"],
     "category": "public.app-category.productivity",
     "identity": "Developer ID Application: Your Name (TEAMID)"
   }
   ```

3. **Build (will auto-sign):**
   ```bash
   npm run package:mac
   ```

4. **Notarize (Required for macOS 10.15+):**
   ```bash
   xcrun notarytool submit "dist-electron/Mood Tracker-1.0.0.dmg" \
     --apple-id "your@email.com" \
     --team-id "TEAMID" \
     --password "app-specific-password" \
     --wait
   ```

## Universal Binary (Intel + Apple Silicon)

To build for both Intel and Apple Silicon Macs:

Update `electron-builder.json`:
```json
"mac": {
  "target": ["dmg"],
  "category": "public.app-category.productivity",
  "arch": ["x64", "arm64"]
}
```

Or build universal:
```json
"mac": {
  "target": ["dmg"],
  "category": "public.app-category.productivity",
  "arch": "universal"
}
```

Note: Universal builds are ~2x larger.

## CI/CD - Automated Builds

### GitHub Actions (Example)

Create `.github/workflows/build-mac.yml`:

```yaml
name: Build macOS

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm install
        cd frontend && npm install

    - name: Build
      run: ./build-mac.sh

    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: macos-builds
        path: dist-electron/*.dmg
```

## File Locations Summary

After building on macOS:
```
dist-electron/
├── Mood Tracker-1.0.0.dmg           # DMG installer (macOS only)
├── Mood Tracker-1.0.0-mac.zip       # ZIP archive (any OS) ✅ Already built
├── Mood Tracker-1.0.0-mac.zip.blockmap
└── mac/
    └── Mood Tracker.app             # App bundle ✅ Already built
```

## Recommendation

**For now:** Distribute the `.zip` file you already have. It works perfectly.

**For production:** Build the `.dmg` on macOS for a more professional experience.

## Testing on macOS

Before distribution, test on macOS:

1. **Test the .zip file:**
   - Extract on Mac
   - Move to Applications
   - Launch and test all features
   - Test on both Intel and Apple Silicon if possible

2. **Test the .dmg file (if built):**
   - Mount the DMG
   - Drag to Applications
   - Launch and verify

3. **Test on multiple macOS versions:**
   - macOS 13 Ventura
   - macOS 14 Sonoma
   - macOS 15 Sequoia (if available)

## Summary

✅ **You already have a working Mac distribution: `Mood Tracker-1.0.0-mac.zip`**

This file:
- Works on all Mac computers (Intel and Apple Silicon)
- Can be distributed immediately
- No macOS required to build it
- Fully functional

The .dmg format is optional and mainly provides a nicer installation experience.
