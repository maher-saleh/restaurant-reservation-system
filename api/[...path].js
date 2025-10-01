export default async function handler(req, res) {
    const token = process.env.API_TOKEN;
    const baseUrl = "https://api.foodics.dev/v5";
    const path = req.query.path ? req.query.path.join("/") : "";

    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    const url = `${baseUrl}/${path}${queryString ? `?${queryString}` : ""}`;

    console.log("🔍 Proxying request to:", url);

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const text = await response.text(); // just to debug raw response
        console.log("🔍 Response from Foodics:", text);

        res.status(response.status).send(text);
    } catch (error) {
        res.status(500).json({
            error: "Server error",
            details: error.message,
        });
    }
}
