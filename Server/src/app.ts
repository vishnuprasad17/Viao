import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/configDB';
import adminRoutes from './features/admin/routes/auth.routes'
import userRoutes from './features/user/routes/auth.routes'
import vendorRoutes from './features/vendor/routes/vendor.routes'
import cors from 'cors';
import { userOtpExpire, emailVerifyOtp, vendorOtpExpire } from './shared/middlewares/otp.expiration';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Request,Response,NextFunction } from 'express';
import path from 'path';


const app = express();

dotenv.config();
initializeDatabase();

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
      cookie: { secure: false, maxAge:24*60*60*1000, sameSite:"lax" }
    })
  );

app.use(cookieParser());
app.use(userOtpExpire);
app.use(emailVerifyOtp);
app.use(vendorOtpExpire);

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.get('*',(req:Request,res:Response) =>{
  res.sendFile(path.join(__dirname,'../../Client/index.html'))
})

app.use('/api' , adminRoutes);
app.use('/api' , userRoutes);
app.use('/api' , vendorRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});