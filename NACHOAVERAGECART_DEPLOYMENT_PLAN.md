# Nacho-Average Cart Deployment Plan

## Domain Setup: nachoaveragecart.com

This document outlines the specific steps to deploy Nacho-Average Cart to nachoaveragecart.com.

## Recommended Deployment Architecture

For nachoaveragecart.com, we recommend a split deployment approach:

1. **Frontend**: Deploy to Netlify (nachoaveragecart.com)
2. **Backend**: Deploy to Render (api.nachoaveragecart.com)

This architecture provides:
- Optimized hosting for React frontend
- Scalable backend with database connection
- Clean separation of concerns

## Step 1: Frontend Deployment (Netlify)

1. **Create a Netlify account** at [netlify.com](https://www.netlify.com/)

2. **Connect your GitHub repository**
   - Go to Netlify dashboard → "New site from Git"
   - Select GitHub and authorize Netlify
   - Select your nachoaveragecart repository

3. **Configure build settings**
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`

4. **Set environment variables**
   - No need to set REACT_APP_API_URL as we're using the config.js file

5. **Configure custom domain**
   - Go to "Domain settings" → "Add custom domain"
   - Enter: nachoaveragecart.com
   - Follow Netlify's instructions for DNS configuration
   - Add www.nachoaveragecart.com as well and set up redirect

## Step 2: Backend Deployment (Render)

1. **Create a Render account** at [render.com](https://render.com/)

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Name: nacho-average-cart-api
   - Root Directory: server
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select appropriate instance type (at least 512MB RAM)

3. **Set environment variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_api_key
   SERPAPI_KEY=your_serpapi_key
   NODE_ENV=production
   PORT=10000
   ```

4. **Configure custom subdomain**
   - Go to "Settings" → "Custom Domain"
   - Add: api.nachoaveragecart.com
   - Follow Render's instructions for DNS configuration

## Step 3: Database Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas account** if you don't have one
2. **Create a new cluster** (free tier is fine to start)
3. **Create a database user** with read/write permissions
4. **Whitelist all IP addresses** (0.0.0.0/0) for simplicity
5. **Get your connection string** and use it for the MONGODB_URI environment variable

## Step 4: DNS Configuration

Configure your domain registrar's DNS settings:

1. **For frontend (Netlify)**:
   - Add Netlify's nameservers OR
   - Create A records pointing to Netlify's load balancer IPs

2. **For backend API (Render)**:
   - Create a CNAME record:
     - Name: api
     - Value: [your-render-app-name].onrender.com

3. **Verify DNS propagation** (may take up to 48 hours)

## Step 5: SSL Configuration

Both Netlify and Render provide free SSL certificates automatically.

1. **Enable HTTPS** in both platforms
2. **Force HTTPS redirects** for all traffic

## Step 6: Post-Deployment Verification

1. **Test the frontend**: Visit nachoaveragecart.com
2. **Test the API**: Try accessing api.nachoaveragecart.com/api/products/search
3. **Test full application flow**:
   - User registration/login
   - Product search
   - Shopping list creation
   - Image upload
   - Meal suggestions

## Monitoring and Maintenance

1. **Set up monitoring** with Render's built-in tools
2. **Configure alerts** for downtime or errors
3. **Implement regular backups** of your MongoDB database
4. **Plan for scaling** if user traffic increases

## Cost Estimates

- **Netlify**: Free tier for frontend hosting
- **Render**: ~$7/month for basic web service
- **MongoDB Atlas**: Free tier to start, scaling options available

## Support Resources

- Netlify Documentation: [docs.netlify.com](https://docs.netlify.com/)
- Render Documentation: [render.com/docs](https://render.com/docs)
- MongoDB Atlas Documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)

## Timeline

- DNS Setup: 1 day
- Frontend Deployment: 1 day
- Backend Deployment: 1 day
- Testing and Verification: 1-2 days
- Total Estimated Time: 3-5 days
