export const makeAuthRequest = async (url: string) => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                console.error("No match from auth token to User object");
                throw new Error("No match from auth token to User object");
            }

            const jsonData = await response.json();
            return jsonData;
        } catch (err) {
            console.error("Error fetching user data:", err);
            localStorage.removeItem("token"); // Remove token if it’s invalid
            return null;
        }
    }
    return null;
};
