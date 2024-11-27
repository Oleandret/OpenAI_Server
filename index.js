import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruter
app.use(chatRoutes);

// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});
