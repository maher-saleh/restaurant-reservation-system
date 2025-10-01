// api/proxy.js
export default async function handler(req, res) {
    const token = process.env.API_TOKEN; // Your Foodics API token
    const baseUrl = 'https://api.foodics.dev/v5';

    try {
        // Remove '/proxy' prefix from the incoming request
        const path = req.url.replace(/^\/proxy/, ''); // e.g., '/branches/123?include[0]=sections'
        const url = `${baseUrl}${path}`;

        // Prepare fetch options
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        // Include body for non-GET/HEAD requests
        if (!['GET', 'HEAD'].includes(req.method) && req.body) {
            options.body = JSON.stringify(req.body);
        }

        // Call Foodics API
        const response = await fetch(url, options);

        // Parse JSON safely
        const data = await response.text();
        try {
            res.status(response.status).json(JSON.parse(data));
        } catch {
            res.status(response.status).send(data);
        }
    } catch (err) {
        res.status(500).json({ error: 'Proxy failed', details: err.message });
    }
}
