import fetch from 'node-fetch';

export async function getWeather(location) {
    const url = `https://courageous-quietude-production.up.railway.app/api/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Returner et ryddig format
            return `Været i ${data.location}: ${data.condition}, temperatur: ${data.temperature}°${data.unit}. Vind: ${data.details.wind_speed} m/s fra ${data.details.wind_direction}. Fuktighet: ${data.details.humidity}%.`;
        } else {
            return `Kunne ikke hente værdata for ${location}.`;
        }
    } catch (error) {
        console.error('Feil ved henting av værdata:', error);
        return 'Kunne ikke hente værdata på grunn av en intern feil.';
    }
}
