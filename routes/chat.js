import express from 'express';
import { getWeather } from '../functions/getWeather.js';

const router = express.Router();

router.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages, model = 'gpt-4' } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        console.log('Mottok forespørsel:', messages);

        // Simulerer funksjonskall fra OpenAI
        const functionCall = {
            name: 'getWeather',
            arguments: JSON.stringify({ location: 'Stavanger' }),
        };

        if (functionCall.name === 'getWeather') {
            const location = JSON.parse(functionCall.arguments).location;
            const weatherInfo = await getWeather(location);

            // Returner værdata som respons
            return res.json({
                response: weatherInfo,
            });
        }

        // Hvis ingen funksjonskall ble trigget
        res.json({ response: 'Ingen funksjonskall ble trigget.' });
    } catch (error) {
        console.error('Feil i /v1/chat/completions:', error);
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});

export default router;
