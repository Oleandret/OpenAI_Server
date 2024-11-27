import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js'; // Default import

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helsesjekk for rotendepunktet
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Bruk rutene fra chat.js
app.use('/v1', chatRoutes);

// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});
