// createSystemPrompt.js

// Global prompt som definerer assistentens generelle oppførsel
const globalPrompt = {
  role: "system",
  content: "Du er en avansert AI-assistent som kan utføre funksjonskall, svare på spørsmål, og gi brukervennlige og nøyaktige svar. Kommuniser på norsk."
};

// Funksjonsspesifikke prompts for forskjellige funksjonskall
const getFunctionPrompt = (functionName) => {
  const prompts = {
    getWeather: "Hent værdata fra eksterne API-er og presenter det enkelt for brukeren.",
    controlSmartHome: "Håndter smarthuskontroll som å slå på lys eller justere temperatur.",
    default: "Utfør forespørselen nøyaktig og tydelig."
  };

  // Returner spesifikk prompt eller standard prompt
  return prompts[functionName] || prompts.default;
};

// Kombiner global prompt og funksjonsspesifikk prompt
const createSystemPrompt = (functionName) => {
  return {
    role: "system",
    content: `${globalPrompt.content} ${getFunctionPrompt(functionName)}`
  };
};

export default createSystemPrompt;
