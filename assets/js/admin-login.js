import { fetchUserData, validateCredentials } from './auth-admin.js';

document.getElementById('admin-login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const adminID = document.getElementById('admin-id').value.trim();
    const adminPassword = document.getElementById('admin-password').value.trim();

    if (adminID === '' || adminPassword === '') {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const users = await fetchUserData();
        if (users) {
            const adminUser = validateCredentials(users, adminID, adminPassword, 'admin');
            if (adminUser) {
                sessionStorage.setItem('adminLoggedIn', true);
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid ID or password!');
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Something went wrong. Please try again later.');
    }
});
