document.addEventListener("DOMContentLoaded", async () => {
    
    const editAccount = document.getElementById('btn_editAccount');
    const updateAccount = document.getElementById('btn_updateAccount');
    const deleteAccount = document.getElementById('btn_deleteAccount');

    // Function to get the user role and ID
    const getRoleData = async () => {
        try {
            const response = await fetch('/api/auth/isAuthenticated', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.isAuthenticated) {
                return {
                    role: data.user.role, 
                    id: data.user.id     
                };
            } else {
                console.log('User is not authenticated');
                return null;
            }
        } catch (error) {
            console.error('Error fetching role data:', error);
            return null;
        }
    };

    // Function to get the user details based on role and id
    const getUserData = async (role, id) => {
        try {
            const url = `/api/${role}/id/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            const data = await response.json();
    
            // Log the response to inspect it further if necessary
            console.log('User data API response:', data);
    
            // Check for fields before accessing them to avoid undefined errors
            return {
                username: data.username,  // username field
                email: data.email,        //  email field
                last_name: data.last_name, //  last name field
                first_name: data.first_name, //  first name field
                birthDate: data.birthDate, //  birth date field
                adress: data.adress,      //  address field
                cp: data.cp,              //  postal code field
                city: data.city,        //  city field
                password: data.password          //  city field

            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const roleData = await getRoleData();  
      

        const { role, id: userId } = roleData;  // Destructure role and id from roleData

        // Now fetch user details based on role and id
        const userData = await getUserData(role, userId);


        const {  
            username, 
            city, 
            cp, 
            adress, 
            birthDate, 
            last_name, 
            first_name, 
            email, 
            password
        } = userData; 

        // Convert the birthDate to YYYY-MM-DD format if it's not null
        const birthDateFormatted = birthDate ? new Date(birthDate).toISOString().split('T')[0] : '';

        document.querySelector('input[name="birthDate"]').value = birthDateFormatted;


        // Populate form fields with user data
        document.querySelector('input[name="lname"]').value = last_name;
        document.querySelector('input[name="fname"]').value = first_name;
        document.querySelector('input[name="adress"]').value = adress;
        document.querySelector('input[name="cp"]').value = cp;
        document.querySelector('input[name="city"]').value = city;
        document.querySelector('input[name="username"]').value = username;
        document.querySelector('input[name="email"]').value = email;
    

    // Event listener for the editAccount button
    editAccount.addEventListener('click', async () => {

        editAccount.style.display = 'none';
        updateAccount.style.display = 'block'

        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            input.removeAttribute('disabled');  // Enable the input field
            input.setAttribute('required', 'true');  // Add the 'required' attribute
        });        
    });

    // Event listener for the editAccount button
    updateAccount.addEventListener('click', async () => {

        const roleData = await getRoleData();  
       

        const { role, id: userId } = roleData;  // Destructure role and id from roleData
       

        const formData = {
            username: document.querySelector('input[name="username"]').value,
            email: document.querySelector('input[name="email"]').value,
            first_name: document.querySelector('input[name="fname"]').value,
            last_name: document.querySelector('input[name="lname"]').value,
            birthDate: document.querySelector('input[name="birthDate"]').value,
            adress: document.querySelector('input[name="adress"]').value,
            cp: document.querySelector('input[name="cp"]').value,
            city: document.querySelector('input[name="city"]').value,

        };
        

        const password = document.querySelector('input[name="pass"]').value;
        if (password) {
            formData.password = password;  // Only send the password if it has been updated
        }

        // Submit form with the new data
        try {
            const url=`./api/${role}/${userId}/edit`
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            
                body: JSON.stringify(formData)

            });

            if (response.ok) {
                window.location.href = 'profil.html'; 
            } else {
                alert('Erreur lors de la modification.');
            }
        } catch (error) {
            console.error('Edit error:', error);
            alert('Erreur lors de la modification.');
        }
    });


    // Event listener for the editAccount button
    deleteAccount.addEventListener('click', async () => {
        try {
            const url = `/api/${role}/${userId}/delete`; 
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
                window.location.href = 'index.html'; // Redirect after deletion
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur lors de la suppression.');
        }
    });
});