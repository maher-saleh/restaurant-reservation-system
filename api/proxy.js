export default async function handler(req, res) {
    const token = process.env.API_TOKEN; // Your Foodics API token
    const baseUrl = 'https://api.foodics.dev/v5';

    try {
        // req.url is e.g., '/api/proxy/branches?include[0]=sections&include[1]=sections.tables'
        // Strip '/api/proxy' to get '/branches?include[0]=sections&include[1]=sections.tables'
        const path = req.url.replace(/^\/api\/proxy/, '');
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

        // Include body for non-GET/HEAD requests (req.body is a Buffer in Vercel)
        if (!['GET', 'HEAD'].includes(req.method) && req.body && req.body.length > 0) {
            options.body = JSON.stringify(JSON.parse(req.body.toString()));
        }

        // Call Foodics API
        const response = await fetch(url, options);

        // Forward headers if needed (e.g., for caching)
        Object.entries(response.headers).forEach(([key, value]) => {
            if (key !== 'content-encoding') {
                res.setHeader(key, value);
            }
        });

        // Parse and respond
        const data = await response.text();
        try {
            res.status(response.status).json(JSON.parse(data));
        } catch {
            res.status(response.status).send(data);
        }
    } catch (err) {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy failed', details: err.message });
    }
}