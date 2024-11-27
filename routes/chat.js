import express from 'express';
import { getWeather } from '../functions/getWeather.js';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

// Initialiser OpenAI-klienten
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Miljøvariabel
});
const openai = new OpenAIApi(configuration);

router.post('/chat/completions', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        const openaiResult = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: messages,
            function_call: 'auto',
            functions: [
                {
                    name: 'getWeather',
                    description: 'Henter værdata for en spesifisert lokasjon',
                    parameters: {
                        type: 'object',
                        properties: {
                            location: {
                                type: 'string',
                                description: 'Navnet på stedet, f.eks. Stavanger.',
                            },
                        },
                        required: ['location'],
                    },
                },
            ],
        });

        const functionCall = openaiResult.choices[0]?.message?.function_call;

        if (functionCall) {
            const { name, arguments: args } = functionCall;
            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                const weatherInfo = await getWeather(location);

                return res.json({ response: weatherInfo });
            }
        }

        return res.json({ response: openaiResult.choices[0]?.message?.content });
    } catch (error) {
        console.error('Feil i /chat/completions:', error);
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});

export default router; // Default export av router
