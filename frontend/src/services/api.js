const API_BASE_URL = "http://localhost:8080";

export async function login(email, password) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const text = await response.text();

        if (!response.ok) {
            throw new Error(
                `Login failed (${response.status}): ${text}`
            );
        }

        return JSON.parse(text);

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function register(name, email, password) {
    try {
        const url =
            `${API_BASE_URL}/api/auth/register` +
            `?name=${encodeURIComponent(name)}` +
            `&email=${encodeURIComponent(email)}` +
            `&password=${encodeURIComponent(password)}`;

        const response = await fetch(url, {
            method: "POST"
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(
                `Registration failed (${response.status}): ${text}`
            );
        }

        return JSON.parse(text);

    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}