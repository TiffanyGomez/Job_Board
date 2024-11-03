document.addEventListener("DOMContentLoaded", async () => {
    const profilBtn = document.getElementById('profil-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    let isLoggedIn = false;

    try {
        const authResponse = await fetch('./api/auth/isAuthenticated', {
            method: 'POST',
            credentials: 'include',
        });

        const authData = await authResponse.json();
        
        if (authData.isAuthenticated) {
            isLoggedIn = true;  
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
    }

    if (isLoggedIn) {
        profilBtn.style.display = 'block';  // Show logout button if user is logged in
        signupBtn.style.display = 'none';
        loginBtn.style.display = 'none';

    } else {
        profilBtn.style.display = 'none';  // Hide logout button if not logged in
    }
});