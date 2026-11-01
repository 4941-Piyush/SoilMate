// ===== DEMO DATA ONLY — not from any live API. Used when VITE_USE_MOCK=true =====
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
export async function chatReply(text, language) {
  await wait(1400)
  return { reply: `Demo reply (${language}): backend not connected yet. You asked: “${text}”. Real crop advice will appear here once the API is live.` }
}
export async function advice() {
  await wait(300)
  return {
    crop: 'Wheat (Demo)', problem: 'Yellow rust symptoms (Demo)',
    pestInfo: 'Yellow stripes on leaves may indicate rust. Placeholder text for pest or disease details from the backend.',
    weatherRisk: 'Cool, humid conditions can speed up fungal spread. Placeholder.',
    risk: 'Medium',
    prevention: ['Scout the field every 3 days', 'Avoid overhead irrigation late in the day', 'Remove heavily infected plants'],
    treatment: 'Recommended fungicide and dose will be shown here by the backend.',
    irrigation: 'Irrigation guidance based on soil moisture will appear here.',
    fertilizer: 'Fertilizer type and quantity will appear here.',
    precautions: ['Wear gloves and a mask when spraying', 'Do not spray before rain', 'Keep chemicals away from children'],
  }
}
export async function schedule() {
  await wait(300)
  return {
    crop: 'Wheat (Demo)', planting: 'Date from backend', germination: '7–10 days (demo)', harvest: 'Period from backend',
    events: [
      { when: 'Day 0', title: 'Sowing', type: 'planting', note: 'Prepare field and sow seed.' },
      { when: 'Day 7–10', title: 'Germination', type: 'milestone', note: 'Check seedling emergence.' },
      { when: 'Day 21', title: 'First irrigation', type: 'irrigation', note: 'Crown root initiation stage.' },
      { when: 'Day 25', title: 'First fertilizer dose', type: 'fertilizer', note: 'Dose from backend.' },
      { when: 'Day 60', title: 'Flowering stage', type: 'milestone', note: 'Watch for disease.' },
      { when: 'Day 120+', title: 'Harvest', type: 'harvest', note: 'Harvest when grains harden.' },
    ],
  }
}
