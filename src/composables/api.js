const tokenResponse = await fetch('/api/token');
const tokenJson = await tokenResponse.json();
const { token, baseURL } = tokenJson;
const sendRequest = async (endpoint, method, data = null) => {
	try {
		const response = await fetch(`${baseURL}${endpoint}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			...(data && method !== 'GET' && method !== 'HEAD'
				? { body: JSON.stringify(data) }
				: {}),
		});
		if (!response.ok) throw new Error(await response.text());
		const json = await response.json();
		return json.data;
	} catch (error) {
		console.error('API Error:', error);
		return Promise.reject(error);
	}
};

export default sendRequest;
