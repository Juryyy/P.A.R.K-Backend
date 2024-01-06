import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', // Log only info level and above. Change to 'debug' to log all levels
    format: winston.format.json(), // Log in JSON format. Can be replaced with winston.format.simple() for plain text logs
    defaultMeta: { service: 'your-service-name' }, // Optional: default metadata to assign to all logs
    transports: [
        // Write all logs to `combined.log`
        new winston.transports.File({ filename: 'combined.log' }),

        // Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

// If we're not in production then also log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;