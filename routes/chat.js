import { getWeather } from '../functions/getWeather.js';

router.post('/v1/chat/completions', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        // Send forespørsel til OpenAI for analyse
        const openaiResult = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: messages,
            function_call: 'auto', // Automatisk funksjonskall
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

        // Sjekk om OpenAI foreslår et funksjonskall
        const functionCall = openaiResult.choices[0]?.message?.function_call;
        if (functionCall) {
            const { name, arguments: args } = functionCall;

            // Håndter kun getWeather-funksjonskall
            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                const weatherInfo = await getWeather(location);

                return res.json({
                    response: weatherInfo,
                });
            }
        }

        // Hvis ingen funksjonskall ble foreslått, returner OpenAI-svaret
        return res.json({
            response: openaiResult.choices[0]?.message?.content,
        });
    } catch (error) {
        console.error('Feil i /v1/chat/completions:', error);
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});
