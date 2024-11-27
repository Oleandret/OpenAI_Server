import express from 'express';
import fetch from 'node-fetch';
import { getWeather } from '../functions/getWeather.js';

const router = express.Router();

router.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages, model = 'gpt-4', temperature = 0.7, max_tokens = 1000 } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        console.log('Mottok forespørsel:', messages);

        // Send forespørselen til OpenAI
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens,
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
            }),
        });

        const openaiResult = await openaiResponse.json();
        console.log('Respons fra OpenAI:', openaiResult);

        // Håndter funksjonskall
        const functionCall = openaiResult.choices[0]?.message?.function_call;
        if (functionCall) {
            const { name, arguments: args } = functionCall;

            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                console.log('Henter vær for lokasjon:', location);

                // Kall getWeather-funksjonen
                const weatherInfo = await getWeather(location);

                // Send tilbake værdata som respons
                return res.json({
                    response: weatherInfo,
                });
            }
        }

        // Returner OpenAI-respons hvis ingen funksjonskall trengs
        res.json(openaiResult);
    } catch (error) {
        console.error('Feil i /v1/chat/completions:', error);
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});

export default router;
