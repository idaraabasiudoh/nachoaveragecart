const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server');

// Create a server for AWS Lambda
const server = awsServerlessExpress.createServer(app);

// Export the handler function for AWS Lambda
exports.handler = (event, context) => {
  console.log('Lambda function invoked');
  return awsServerlessExpress.proxy(server, event, context);
};
