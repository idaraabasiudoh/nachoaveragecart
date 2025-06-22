# Nacho-Average Cart AWS Amplify Deployment Guide

This guide will walk you through deploying the Nacho-Average Cart application to AWS Amplify with the domain nachoaveragecart.com using the AWS Amplify Console.

## Prerequisites

1. AWS Account
2. Domain name (nachoaveragecart.com) with access to DNS settings
3. MongoDB Atlas account with your database set up
4. Your code pushed to a Git repository (GitHub, GitLab, BitBucket, etc.)

## Step 1: Access the AWS Amplify Console

1. Log in to your AWS account
2. Navigate to the AWS Amplify Console (search for "Amplify" in the AWS services search bar)
3. Click "New app" and select "Host web app"

## Step 2: Connect Your Repository

1. Choose your Git provider (GitHub, GitLab, BitBucket, etc.)
2. Authorize AWS Amplify to access your repositories
3. Select your nachoaveragecart repository
4. Choose the branch you want to deploy (usually `main` or `master`)

## Step 3: Configure Build Settings

In the "App build specification" section:

1. Keep the default option to use the `amplify.yml` file we've already created
2. Alternatively, you can review and edit the build settings directly in the console

The existing `amplify.yml` file includes:
- Frontend build commands for your React app
- Backend build commands for your Express server
- Proper artifact paths for both frontend and backend

## Step 4: Set Environment Variables

In the AWS Amplify Console:
1. After connecting your repository, you'll see a screen to configure build settings
2. Scroll down to the "Environment variables" section
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.8cdyiwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
SERPAPI_KEY=your_serpapi_key
NODE_ENV=production
```

4. Click "Next" to proceed

## Step 5: Review and Deploy

1. Review your build settings and environment variables
2. Click "Save and deploy"
3. Wait for the initial build and deployment to complete
   - You can monitor the progress in the Amplify Console
   - This may take several minutes

## Step 6: Configure Custom Domain

1. Once deployment is complete, in the left navigation menu, click "Domain management"
2. Click "Add domain"
3. Enter "nachoaveragecart.com" and click "Configure domain"
4. Choose your domain validation method (DNS validation or email validation)
5. Follow the instructions to add the required DNS records at your domain registrar
   - This typically involves adding CNAME records
   - DNS propagation may take up to 48 hours

## Step 7: Set Up Redirects and Rewrites

To ensure your API routes work correctly:

1. In the left navigation menu, click on "Rewrites and redirects"
2. Add the following rules:
   - Source pattern: `/api/<*>`
   - Target address: `/api/<*>`
   - Type: 200 (Rewrite)
   
3. Add another rule for client-side routing:
   - Source pattern: `/<*>`
   - Target address: `/index.html`
   - Type: 200 (Rewrite)

## Step 8: Verify Deployment

1. Once the domain is configured and DNS has propagated:
   - Visit nachoaveragecart.com to verify the frontend is working
   - Test API endpoints to ensure the backend is functioning correctly

## Troubleshooting

### API Connection Issues
- In the Amplify Console, check "Rewrites and redirects" to ensure API routes are properly configured
- Verify that environment variables are set correctly
- Check the browser console for any CORS errors

### Database Connection Issues
- Ensure your MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0)
- Verify your connection string is correct in the environment variables
- Check the Amplify logs for connection errors

### Build Failures
- In the Amplify Console, click on the failed build to view detailed logs
- Common issues include missing dependencies or build script errors
- You can make fixes in your repository and push again to trigger a new build

## Monitoring and Maintenance

- In the Amplify Console, you can view basic metrics about your application
- For more detailed monitoring, use AWS CloudWatch
- Set up CloudWatch alarms for critical metrics
- Regularly back up your MongoDB database using Atlas backup features

## Cost Management

- AWS Amplify has a free tier that includes:
  - 1,000 build minutes per month
  - 5GB stored per month
  - 15GB served per month
- Monitor your AWS billing dashboard regularly
- Set up AWS Budgets to get alerts when costs exceed thresholds
