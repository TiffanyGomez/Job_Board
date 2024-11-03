//Function to users login
login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('./api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2)); // Log the entire response

        if (response.ok) {
            // Store user info in local storage or session storage
            const userId = data.userId; 
            const userRole = data.role; 

            if (!userId || !userRole) {
                alert('User ID or role is missing in the response.');
                return;
            }

            localStorage.setItem('userId', userId);
            localStorage.setItem('role', userRole);
            
            alert('Login successful!');

            // Redirect based on user role
            if (userRole === 'entreprise') {
                alert('Redirecting to firm page...');
                window.location.href = 'firm.html'; // Redirect to firm page
            } else if (userRole === 'employee') {
                alert('Redirecting to employee dashboard...');
                window.location.href = 'index.html'; // Redirect to employee dashboard
            } else if (userRole === 'admin') {
                alert('Redirecting to admin dashboard...');
                window.location.href = 'admin.html'; // Redirect to admin dashboard
            }
            else {
                alert('Role not recognized. Redirecting to default page.');
                window.location.href = 'index.html'; // Fallback page
            }
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again.');
    }
};
