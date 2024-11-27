import fetch from 'node-fetch';

export async function getWeather(location) {
    const url = `https://courageous-quietude-production.up.railway.app/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return `Været i ${location}: ${data.weather_description}, temperatur: ${data.temperature}°C.`;
        } else {
            return `Kunne ikke hente værdata for ${location}: ${data.message}`;
        }
    } catch (error) {
        console.error('Feil ved henting av værdata:', error);
        return 'Kunne ikke hente værdata på grunn av en intern feil.';
    }
}
