export default function handler(req, res) {
	const token = process.env.API_TOKEN;
	const baseURL = process.env.BASE_URL;
	res.status(200).json({ message: 'Success', token, baseURL });
}
