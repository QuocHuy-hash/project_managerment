const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            description: "API endpoints for Shop Ecommerce",
            version: '1.0.1',
        },
        servers: [
            {
                url: "https://shop-ecommerce.click/",
                description: "Development Server"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication',
                },
                ClientIdHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-client-id',
                    description: 'Unique identifier for the client/user'
                },
                Authorization: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'athorization',
                    description: 'Token'
                }
            }
        },
        // Global security for all APIs, requiring both JWT Token and Client ID
        security: [
            {
                Authorization: [],
                ClientID: []
            }
        ],
    },
    apis: [
        path.resolve(__dirname, '../routes/access/*.js'),
        path.resolve(__dirname, '../routes/products/*.yml'),
        path.resolve(__dirname, '../routes/carts/*.js'),
        path.resolve(__dirname, '../routes/comment/*.yml'),
        path.resolve(__dirname, '../routes/carts/*.yml'),
        path.resolve(__dirname, '../routes/discount/*.yml'),
        path.resolve(__dirname, '../routes/orders/*.yml'),
        path.resolve(__dirname, '../routes/upload/*.yml'),
        path.resolve(__dirname, '../routes/notifications/*.yml'),
        path.resolve(__dirname, '../routes/users/*.yml'),
        path.resolve(__dirname, '../routes/Category/*.yml'),
        // path.resolve(__dirname, '../routes/oauth/*.yml'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

module.exports = { swaggerDocs, swaggerSpec };
