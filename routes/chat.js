router.post('/chat/completions', async (req, res) => {
    try {
        console.log('Mottok forespørsel:', req.body);

        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            console.error('Ugyldig format for meldinger:', req.body);
            return res.status(400).json({ error: 'Meldinger mangler eller er i feil format.' });
        }

        // Legg til en system-prompt før brukerens meldinger
        const systemPrompt = {
            role: 'system',
            content: 'Du er en hjelpsom assistent som kan utføre funksjonskall og svare på spørsmål effektivt.',
        };

        const fullMessages = [systemPrompt, ...messages];

        console.log('Sender forespørsel til OpenAI...');

        const openaiResult = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: fullMessages,
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

        const functionCall = openaiResult.data.choices[0]?.message?.function_call;
        if (functionCall) {
            console.log('Funksjonskall oppdaget:', functionCall);

            const { name, arguments: args } = functionCall;

            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                const weatherInfo = await getWeather(location);

                console.log('Returnerer værdata:', weatherInfo);
                return res.json({ response: weatherInfo });
            }
        }

        const response = openaiResult.data.choices[0]?.message?.content;
        console.log('Returnerer svar fra OpenAI:', response);

        return res.json({ response });
    } catch (error) {
        console.error('Feil i /chat/completions:', error.message, error.stack);
        res.status(500).json({ error: 'Noe gikk galt under behandling av forespørselen.' });
    }
});
