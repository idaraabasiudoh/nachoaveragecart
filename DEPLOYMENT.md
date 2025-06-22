# Nacho-Average Cart Deployment Guide

This guide will help you deploy your Nacho-Average Cart application to nachoaveragecart.com.

## Prerequisites

1. A domain name (purchased from a domain registrar like Namecheap, GoDaddy, etc.)
2. A hosting provider account (recommendations below)
3. MongoDB Atlas account (for database hosting)
4. Environment variables for production

## Deployment Options

### Option 1: Deploy to a VPS (Digital Ocean, AWS EC2, Linode)

This option gives you the most control but requires more setup.

1. **Set up a VPS**:
   - Create a VPS instance (Ubuntu recommended)
   - Set up SSH access
   - Install Node.js, npm, and MongoDB (or use MongoDB Atlas)

2. **Configure your domain**:
   - Point your domain's A record to your VPS IP address
   - Set up HTTPS with Let's Encrypt

3. **Deploy your application**:
   ```bash
   # Clone your repository
   git clone <your-repo-url>
   cd nachoaveragecart
   
   # Install dependencies
   npm install --prefix client
   npm install --prefix server
   
   # Build the client
   npm run build --prefix client
   
   # Start the server in production mode
   cd server
   NODE_ENV=production npm start
   ```

4. **Set up PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "nacho-average-cart" -- --node-args="--env=production"
   pm2 startup
   pm2 save
   ```

### Option 2: Deploy to Heroku (Simpler)

1. **Create a Heroku account and install the CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create a Heroku app**:
   ```bash
   heroku create nacho-average-cart
   ```

3. **Add a Procfile to the root directory**:
   ```
   web: cd server && npm start
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set GOOGLE_API_KEY=your_google_api_key
   heroku config:set SERPAPI_KEY=your_serpapi_key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy the application**:
   ```bash
   git push heroku main
   ```

6. **Connect your custom domain**:
   ```bash
   heroku domains:add yourdomain.com
   heroku domains:add www.yourdomain.com
   ```

7. **Update your domain's DNS settings** with the CNAME records provided by Heroku.

### Option 3: Deploy to Netlify (Frontend) and Render (Backend)

This approach separates frontend and backend hosting.

#### Frontend (Netlify):

1. Create a Netlify account
2. Connect your GitHub repository
3. Set the build command to: `cd client && npm install && npm run build`
4. Set the publish directory to: `client/build`
5. Add environment variables for API URL
6. Connect your custom domain in Netlify settings

#### Backend (Render):

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command to: `cd server && npm install`
5. Set the start command to: `cd server && npm start`
6. Add environment variables
7. Set up a custom subdomain (api.yourdomain.com)

## Environment Variables

Make sure to set these environment variables in your production environment:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
SERPAPI_KEY=your_serpapi_key
NODE_ENV=production
PORT=8080 (or any port your hosting provider uses)
```

## Updating the Client API Configuration

If you're deploying frontend and backend separately, update the API base URL in your client code:

Create a file at `/client/src/config.js`:

```javascript
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' // Your production API URL
    : 'http://localhost:8080'       // Local development URL
};

export default config;
```

Then update your API service files to use this configuration.

## Post-Deployment Checklist

1. Verify that the application loads correctly
2. Test user registration and login
3. Test product search functionality
4. Test shopping list creation and management
5. Test image upload and processing
6. Test meal suggestions feature
7. Set up monitoring and analytics

## Troubleshooting

- **404 errors on page refresh**: Make sure your server is configured to serve the React app for all routes
- **API connection issues**: Check CORS settings and API URL configuration
- **Database connection errors**: Verify MongoDB connection string and network access settings
- **Image upload failures**: Check file permissions and storage configuration

For further assistance, consult the documentation of your hosting provider.
