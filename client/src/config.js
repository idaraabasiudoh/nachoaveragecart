const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.nachoaveragecart.com' // Production API URL
    : 'http://localhost:8080',            // Local development URL
  SITE_URL: process.env.NODE_ENV === 'production'
    ? 'https://nachoaveragecart.com'      // Production site URL
    : 'http://localhost:3000'             // Local development site URL
};

export default config;
