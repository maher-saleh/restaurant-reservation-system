export default async function handler(req, res) {
	const token = process.env.API_TOKEN;

	const url = `https://api.foodics.dev/v5${req.url.replace(/^\/api/, '')}`;

	try {
		const response = await fetch(url, {
			method: req.method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: ['GET', 'HEAD'].includes(req.method) ? null : req.body,
		});

		const data = await response.json();
		res.status(response.status).json(data);
	} catch (err) {
		res.status(500).json({ error: 'Proxy failed', details: err.message });
	}
}
