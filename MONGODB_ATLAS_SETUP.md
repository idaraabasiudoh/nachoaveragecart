# MongoDB Atlas Setup Guide for Nacho-Average Cart

This guide will help you set up MongoDB Atlas for your Nacho-Average Cart application deployed on Render.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account
2. Complete the registration process

## Step 2: Create a New Cluster

1. After logging in, click "Build a Database"
2. Select the "FREE" tier (M0 Sandbox)
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to your users (preferably US East for Render compatibility)
5. Click "Create Cluster" (this may take a few minutes to provision)

## Step 3: Set Up Database Security

1. In the left sidebar, click "Database Access" under SECURITY
2. Click "Add New Database User"
3. Create a new user with a secure password
   - Username: `nachoaveragecart_user` (or your preferred name)
   - Password: Generate a secure password (save this for later)
   - Authentication Method: Password
   - Database User Privileges: "Read and write to any database"
4. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access" under SECURITY
2. Click "Add IP Address"
3. For development, you can select "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, you should restrict this to Render's IP addresses
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to your cluster by clicking "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string (it will look like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add your database name to the connection string:
   ```
   mongodb+srv://nachoaveragecart_user:your_password@cluster0.xxxxx.mongodb.net/nachoaveragecart?retryWrites=true&w=majority
   ```

## Step 6: Add the Connection String to Render

1. Go to your Render dashboard
2. Select your Nacho-Average Cart backend service
3. Go to "Environment" tab
4. Add a new environment variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string from Step 5
5. Click "Save Changes"
6. Restart your service by clicking "Manual Deploy" > "Deploy latest commit"

## Step 7: Verify Connection

1. After your service restarts, check the logs in Render
2. You should see "MongoDB connected successfully" in the logs
3. If you still see connection errors, double-check:
   - Your connection string is correct
   - The database user has the correct permissions
   - Network access is properly configured

## Common Issues and Solutions

### Connection Timeout
- Ensure your IP whitelist includes 0.0.0.0/0 or Render's IP addresses
- Check if your MongoDB Atlas cluster is in a region with good connectivity to Render

### Authentication Failed
- Verify your username and password in the connection string
- Ensure special characters in the password are properly URL-encoded

### Cannot Connect to Replica Set
- Make sure you're using the correct connection string format for MongoDB Atlas
- Verify that you've included the `retryWrites=true&w=majority` parameters

## Next Steps

Once your MongoDB connection is working:

1. Your application should now be functioning correctly on Render
2. Consider setting up database backups in MongoDB Atlas
3. For production, implement more restrictive IP whitelisting
4. Set up database monitoring in MongoDB Atlas

For additional help, consult the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) or [Render Documentation](https://render.com/docs).
