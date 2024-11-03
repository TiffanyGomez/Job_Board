// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Fetch jobs for the logged-in entreprise when the page loads
    fetchJobs();
});

// Function to fetch jobs from the backend
async function fetchJobs() {
    try {
        const response = await fetch('./api/job/entreprise/jobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.log('Error fetching jobs:', error);
    }
}

// Function to display jobs in the DOM
async function displayJobs(jobs) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = ''; // Clear current job list

    for (const job of jobs) {
        // Fetch applicants for each job
        const applicants = await viewApplicants(job.id);

        const jobItem = `
            <div class="job-item">
                <h3>${job.title}</h3>
                <p>Location: ${job.location}</p>
                <p>Salaire: $${job.wage}</p>
                <p>Description: ${job.description}</p>
                <p>Candidat(s): ${applicants ? applicants.join(', ') : 'No applicants yet'}</p>
                <!-- Add Edit and Delete Buttons here -->
                <button onclick="editJob(${job.id})">Edit</button>
                <button onclick="deleteJob(${job.id})">Delete</button>

            </div>
        `;
        jobList.innerHTML += jobItem;
    }
}

// Function to view applicants for a job
async function viewApplicants(jobId) {
    try {
        const response = await fetch(`./api/job/${jobId}/applicants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const applicants = await response.json();
        console.log('Fetched applicants for jobId:', jobId, applicants); // Log the applicants data

        if (response.ok) {
            return applicants.map(applicant => applicant.name); 
        } else {
            console.error('Error fetching applicants:', applicants.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return [];
    }
}




// Function to handle job form submission (Create job)
document.querySelector('#job-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const jobId = document.querySelector('#job-form').getAttribute('data-job-id');
    const formData = {
        title: document.querySelector('input[name="title"]').value,
        description: document.querySelector('textarea[name="description"]').value,
        wage: document.querySelector('input[name="wage"]').value,
        location: document.querySelector('input[name="location"]').value
    };

    // If no jobId is present, it's a new job creation
    if (!jobId) {
        createJob(formData);
    } else {
        updateJob(jobId, formData);
    }
});


async function updateJob(jobId, formData) {

    try {
        const response = await fetch(`./api/job/${jobId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update job: ${response.status}`);
        }

        const data = await response.json();
        console.log('Job successfully updated:', data);

        fetchJobs(); // Fetch updated job list

        // Reset the form after successful update
        document.querySelector('#job-form').reset();
        document.querySelector('#job-form').removeAttribute('data-job-id'); // Reset to create mode
        document.querySelector('#button_firmPost').innerText = 'Add Job'; // Change button text back to 'Add Job'
    } catch (error) {
        console.error('Error updating job:', error);
    }
}




// Function to create a new job 
function createJob(formData) {
    fetch('./api/job/entreprise/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Job successfully created:', data);
        fetchJobs(); 
        document.querySelector('#job-form').reset(); // Clear the form
    })
    .catch(error => console.error('Error creating job:', error));
}


//Function to delete a job
async function deleteJob(jobId){
    let answer = window.confirm("Are you sure you want to delete this job ?");

    if (answer) {
        try {
            const url = `/api/job/${jobId}/delete`; 
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
                window.location.href = 'firm.html';
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur lors de la suppression.');
        }    
    }
    
   
}

async function editJob(jobId) {
    console.log('Edit button clicked for Job ID:', jobId); // For the tests

  
    try {
        const response = await fetch(`./api/job/id/${jobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch job details: ${response.status}`);
        }

        const job = await response.json();
        console.log('Fetched job details:', job); // For the tests

        // Update the form with the fetched job data
        document.querySelector('input[name="title"]').value = job.title;
        document.querySelector('textarea[name="description"]').value = job.description;
        document.querySelector('input[name="wage"]').value = job.wage;
        document.querySelector('input[name="location"]').value = job.location;

        // Set the form to update mode with the job ID
        document.querySelector('#job-form').setAttribute('data-job-id', jobId);
        document.querySelector('#button_firmPost').innerText = 'Update Job'; // Change button text to 'Update Job'

        document.querySelector('#job-form').scrollIntoView({
            behavior: 'smooth' 
        });
    } catch (error) {
        console.error('Error fetching job details:', error);
    }
}

