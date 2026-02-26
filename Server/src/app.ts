import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './infrastructure/config/database';
import routes from './api/ApiRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { cleanExpiredBookedDates } from './infrastructure/cron/cleanExpiredBookedDates';
import session from 'express-session';
import { Request,Response,NextFunction } from 'express';
import { globalErrorHandler } from './domain/errors/Error-handler';

import initializeSocket from './socketServer';
import { createServer } from 'http';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

dotenv.config();
cleanExpiredBookedDates();

const server = createServer(app);

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        name: 'sessionId',
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: isProduction ? 'strict' : 'lax',
            domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
        },
        rolling: true // Reset expiry on each request
    })
);

app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized request: ${key} in ${req.path}`);
    }
}));

if (isProduction) {
    app.set('trust proxy', 1);
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        next(err);
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api' , routes);

app.use(globalErrorHandler);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

const gracefulShutdown = async () => {
    console.log('Received shutdown signal. Closing server gracefully...');
    
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Startup
(async () => {
    try {
        // Connect to the database
        await initializeDatabase();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } catch (error) {
        console.error('Unexpected error during startup:', error);
        process.exit(1);
    }
})();