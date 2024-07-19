import paths from './paths/paths';
import schemas from './schemas';
import envConfig from "../configs/env-config";

export default {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Park Backend API',
            version: '1.0.0',
        },
    },
        servers: [
            {
                url: envConfig.getEnv('BACKEND_URL')
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
                APIKey: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token"
                }
            },
            schemas: {
                ...schemas,
            },
    },
    apis:
        [
            './src/docs/paths/*.ts',
            './src/docs/schemas/*.ts'
        ]
}

