import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import routes from './routes'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Request,Response,NextFunction } from 'express';
import path from 'path';
import { globalErrorHandler } from './shared/middlewares/error-handler';

import initializeSocket from './socketServer.ts';
import { createServer } from 'http';

const app = express();

dotenv.config();
const server = createServer(app);

const corsOptions = {
  origin: ['http://localhost:5000'], // Allow only this origin
  credentials: true, // Allow credentials
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(
    session({
      secret: process.env.SESSION_SECRET!, 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, httpOnly: true, maxAge:24*60*60*1000, sameSite:"lax" }
    })
  );

app.use(cookieParser());

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.use('/api' , routes);
app.use(globalErrorHandler);

initializeSocket(server);
app.get('*',(req:Request,res:Response) =>{
  res.sendFile(path.join(__dirname,'../../Client/index.html'))
})

const PORT = process.env.PORT;

(async () => {
  try {
    // Connect to the database
    await initializeDatabase();

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}...`);
    });
  } catch (error) {
    console.error('Unexpected error during startup:', error);
  }
})();