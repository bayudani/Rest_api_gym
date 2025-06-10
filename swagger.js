// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API FitID',
        version: '1.0.0',
        description: 'Dokumentasi API FitID',
    },
    servers: [
        {
            url: 'http://localhost:3001/api',
            description: 'Local dev server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // ini target file yang ada comment /** swagger-nya */
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
