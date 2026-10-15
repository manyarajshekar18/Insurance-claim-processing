const API_BASE_URL = "http://localhost:8080";

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    return response.json();
}

export async function register(name, email, password) {
    const url =
        `${API_BASE_URL}/api/auth/register` +
        `?name=${encodeURIComponent(name)}` +
        `&email=${encodeURIComponent(email)}` +
        `&password=${encodeURIComponent(password)}`;

    const response = await fetch(url, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    return response.json();
}