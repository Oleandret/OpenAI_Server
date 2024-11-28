import fetch from 'node-fetch';

// Funksjon for å slå av eller på TV-en via Homey API
export const toggleTV = async (action) => {
    // Hent API-nøkkelen fra miljøvariabelen
    const homeyApiKey = process.env.HOMEY_API_KEY;

    if (!homeyApiKey) {
        console.error("Homey API-nøkkel mangler!");
        throw new Error("Homey API-nøkkel mangler.");
    }

    // URL til Homey API for TV-en
    const url = `https://api.homey.app/manager/devices/device/6d9c2cd1f6a1ad8d0cc6d8d-1690946168744/capability/onoff`;

    // Bygg forespørselens body
    const body = {
        value: action === "on" ? true : false, // Sett true for "on" og false for "off"
    };

    // Sett opp headers med autorisasjon og JSON-innhold
    const headers = {
        Authorization: `Bearer ${homeyApiKey}`,
        'Content-Type': 'application/json',
    };

    try {
        // Send POST-forespørsel til Homey API
        const response = await fetch(url, {
            method: 'PUT', // Homey bruker ofte PUT for å oppdatere tilstand
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Håndter feil fra API-et
            const error = await response.text();
            console.error("Feil ved kall til Homey API:", error);
            throw new Error(error);
        }

        // Returner resultatet fra API-et
        return await response.json();
    } catch (error) {
        console.error("Feil under forespørsel:", error.message);
        throw new Error("Kunne ikke koble til Homey API.");
    }
};
