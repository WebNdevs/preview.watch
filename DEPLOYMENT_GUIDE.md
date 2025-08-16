# PR.Watch Application Deployment Guide

This guide will walk you through deploying the PR.Watch application (Laravel backend + Next.js frontend) on Google Cloud Platform from scratch.

## Prerequisites

- Google Cloud Platform account
- Basic knowledge of Linux commands
- Domain name (optional, for production)

## Step 1: Create and Configure GCP VM Instance

### 1.1 Create VM Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Compute Engine** > **VM instances**
3. Click **Create Instance**
4. Configure the instance:
   - **Name**: `pr-watch-server`
   - **Region**: Choose closest to your users (e.g., `us-central1`)
   - **Zone**: `us-central1-a`
   - **Machine type**: `e2-medium` (2 vCPU, 4 GB memory) - minimum recommended
   - **Boot disk**: 
     - **Operating System**: Ubuntu
     - **Version**: Ubuntu 22.04 LTS
     - **Size**: 20 GB (minimum)
   - **Firewall**: Check both "Allow HTTP traffic" and "Allow HTTPS traffic"

5. Click **Create**

### 1.2 Configure Firewall Rules

1. Go to **VPC network** > **Firewall**
2. Click **Create Firewall Rule**
3. Create rules for:
   - **Laravel Backend** (Port 8000):
     - Name: `allow-laravel-8000`
     - Direction: Ingress
     - Action: Allow
     - Targets: All instances in the network
     - Source IP ranges: `0.0.0.0/0`
     - Protocols and ports: TCP, port 8000
   
   - **Next.js Frontend** (Port 3000):
     - Name: `allow-nextjs-3000`
     - Direction: Ingress
     - Action: Allow
     - Targets: All instances in the network
     - Source IP ranges: `0.0.0.0/0`
     - Protocols and ports: TCP, port 3000

## Step 2: Connect to VM and Initial Setup

### 2.1 Connect via SSH

```bash
# From GCP Console, click "SSH" next to your instance
# Or use gcloud CLI:
gcloud compute ssh pr-watch-server --zone=us-central1-a
```

### 2.2 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Required Software

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PHP 8.2 and extensions
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-gd php8.2-sqlite3

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2
```

## Step 3: Clone and Setup Application

### 3.1 Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your actual repo URL)
sudo git clone https://github.com/yourusername/pr-watch.git
sudo chown -R $USER:$USER pr-watch
cd pr-watch
```

### 3.2 Setup Laravel Backend

```bash
cd auth-project

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure .env file
nano .env
```

**Update .env file:**
```env
APP_NAME="PR Watch"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=http://YOUR_VM_EXTERNAL_IP:8000

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/pr-watch/auth-project/database/database.sqlite

# CORS settings
SANCTUM_STATEFUL_DOMAINS=YOUR_VM_EXTERNAL_IP:3000,localhost:3000
SESSION_DOMAIN=YOUR_VM_EXTERNAL_IP
```

```bash
# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate --force

# Seed database (optional)
php artisan db:seed --force

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3.3 Setup Next.js Frontend

```bash
cd ../auth-frontend

# Install dependencies
npm install

# Create production environment file
cp .env.local.example .env.local
nano .env.local
```

**Update .env.local:**
```env
NEXT_PUBLIC_API_URL=http://YOUR_VM_EXTERNAL_IP:8000
NEXT_PUBLIC_APP_URL=http://YOUR_VM_EXTERNAL_IP:3000
```

```bash
# Build the application
npm run build
```

## Step 4: Configure Process Management

### 4.1 Setup PM2 for Laravel

Create PM2 ecosystem file:
```bash
cd /var/www/pr-watch
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'laravel-backend',
      script: 'php',
      args: 'artisan serve --host=0.0.0.0 --port=8000',
      cwd: '/var/www/pr-watch/auth-project',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/pr-watch/auth-frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### 4.2 Start Applications with PM2

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above

# Check status
pm2 status
```

## Step 5: Configure Nginx (Optional - for production)

### 5.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/pr-watch
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Laravel)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 Enable Site

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/pr-watch /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: SSL Certificate (Production)

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate

```bash
# Replace with your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Step 7: Monitoring and Maintenance

### 7.1 Useful PM2 Commands

```bash
# View logs
pm2 logs

# Restart applications
pm2 restart all

# Stop applications
pm2 stop all

# Monitor resources
pm2 monit
```

### 7.2 System Monitoring

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
top
```

## Step 8: Backup Strategy

### 8.1 Database Backup Script

Create backup script:
```bash
nano /home/$USER/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup SQLite database
cp /var/www/pr-watch/auth-project/database/database.sqlite $BACKUP_DIR/database_$DATE.sqlite

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/pr-watch

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sqlite" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/$USER/backup.sh

# Add to crontab (daily backup at 2 AM)
crontab -e
# Add: 0 2 * * * /home/$USER/backup.sh
```

## Troubleshooting

### Common Issues

1. **Port Access Issues**:
   - Ensure GCP firewall rules are configured
   - Check if ports are listening: `sudo netstat -tlnp`

2. **Permission Issues**:
   ```bash
   sudo chown -R www-data:www-data /var/www/pr-watch/auth-project/storage
   sudo chmod -R 775 /var/www/pr-watch/auth-project/storage
   ```

3. **Laravel Issues**:
   ```bash
   # Clear caches
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

4. **Next.js Build Issues**:
   ```bash
   # Rebuild application
   cd /var/www/pr-watch/auth-frontend
   rm -rf .next
   npm run build
   pm2 restart nextjs-frontend
   ```

### Logs Location

- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- Laravel logs: `/var/www/pr-watch/auth-project/storage/logs/`

## Security Considerations

1. **Firewall**: Only open necessary ports
2. **Updates**: Regularly update system packages
3. **Backups**: Implement regular backup strategy
4. **SSL**: Use HTTPS in production
5. **Environment**: Never commit `.env` files to version control
6. **Database**: Use strong passwords for production databases

## Performance Optimization

1. **Laravel**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Next.js**: Already optimized with `npm run build`

3. **Nginx**: Enable gzip compression and caching

4. **Database**: Consider upgrading to MySQL/PostgreSQL for production

---

**Note**: Replace `YOUR_VM_EXTERNAL_IP` and `YOUR_DOMAIN_OR_IP` with your actual VM's external IP address or domain name throughout this guide.

For production deployments, consider using a managed database service like Cloud SQL and implementing proper monitoring with tools like Google Cloud Monitoring.