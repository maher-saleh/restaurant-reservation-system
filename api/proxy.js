// /api/proxy.js
export default async function handler(req, res) {
    const token = process.env.API_TOKEN;
    const baseUrl = "https://api.foodics.dev/v5";
    const fullPath = req.url.split("/api/")[1] || "";
    const targetUrl = `${baseUrl}/${fullPath}`;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:
                req.method !== "GET" && req.method !== "HEAD"
                    ? JSON.stringify(req.body)
                    : undefined,
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Server error",
            details: error.message,
        });
    }
}
