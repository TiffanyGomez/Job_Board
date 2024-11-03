document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById('logout-btn');
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
        logoutBtn.style.display = 'block';  // Show logout button if user is logged in
    } else {
        logoutBtn.style.display = 'none';  // Hide logout button if not logged in
    }

    // Listen to the logout button click event
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('./api/auth/logout', {
                method: 'POST',
                credentials: 'include', 
            });

            if (response.ok) {
                window.location.href = 'index.html'; 
            } else {
                alert('Erreur lors de la déconnexion.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Erreur lors de la déconnexion.');
        }
    });
});
