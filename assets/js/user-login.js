document.getElementById('user-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get input values
    const email = document.getElementById('user-email').value.trim().toLowerCase();
    const password = document.getElementById('user-password').value.trim();

    // Check if fields are empty
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        const users = await fetchUserData(); // Fetch user data
        if (!users || users.length === 0) {
            alert('No users found! Please try again later.');
            return;
        }

        const user = validateCredentials(users, email, password, 'user');

        if (user) {
            // Store user session data
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('currentUserEmail', email);
            sessionStorage.setItem('currentUserName', user.name); // Store user name if available

            // Show success message and redirect
            alert("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 1000);
        } else {
            alert('Invalid email or password!');
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
