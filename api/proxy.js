export default async function handler(req, res) {
    try {
        const foodicsUrl = `https://api.foodics.dev/v5${req.url.replace(/^\/api/, '')}`;

        const response = await fetch(foodicsUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`, // must exist!
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }

        res.status(response.status).json({
            ok: response.ok,
            url: foodicsUrl,
            method: req.method,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
