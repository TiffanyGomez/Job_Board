// --------------------------- entreprises ---------------------------

async function loadentreprises() {
    try {
        const response = await fetch('./api/entreprise/');
        const entreprises = await response.json();

        const tableBody = document.querySelector('#entreprisesTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        entreprises.forEach(entreprise => {
            const row = `
                <tr>
                    <td>${entreprise.id}</td>
                    <td>${entreprise.username}</td>
                    <td>${entreprise.email}</td>
                    <td>${entreprise.last_name}</td>
                    <td>${entreprise.first_name}</td>
                    <td>${entreprise.birthDate}</td>
                    <td>${entreprise.adress}</td>
                    <td>${entreprise.cp}</td>
                    <td>${entreprise.city}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openAddEditEntrepriseModal(${entreprise.id}, '${entreprise.username}', '${entreprise.email}', '${entreprise.last_name}', '${entreprise.first_name}', '${entreprise.birthDate}', '${entreprise.adress}', '${entreprise.cp}', '${entreprise.city}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteentreprise(${entreprise.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading entreprises:', error);
        alert('Failed to load entreprises.');
    }
}


// Open Add/Edit modal for entreprise
function openAddEditEntrepriseModal(id = null, username = '', email = '', first_name='', last_name = '', birthDate = '', adress = '', cp = '', city = '') {
    document.getElementById('entrepriseId').value = id || ''; // Set hidden ID field
    document.getElementById('entrepriseUsername').value = username;
    document.getElementById('entrepriseEmail').value = email;
    document.getElementById('entreprisePassword').value = ''; //  clear password for security
    document.getElementById('entrepriseFname').value = first_name;
    document.getElementById('entrepriseLname').value = last_name;
    document.getElementById('entrepriseAdress').value = adress;
    document.getElementById('entrepriseCp').value = cp;
    document.getElementById('entrepriseCity').value  = city;

    // Convert the birthDate to YYYY-MM-DD format if it's not null
    const birthDateFormated = birthDate ? new Date(birthDate).toISOString().split('T')[0] : '';
    document.getElementById('entrepriseBirthDate').value = birthDateFormated;

    const modalLabel = id ? 'Edit Entreprise' : 'Add Entreprise';
    document.getElementById('entrepriseModalLabel').innerText = modalLabel;

    const entrepriseModal = new bootstrap.Modal(document.getElementById('entrepriseModal'));
    entrepriseModal.show();
}

// Function to create or update an entreprise
document.getElementById('entrepriseForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('entrepriseId').value;
    const username = document.getElementById('entrepriseUsername').value;
    const email = document.getElementById('entrepriseEmail').value;
    const password = document.getElementById('entreprisePassword').value;
    const first_name = document.getElementById('entrepriseFname').value;
    const last_name = document.getElementById('entrepriseLname').value;
    const birthDate = document.getElementById('entrepriseBirthDate').value;
    const adress = document.getElementById('entrepriseAdress').value;
    const cp = document.getElementById('entrepriseCp').value;
    const city = document.getElementById('entrepriseCity').value;




    const url = id ? `./api/entreprise/${id}/edit` : './api/entreprise/create';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, last_name, first_name, birthDate, adress, cp, city })
        });

        if (response.ok) {
            alert('Entreprise saved successfully!');
            loadentreprises(); 
        } else {
            alert('Failed to save entreprise');
        }
    } catch (error) {
        console.error('Error saving entreprise:', error);
    }

    const entrepriseModal = bootstrap.Modal.getInstance(document.getElementById('entrepriseModal'));
    entrepriseModal.hide();
});

// Function to delete an entreprise
async function deleteentreprise(id) {
    if (confirm('Are you sure you want to delete this entreprise?')) {
        try {
            const response = await fetch(`/api/entreprise/${id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('entreprise deleted successfully!');
                loadentreprises();
            } else {
                alert('Failed to delete entreprise');
            }
        } catch (error) {
            console.error('Error deleting entreprise:', error);
        }
    }
}

// --------------------------- Employees ---------------------------

async function loadEmployees() {
    try {
        const response = await fetch('./api/employee/');
        const employees = await response.json();

        const tableBody = document.querySelector('#employeesTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        employees.forEach(employee => {
            const row = `
                <tr>
                    <td>${employee.id}</td>
                    <td>${employee.username}</td>
                    <td>${employee.email}</td>
                                        <td>${employee.password}</td>

                    <td>${employee.last_name}</td>
                    <td>${employee.first_name}</td>
                    <td>${employee.birthDate}</td>
                    <td>${employee.adress}</td>
                    <td>${employee.cp}</td>
                    <td>${employee.city}</td>

                    <td>
                        <button class="btn btn-warning" onclick="openAddEditEmployeeModal(${employee.id}, '${employee.username}', '${employee.email}', '${employee.password}', '${employee.last_name}', '${employee.first_name}', '${employee.birthDate}', '${employee.adress}', '${employee.cp}', '${employee.city}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

// Open Add/Edit modal for employee
function openAddEditEmployeeModal(id = null, username = '', email = '', last_name ='', first_name = '', birthDate = '', adress = '', cp = '', city = '') {
    document.getElementById('employeeId').value = id || ''; // Set hidden ID field
    document.getElementById('employeeUsername').value = username;
    document.getElementById('employeeEmail').value = email;
    document.getElementById('employeePassword').value = ''; //  clear password for security
    document.getElementById('employeeLname').value = last_name;
    document.getElementById('employeeFname').value = first_name;
    document.getElementById('employeeBirthDate').value = birthDate;
    document.getElementById('employeeAdress').value = adress;
    document.getElementById('employeeCp').value = cp;
    document.getElementById('employeeCity').value = city;


    const modalLabel = id ? 'Edit Employee' : 'Add Employee';
    document.getElementById('employeeModalLabel').innerText = modalLabel;

    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    employeeModal.show();
}

// Function to create or update an employee
document.getElementById('employeeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('employeeId').value;
    const username = document.getElementById('employeeUsername').value;
    const email = document.getElementById('employeeEmail').value;
    const password = document.getElementById('employeePassword').value;
    const last_name = document.getElementById('employeeLname').value;
    const first_name = document.getElementById('employeeFname').value;
    const birthDate = document.getElementById('employeeBirthDate').value;
    const adress = document.getElementById('employeeAdress').value;
    const cp = document.getElementById('employeeCp').value;
    const city = document.getElementById('employeeCity').value;


    const url = id ? `./api/employee/${id}/edit` : './api/employee/create';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, last_name, first_name, birthDate, adress, cp, city })
        });

        if (response.ok) {
            alert('Employee saved successfully!');
            loadEmployees(); // Reload the data
        } else {
            alert('Failed to save employee');
        }
    } catch (error) {
        console.error('Error saving employee:', error);
    }

    const employeeModal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
    employeeModal.hide();
});

//Function to delete an employee
async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`./api/employee/${id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Employee deleted successfully!');
                loadEmployees();
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
}

async function loadJobs() {
    try {
        const response = await fetch('./api/job');
        const jobs = await response.json();

        const tableBody = document.querySelector('#jobsTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        jobs.forEach(job => {
            const row = `
                <tr>
                    <td>${job.id}</td>
                    <td>${job.title}</td>
                    <td>${job.description}</td>
                    <td>${job.wage}</td>
                    <td>${job.location}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openAddEditJobModal(${job.id}, '${job.title}', '${job.description}', '${job.wage}', ${job.location})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteJob(${job.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}


// Open Add/Edit modal for job
function openAddEditJobModal(id = null, title = '', description = '', wage = '', jobLocation = '') {
    document.getElementById('jobId').value = id || ''; // Set hidden ID field
    document.getElementById('jobTitle').value = title;
    document.getElementById('jobDescription').value = description;
    document.getElementById('jobWage').value = wage;
    document.getElementById('jobLocation').value = jobLocation; // Use the correct jobLocation parameter

    const modalLabel = id ? 'Edit Job' : 'Add Job';
    document.getElementById('jobModalLabel').innerText = modalLabel;

    const jobModal = new bootstrap.Modal(document.getElementById('jobModal'));
    jobModal.show();
}


// Function to create or update a job
document.getElementById('jobForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('jobId').value;
    const title = document.getElementById('jobTitle').value;
    const description = document.getElementById('jobDescription').value;
    const wage = parseFloat(document.getElementById('jobWage').value);
    const location = document.getElementById('jobLocation').value;


    const url = id ? `./api/job/${id}/edit` : './api/job/entreprise/create';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, wage, location })
        });

        if (response.ok) {
            alert('Job saved successfully!');
            loadJobs(); // Reload the data
        } else {
            alert('Failed to save job');
        }
    } catch (error) {
        console.error('Error saving job:', error);
    }

    const jobModal = bootstrap.Modal.getInstance(document.getElementById('jobModal'));
    jobModal.hide();
});


//Function to delete a job 
async function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            const response = await fetch(`./api/job/${id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Job deleted successfully!');
                loadJobs();
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }
}

// --------------------------- Applications ---------------------------

// Function to load applications
async function loadApplications() {
    try {
        const response = await fetch('./api/application');
        const applications = await response.json();

        const tableBody = document.querySelector('#applicationsTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        applications.forEach(application => {
            const row = `
                <tr>
                    <td>${application.id}</td>
                    <td>${application.job_id}</td>
                    <td>${application.employee_id}</td>
                    <td>${application.message}</td>
                    <td>${application.applied_at}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editApplication(${application.id}, '${application.message}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteApplication(${application.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Function to edit an application
async function editApplication(id, currentMessage) {
    const message = prompt("Enter new application message:", currentMessage);

    if (message) {
        try {
            const response = await fetch(`./api/application/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                alert('Application updated successfully!');
                loadApplications();
            } else {
                alert('Failed to update application');
            }
        } catch (error) {
            console.error('Error updating application:', error);
        }
    }
}

// Function to delete an application
async function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        try {
            const response = await fetch(`./api/application/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Application deleted successfully!');
                loadApplications();
            } else {
                alert('Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    }
}


// --------------------------- Admin Accounts ---------------------------

async function loadAdminAccounts() {
    try {
        const response = await fetch('./api/admin');
        const accounts = await response.json();

        const tableBody = document.querySelector('#accountsTable tbody');
        tableBody.innerHTML = ''; // Clear previous data

        accounts.forEach(account => {
            const row = `
                
                <tr id="admin-${account.id}">

                    <td>${account.id}</td>
                    <td>${account.username}</td>
                    <td>${account.email}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openAddEditAccountModal(${account.id}, '${account.username}', '${account.email}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteAccount(${account.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading admin accounts:', error);
    }
}

// Open Add/Edit modal for admin account
function openAddEditAccountModal(id = null, username = '', email = '') {
    document.getElementById('accountId').value = id || ''; // Set hidden ID field
    document.getElementById('accountUsername').value = username;
    document.getElementById('accountEmail').value = email;
    document.getElementById('accountPassword').value = ''; // Always clear password for security

    const modalLabel = id ? 'Edit Admin Account' : 'Add Admin Account';
    document.getElementById('accountModalLabel').innerText = modalLabel;

    const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
    accountModal.show();
}

// Function to create or update an admin account
document.getElementById('accountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('accountId').value;
    const username = document.getElementById('accountUsername').value;
    const email = document.getElementById('accountEmail').value;
    const password = document.getElementById('accountPassword').value;

    const url = id ? `./api/admin/${id}/edit` : './api/admin/create';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Admin account saved successfully!');
            loadAdminAccounts(); // Reload the data
        } else {
            alert('Failed to save admin account');
        }
    } catch (error) {
        console.error('Error saving admin account:', error);
    }

    const accountModal = bootstrap.Modal.getInstance(document.getElementById('accountModal'));
    accountModal.hide();
});
 //delete a admin account
async function deleteAccount(id) {
    if (confirm('Are you sure you want to delete this admin account?')) {
        try {
            const response = await fetch(`./api/admin/${id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Admin account deleted successfully!');
                loadAdminAccounts();
            } else {
                alert('Failed to delete admin account');
            }
        } catch (error) {
            console.error('Error deleting admin account:', error);
        }
    }
}

// Load all data when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadentreprises();
    loadApplications();
    loadEmployees();
    loadJobs();
    loadAdminAccounts();
    loadJobListings();
});

// Function to load job listings and display in the table
async function loadJobListings() {
    try {
        const response = await fetch('./api/job/');
        const jobs = await response.json();

        const tableBody = document.getElementById('jobsTableBody');
        tableBody.innerHTML = '';  // Clear any existing rows

        jobs.forEach(job => {
            const row = `
                <tr>
                    <td>${job.id}</td>
                    <td>${job.title}</td>
                    <td>${job.description}</td>
                    <td>${job.wage}</td>
                    <td>${job.location}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openAddEditJobModal(${job.id}, '${job.title}', '${job.description}', '${job.wage}', '${job.location}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteJob(${job.id})">Delete</button>
                    </td>

                </tr>
            `;
            tableBody.innerHTML += row;  // Insert the job row into the table
        });
    } catch (error) {
        console.error('Error loading job listings:', error);
    }
}

// Call the loadJobListings function when the page loads
document.addEventListener('DOMContentLoaded', loadJobListings);
