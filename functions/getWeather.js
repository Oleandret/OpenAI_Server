import fetch from 'node-fetch';

export async function getWeather(location) {
    const url = `https://courageous-quietude-production.up.railway.app/api/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('API-respons fra vær-APIet:', data); // Logg hele API-responsen

        if (data.success) {
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

            // Hent detaljer fra "details"-objektet
            const windSpeed = data.details?.wind_speed ?? "Ikke oppgitt";
            const windDirection = data.details?.wind_direction ?? "Ikke oppgitt";
            const humidity = data.details?.humidity ?? "Ikke oppgitt";

            return `Været i ${data.location}: ${readableCondition}, temperatur: ${data.temperature}${data.unit}. Vind: ${windSpeed} m/s fra ${windDirection}. Fuktighet: ${humidity}%.`;
        } else {
            return `Kunne ikke hente værdata for ${location}.`;
        }
    } catch (error) {
        console.error('Feil ved henting av værdata:', error);
        return 'Kunne ikke hente værdata på grunn av en intern feil.';
    }
}
