router.post('/v1/chat/completions', async (req, res) => {
    try {
        const functionCall = openaiResult.choices[0]?.message?.function_call;
        if (functionCall) {
            const { name, arguments: args } = functionCall;

            if (name === 'getWeather') {
                const location = JSON.parse(args).location;
                const weatherInfo = await getWeather(location);

                // Returner responsen her
                return res.json({
                    response: weatherInfo,
                });
            }
        }

        // Standard respons
        res.json(openaiResult);
    } catch (error) {
        console.error('Feil:', error);
        res.status(500).json({ error: 'Intern feil' });
    }
});
