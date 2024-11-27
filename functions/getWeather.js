import fetch from 'node-fetch';

export async function getWeather(location) {
    const url = `https://courageous-quietude-production.up.railway.app/api/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Map værtilstander til mer lesbare beskrivelser
            const conditionMap = {
                partlycloudy_night: "delvis skyet natt",
                partlycloudy_day: "delvis skyet dag",
                clear_day: "klar himmel",
                clear_night: "klar natt",
                rainy: "regn",
                snowy: "snø",
                cloudy: "overskyet",
                sunny: "solfylt",
            };

            const readableCondition = conditionMap[data.condition] || data.condition;

            // Returner et ryddig format med oversatt værtilstand
            return `Været i ${data.location}: ${readableCondition}, temperatur: ${data.temperature}${data.unit}. Vind: ${data.wind_speed} m/s fra ${data.wind_direction}. Fuktighet: ${data.humidity}%.`;
        } else {
            return `Kunne ikke hente værdata for ${location}.`;
        }
    } catch (error) {
        console.error('Feil ved henting av værdata:', error);
        return 'Kunne ikke hente værdata på grunn av en intern feil.';
    }
}
