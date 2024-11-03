async function applyForJob(jobId) {
    const message = 'I am interested in this job!'; // Example application message
 
    try {
        const response = await fetch(`./api/employee/${jobId}/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // This line ensures cookies are sent
            body: JSON.stringify({ message })
        });
 
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            const error = await response.json();
            alert('Error applying for job: ' + error.message);
        }
    } catch (error) {
        console.error('Error applying for job:', error);
    }
}