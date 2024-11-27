import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js'; // Default import

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for API-nøkkelvalidering
app.use((req, res, next) => {
    const apiKey = req.headers.authorization?.split(" ")[1]; // Forventet format: "Bearer <API_KEY>"
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Unauthorized - API key is missing or invalid" });
    }
    
    next(); // Fortsett til neste middleware eller rute
});

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
