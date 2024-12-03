import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/configDB';
import adminRoutes from './features/admin/routes/auth.routes'
import userRoutes from './features/user/routes/auth.routes'
import vendorRoutes from './features/vendor/routes/vendor.routes'
import cors from 'cors';
import session from 'express-session';

dotenv.config();
initializeDatabase();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
    session({
      secret: process.env.SESSION_SECRET!, 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );

app.use('/api' , adminRoutes);
app.use('/api' , userRoutes);
app.use('/api' , vendorRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});