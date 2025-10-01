export default async function handler(req, res) {
    try {
        // Build the Foodics API URL
        const foodicsUrl = `https://api.foodics.dev/v5${req.url.replace(/^\/api/, '')}`;

        // Call Foodics
        const response = await fetch(foodicsUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FOODICS_TOKEN}`, // adjust to your env var
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();

        // Return both the data and debug info
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
