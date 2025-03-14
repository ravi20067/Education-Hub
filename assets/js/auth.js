// Fetch user data function
async function fetchUserData() {
    try {
        const response = await fetch('data/users.json'); // ✅ Correct path
        if (!response.ok) throw new Error('Unable to load user data!');

        const users = await response.json();
        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('User data is empty or corrupted!');
        }

        return users;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        alert("Failed to load user data!");
        return null;
    }
}

// Validate user credentials
function validateCredentials(users, userId, password, role) {
    if (!Array.isArray(users)) return null; // Ensure users is a valid array

    return users.find(user =>
        user.id?.toLowerCase() === userId.toLowerCase() &&
        user.password === password &&
        user.role === role
    ) || null; // Return null if no match is found
}

// Ensure functions work in non-module environments
window.fetchUserData = fetchUserData;
window.validateCredentials = validateCredentials;
