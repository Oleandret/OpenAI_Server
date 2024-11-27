import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { getWeather } from '../functions/getWeather.js';

const router = express.Router();

// Initialiser OpenAI-klienten
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Sørg for at miljøvariabelen er riktig konfigurert
});
const openai = new OpenAIApi(configuration);

router.post('/chat/completions', async (req, res) => {
    try {
        console.log('Mottok forespørsel:', req.body); // Logg innkommende forespørsel

        const { messages } = req.body;

        // Valider innkommende meldinger
        if (!messages || !Array.isArray(messages)) {
            console.error('Ugyldig format for meldinger:', req.body);
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        console.log('Sender forespørsel til OpenAI...');

        // Send forespørselen til OpenAI
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

        console.log('Mottok svar fra OpenAI:', openaiResult.data);

        // Sjekk om det er foreslått et funksjonskall
        const functionCall = openaiResult.data.choices[0]?.message?.function_call;
        if (functionCall) {
            console.log('Funksjonskall oppdaget:', functionCall);

            const { name, arguments: args } = functionCall;

            // Håndter `getWeather`-funksjonskall
            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                const weatherInfo = await getWeather(location);

                console.log('Returnerer værdata:', weatherInfo);
                return res.json({ response: weatherInfo });
            }
        }

        // Returner standard OpenAI-svar hvis ingen funksjonskall
        const response = openaiResult.data.choices[0]?.message?.content;
        console.log('Returnerer svar fra OpenAI:', response);

        return res.json({ response });
    } catch (error) {
        console.error('Feil i /chat/completions:', error.message, error.stack); // Detaljert logging av feil
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});

export default router; // Eksporter ruter som default
