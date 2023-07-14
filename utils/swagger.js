const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Farm Automation and Control System API',
      version: '1.0.0',
      description: 'My API documentation with Swagger',
    },
    tags: [
      {
        name: 'Users',
        description: 'Endpoints related to users',
      },
      {
        name: 'Farms',
        description: 'Endpoints related to farms',
      },
      {
        name: 'Plants',
        description: 'Endpoints related to Plants',
      },
      {
        name: 'Data',
        description: 'Endpoints related to data coming from the sensors',
      },
      {
        name: 'FarmsOwnerships',
        description: 'Endpoints related to the ownerships of the farm',
      }
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

exports.swaggerDocs = async (app, port) => {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
};