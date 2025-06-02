// Expect a cold start of 5 to 10 secs on this service
const API_BASE_URL = "https://project-tempest-hiring.up.railway.app"

/**
 * TASK: Implement API client for fetching data from the backend API endpoint
 */
export const apiClient = {
    // get method only required for this test
    async get(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            ...options,
        });

        if (!response.ok) {
            throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
        }

        return response.json();
    }
}
