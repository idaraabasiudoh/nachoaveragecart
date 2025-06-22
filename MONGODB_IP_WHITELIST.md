# MongoDB Atlas IP Whitelist Setup Guide

This guide will help you add your IP address and Render's IP addresses to MongoDB Atlas whitelist.

## Step 1: Access Network Access Settings

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com)
2. Select your project
3. In the left sidebar, click on "Network Access" under SECURITY

## Step 2: Add Your Current IP Address

1. Click the "ADD IP ADDRESS" button
2. Click "ADD CURRENT IP ADDRESS" 
3. This will automatically add your current IP address
4. Add a comment like "Local Development" to help you remember
5. Click "Confirm"

## Step 3: Add Render's IP Addresses

Since you're deploying to Render, you need to allow Render's servers to access your MongoDB Atlas database:

1. Click the "ADD IP ADDRESS" button again
2. Select "Allow Access from Anywhere" (this adds 0.0.0.0/0)
   - Note: This allows access from any IP address. For production environments, you may want to restrict this later.
   - For now, this is the easiest way to ensure Render can connect.
3. Add a comment like "Render Deployment"
4. Click "Confirm"

## Step 4: Wait for Changes to Apply

1. Changes to the IP whitelist can take a few minutes to propagate
2. The status column should show "Active" for each entry

## Step 5: Test the Connection

### For Local Development:
```bash
# From your project directory
cd server
node -e "
  require('dotenv').config();
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('Connection error:', err));
"
```

### For Render Deployment:
1. Go to your Render dashboard
2. Select your Nacho-Average Cart backend service
3. Click "Manual Deploy" > "Deploy latest commit"
4. Check the logs for "MongoDB connected successfully"

## Common Issues

### Still Can't Connect After Adding IP
- MongoDB Atlas can take a few minutes to update the whitelist
- Try restarting your application
- Verify that your connection string is correct
- Check if your IP address has changed (especially if using a VPN)

### Connection Works Locally But Not on Render
- Make sure you've added 0.0.0.0/0 to allow access from anywhere
- Verify that your environment variables on Render are set correctly
- Check Render logs for specific error messages

### Security Considerations
Adding 0.0.0.0/0 (allow access from anywhere) is convenient but less secure. Once your application is stable, consider:

1. Removing the 0.0.0.0/0 entry
2. Adding only specific IP addresses for Render (contact Render support for current IP ranges)
3. Using MongoDB Atlas Private Endpoint for more secure connections
