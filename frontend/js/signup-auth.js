// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Handle signup form submission
    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault(); 
 
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const last_name = document.getElementById('last_name').value;
        const first_name = document.getElementById('first_name').value;
        const birthDate = document.getElementById('birthDate').value;
        const adress = document.getElementById('adress').value;
        const cp = document.getElementById('cp').value;
        const city = document.getElementById('city').value;
        const role = document.getElementById('role').value;
        

        try {
            const response = await fetch('./api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, role, last_name, first_name, birthDate, adress, cp, city })
            });
 
            const data = await response.json();
 
            if (response.ok) {
                alert('Signup successful!');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                // Ensure we display the correct error message
                alert('Signup failed: ' + (data.message || 'An error occurred'));
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Error during signup. Please try again.');
        }
    });
});