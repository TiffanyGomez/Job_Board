// Fetch and display job
async function fetchjob() {

    console.log('fetchjob')
    try {
        const response = await fetch('./api/job/');
        const job = await response.json();

        const jobList = document.getElementById('job-offers');
        jobList.innerHTML = ''; // Clear existing job offers

        job.forEach((job) => {
            const jobItem = document.createElement('div');
            jobItem.classList.add('job-offer'); // Use CSS class for styling
            console.log(job.title);

            jobItem.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Wage:</strong> $${job.wage}</p>
                <button onclick="openModal(${job.id})">Apply</button>
            `;
            jobList.appendChild(jobItem);
        });
    } catch (error) {
        console.error('Error fetching job:', error);
    }
}

function openModal(jobId) {
    const employeeId = localStorage.getItem('userId'); // Get the logged-in employee's ID
 
     if (!employeeId) {
        alert('You must be logged in to apply for a job. Please log in first.');
         return; // Prevent the modal from opening
    }
 
    document.getElementById('application-modal').style.display = 'block';
    document.getElementById('application-form').onsubmit = (event) => handleApplicationSubmit(event, jobId);
}
 
// Function to close the application modal
function closeModal() {
    document.getElementById('application-modal').style.display = 'none';
}



async function handleApplicationSubmit(event, jobId) {
    event.preventDefault(); // Prevent form from refreshing the page
 
    const message = document.getElementById('application-message').value;
    const employeeId = localStorage.getItem('userId'); // Get the logged-in employee's ID
 
    try {
        
        const response = await fetch(`./api/employee/${jobId}/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_id: employeeId, message })
        });
 
        const data = await response.json();
 
        if (response.ok) {
            alert('Application submitted successfully!');
            closeModal(); // Close the modal
        } else {
            alert('Application failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error applying for job:', error);
        alert('Error applying for job. Please try again.');
    }
}

// Call fetchjob when the document is ready
document.addEventListener('DOMContentLoaded', fetchjob);
