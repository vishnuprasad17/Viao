import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/configDB';

dotenv.config();
initializeDatabase();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});