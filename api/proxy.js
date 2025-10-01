export default async function handler(req, res) {
    const token = process.env.API_TOKEN;
    const baseUrl = 'https://api.foodics.dev/v5';

    try {
        const path = req.url.replace(/^\/api\/proxy/, '');
        const url = `${baseUrl}${path}`;

        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        if (!['GET', 'HEAD'].includes(req.method) && req.body && req.body.length > 0) {
            options.body = JSON.stringify(JSON.parse(req.body.toString()));
        }

        const response = await fetch(url, options);

        Object.entries(response.headers).forEach(([key, value]) => {
            if (key !== 'content-encoding') {
                res.setHeader(key, value);
            }
        });

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