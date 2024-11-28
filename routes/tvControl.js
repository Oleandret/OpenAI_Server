import express from 'express';
import toggleTvPower from '../functions/toggleTvPower.js';

const router = express.Router();

router.post('/toggle-tv', async (req, res) => {
  const { action } = req.body; // Forventet: { "action": "on" } eller { "action": "off" }
  
  if (!['on', 'off'].includes(action)) {
    return res.status(400).json({ error: 'Ugyldig handling. Bruk "on" eller "off".' });
  }

  try {
    const result = await toggleTvPower(action);
    res.json({ message: `TV ${action === 'on' ? 'slått på' : 'slått av'}`, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
