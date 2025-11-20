# Remote Deployment Guide - Mood Tracker

This guide explains how to set up Mood Tracker for remote users across your organization.

## Overview

Mood Tracker supports remote users through centralized server deployment. One computer acts as the server (hosting the database), and all other employees connect to it remotely.

## Architecture

```
┌─────────────┐
│   Server    │ ← Hosts database and API
│  (Central)  │
└──────┬──────┘
       │
    Network
       │
   ┌───┴──────┬──────────┬─────────┐
   │          │          │         │
┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐
│Remote│  │Remote│  │Remote│  │Remote│
│User 1│  │User 2│  │User 3│  │User 4│
└──────┘  └──────┘  └──────┘  └──────┘
```

## Setup Options

### Option 1: Central Server with Remote Clients (Recommended)

Best for: Organizations where employees are on the same network or have VPN access

**Server Setup:**
1. Choose one computer to act as the server (should stay powered on during work hours)
2. Install and run the Mood Tracker executable
3. Note the server's IP address (shown in the console on startup)
4. Ensure the firewall allows incoming connections on port 3000

**Client Setup:**
1. Install Mood Tracker on each user's computer
2. Open the app and go to Dashboard → Settings
3. Enter the server URL: `http://[SERVER-IP]:3000`
4. Click "Save Server URL" and restart the app
5. Register/login normally - all data is stored on the central server

### Option 2: Cloud Deployment (Advanced)

Best for: Remote teams, distributed organizations

Deploy the backend to a cloud service:
- AWS EC2
- Digital Ocean Droplet
- Azure VM
- Google Cloud Compute Engine

Then configure all clients to connect to the cloud server URL.

## Detailed Server Setup

### 1. Find Your Server's IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```
Look for `inet` address (e.g., `192.168.1.100`)

**OR** - When the Mood Tracker server starts, it displays the IP address in the console.

### 2. Configure Firewall

**Windows:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" → Specific local ports: `3000` → Next
6. Select "Allow the connection" → Next
7. Name it "Mood Tracker" → Finish

**Mac:**
1. Go to System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Click "+" and add Mood Tracker application
4. Set to "Allow incoming connections"

**Linux (UFW):**
```bash
sudo ufw allow 3000/tcp
```

### 3. Port Forwarding (If accessing from outside local network)

If remote users need to access from outside your office network:

1. Log into your router's admin panel (typically `192.168.1.1` or `192.168.0.1`)
2. Find "Port Forwarding" or "Virtual Server" settings
3. Add a new port forwarding rule:
   - External Port: 3000
   - Internal Port: 3000
   - Internal IP: [Your server's local IP]
   - Protocol: TCP
4. Note your public IP address (visit https://whatismyipaddress.com)
5. Remote users should use: `http://[YOUR-PUBLIC-IP]:3000`

⚠️ **Security Warning:** Exposing your server to the internet without proper security is risky. Consider using:
- VPN for remote access
- Cloud deployment with SSL/HTTPS
- Firewall rules to limit access to known IPs

## Client Configuration

### Using the Settings Panel

1. Open Mood Tracker
2. Login with any account
3. Click "Settings" button in the dashboard
4. Enter Server URL in the format: `http://[IP-ADDRESS]:3000`
   - Local network: `http://192.168.1.100:3000`
   - Public access: `http://[PUBLIC-IP]:3000`
   - Cloud: `http://your-domain.com:3000`
5. Click "Save Server URL"
6. Restart the application

### Manual Configuration

Alternatively, edit localStorage in the browser console:
```javascript
localStorage.setItem('serverUrl', 'http://192.168.1.100:3000');
```
Then reload the app.

## Verifying Remote Connections

### On the Server

Check the console output - you'll see log messages when users connect:
```
Server running on 0.0.0.0:3000
Local access: http://localhost:3000
Network access: http://192.168.1.100:3000
Share this URL with remote users
```

### In the App

1. Open Dashboard → Settings
2. View "Active Remote Users" section
3. You'll see:
   - Username and location
   - IP address
   - Hostname
   - Login time

This confirms users are connecting remotely.

## Database Location

The SQLite database is stored at:
- **Electron App:** `backend/mood-tracker.db` in the application directory
- **Development:** `backend/mood-tracker.db` in the project folder

⚠️ **Important:** Back up this file regularly! It contains all mood data and user accounts.

## Backup Strategy

### Automatic Backup (Recommended)

Create a scheduled task to back up the database daily:

**Windows (Task Scheduler):**
```cmd
copy "C:\Path\To\MoodTracker\backend\mood-tracker.db" "C:\Backups\mood-tracker-%date:~-4,4%%date:~-10,2%%date:~-7,2%.db"
```

**Mac/Linux (Cron):**
```bash
0 2 * * * cp /path/to/backend/mood-tracker.db /path/to/backups/mood-tracker-$(date +\%Y\%m\%d).db
```

### Manual Backup

Simply copy `mood-tracker.db` to a safe location while the app is not running.

## Troubleshooting

### Remote Users Can't Connect

1. **Check server is running:** Server computer must have Mood Tracker running
2. **Verify IP address:** Confirm the IP hasn't changed (use static IP or DHCP reservation)
3. **Test network connectivity:** From client, ping the server: `ping [SERVER-IP]`
4. **Check firewall:** Ensure port 3000 is open on server
5. **Verify URL format:** Must be `http://` (not `https://`) and include port `:3000`

### "Network Error" Messages

- Server may be down or unreachable
- Incorrect server URL in settings
- Firewall blocking the connection
- Network issues (check internet/LAN connection)

### Sessions Not Showing in Settings

- Session tracking started with this update
- Old logins won't appear
- Users must login again after server update

### Database Corruption

If the database becomes corrupted:
1. Restore from latest backup
2. If no backup, delete `mood-tracker.db` (⚠️ loses all data)
3. Restart server - new database will be created

## Security Best Practices

1. **Use Strong Passwords:** Enforce minimum 8 characters with users
2. **Regular Backups:** Daily automatic backups to separate location
3. **Network Security:**
   - Use VPN for internet access instead of port forwarding
   - Or deploy to cloud with SSL/HTTPS
   - Keep server software updated
4. **Physical Security:** Secure the server computer
5. **Access Control:** Only give login credentials to authorized employees

## Performance Considerations

### Server Requirements

- **CPU:** Modern dual-core processor
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 1GB for app + growing database (typically < 100MB/year)
- **Network:** Standard office network is sufficient

### Concurrent Users

The server can handle:
- **1-50 users:** No issues on any modern hardware
- **50-200 users:** May need dedicated server hardware
- **200+ users:** Consider cloud deployment with load balancing

## Monitoring

### Check Server Status

Visit `http://[SERVER-IP]:3000/api/health` in a browser:
```json
{
  "status": "ok",
  "message": "Mood Tracker API is running"
}
```

### View Server Info

Visit `http://[SERVER-IP]:3000/api/server-info`:
```json
{
  "hostname": "OFFICE-SERVER",
  "addresses": ["192.168.1.100"],
  "port": 3000
}
```

## Advanced: HTTPS Setup (Cloud Deployment)

For production deployment with SSL:

1. Get a domain name (e.g., mood.yourcompany.com)
2. Deploy to cloud server
3. Use Nginx as reverse proxy with SSL certificate
4. Update client URLs to `https://mood.yourcompany.com`

Example Nginx configuration:
```nginx
server {
    listen 443 ssl;
    server_name mood.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Support

For issues or questions:
1. Check this guide and the main README.md
2. Review console output on server for errors
3. Check network connectivity and firewall settings

## Summary Checklist

**Server Setup:**
- [ ] Install Mood Tracker on server computer
- [ ] Note the server's IP address
- [ ] Configure firewall to allow port 3000
- [ ] Keep server running during work hours
- [ ] Set up automatic database backups

**Client Setup:**
- [ ] Install Mood Tracker on each user's computer
- [ ] Configure server URL in Settings
- [ ] Test connection by logging in
- [ ] Verify user appears in "Active Remote Users"

**Ongoing:**
- [ ] Monitor server status
- [ ] Back up database regularly
- [ ] Check for app updates
- [ ] Review remote user sessions periodically
