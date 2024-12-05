
/**
 * a convenient function to remove repeat code
 * allows the client to make GET requests to the backend that require client authentication (with their localStorage jwt token)
 * @param url (desired backend API endpoint url)
 * @returns null if user has no token or request failed; if the request succeeded, then returns the jsonData of the GET request
 */
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
