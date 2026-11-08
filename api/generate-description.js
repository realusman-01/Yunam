export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { productTitle, language, tone } = req.body;
    if (!productTitle) return res.status(400).json({ error: 'Product title is required' });

    // 🔥 Vercel Environment Variable se key uthai ja rahi hai 🔥
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Server configuration error: API key missing.' });

    const prompt = `Write a short, catchy, 3-4 lines product description for an online marketplace for this product: ${productTitle}. Language: ${language}. Tone: ${tone}. Make it attractive for buyers, mention quality and use. Only output the description text, do not add any extra words.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-4-argon:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.7,
                    thinkingConfig: { thinkingLevel: "low" }
                }
            })
        });

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            console.error("Gemini API Error:", JSON.stringify(data));
            return res.status(500).json({ error: 'AI could not generate a response. Check quota or model.' });
        }

        const generatedText = data.candidates[0].content.parts[0].text.trim();
        return res.status(200).json({ description: generatedText });

    } catch (error) {
        console.error("Fetch Error:", error);
        return res.status(500).json({ error: 'Failed to connect to AI service.' });
    }
}