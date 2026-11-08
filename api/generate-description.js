export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { productTitle, language, tone } = req.body;
    if (!productTitle) return res.status(400).json({ error: 'Product title is required' });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Server configuration error: API key missing.' });

    const prompt = `Write a short, catchy, 3-4 lines product description for an online marketplace for this product: ${productTitle}. Language: ${language}. Tone: ${tone}. Make it attractive for buyers, mention quality and use. Only output the description text, do not add any extra words.`;

    // 🔥 FALLBACK SYSTEM: Pehle 3.6 Flash, phir 3.5 Flash-Lite 🔥
    const models = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];
    let lastError = null;

    for (const model of models) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: 1024,
                        temperature: 0.7
                    }
                })
            });

            const data = await response.json();

            // Agar response sahi hai
            if (data.candidates && data.candidates.length > 0) {
                const generatedText = data.candidates[0].content.parts[0].text.trim();
                return res.status(200).json({ description: generatedText, model_used: model });
            }

            // Agar is model se response nahi mila, toh error save karke agla model try karo
            lastError = data.error || { message: 'No candidates returned' };
            console.warn(`Model ${model} failed:`, JSON.stringify(lastError));

        } catch (error) {
            lastError = error;
            console.warn(`Fetch error with ${model}:`, error.message);
        }
    }

    // Agar dono models fail ho jayein
    console.error("All Gemini models failed. Last error:", lastError);
    return res.status(500).json({ error: 'AI service is temporarily unavailable. Please try again or write manually.' });
}