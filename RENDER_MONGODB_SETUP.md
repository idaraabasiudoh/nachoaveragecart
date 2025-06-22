# Setting Up MongoDB Atlas on Render for Nacho-Average Cart

Follow these steps to configure your MongoDB Atlas connection on Render:

## Step 1: Add Your Connection String to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Select your Nacho-Average Cart backend service
3. Navigate to the "Environment" tab
4. Add a new environment variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://idaraemmanueludoh:r0YxVT3GQjSpJLJv@cluster0.8cdyiwc.mongodb.net/nachoaveragecart?retryWrites=true&w=majority&appName=Cluster0`
   
   Note: Make sure to add the database name `nachoaveragecart` after the `.net/` part of the connection string

5. Click "Save Changes"

## Step 2: Add Other Required Environment Variables

Make sure these other environment variables are also set in Render:

1. `JWT_SECRET`: A secure random string for JWT token generation
2. `GOOGLE_API_KEY`: Your Google API key for Gemini AI
3. `SERPAPI_KEY`: Your SerpAPI key for product searches
4. `NODE_ENV`: Set this to `production`

## Step 3: Redeploy Your Application

1. Go to the "Manual Deploy" section
2. Select "Deploy latest commit"
3. Wait for the deployment to complete

## Step 4: Verify the Connection

1. After deployment, check the logs in Render
2. Look for the message: "MongoDB connected successfully"
3. If you see this message, your database connection is working properly

## Troubleshooting

If you still encounter issues:

1. **Check Network Access**: In MongoDB Atlas, make sure you've allowed access from anywhere (0.0.0.0/0) or specifically from Render's IP addresses
2. **Verify Database Name**: Make sure you've added `nachoaveragecart` as the database name in the connection string
3. **Check User Permissions**: Ensure the MongoDB user has read/write permissions on the database
4. **Restart the Service**: Sometimes a full service restart is needed after updating environment variables

## Next Steps After Successful Connection

Once your MongoDB connection is working:

1. Test your application's functionality:
   - User registration and login
   - Product searches
   - Shopping list creation and management
   - Image uploads
   - Meal suggestions

2. Set up database indexes for better performance (if needed)

3. Consider setting up database backups in MongoDB Atlas
