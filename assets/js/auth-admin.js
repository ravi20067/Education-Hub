export async function fetchUserData() {
    try {
        const response = await fetch('data/users.json'); // Ensure correct path
        if (!response.ok) throw new Error('Failed to load user data!');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export function validateCredentials(users, enteredID, enteredPassword, role) {
    return users.find(user => user.id === enteredID && user.password === enteredPassword && user.role === role);
}
