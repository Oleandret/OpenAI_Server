import axios from 'axios';

const toggleTvPower = async (action) => {
  try {
    const homeyApiUrl = 'https://cloud.homey.app/api/manager/devices/device/60d9c2cd16a1ad8d0cc6d8d-1690946168744/capability/onoff';
    const apiToken = 'Bearer a24e0754-a95f-43b1-be67-011fec659b99:a024ccbc-4e0f-4918-a5e7-1790411c5e15:8b4c68839f4ec900821e23f3f16f9e767533fa84';

    const response = await axios({
      method: 'PUT', // For å oppdatere en egenskap
      url: homeyApiUrl,
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      data: {
        value: action === 'on', // true for på, false for av
      },
    });

    console.log(`TV ${action === 'on' ? 'slått på' : 'slått av'}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Feil under kommunikasjon med Homey API:', error.response?.data || error.message);
    throw new Error('Kunne ikke kontrollere TV-en.');
  }
};

export default toggleTvPower;
