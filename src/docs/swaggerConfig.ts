import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swagger from '../docs/swagger';
import Logger from "../configs/logger";
import envConfig from "../configs/env-config";

const options: swaggerJsdoc.Options = swagger

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    const url = envConfig.getEnv('BACKEND_URL');
    Logger.info(`Docs available at ${url}/docs`);
}

export default swaggerDocs;