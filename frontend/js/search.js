document.getElementById('search-btn').addEventListener('click', function() {
    // Récupérer la valeur du champ de recherche
    const query = document.getElementById('search-input').value.trim();

    // Si le champ n'est pas vide
    if (query) {
        // Faire une requête pour obtenir les résultats de la recherche
        fetch(`./api/job/search?query=${query}`)
            .then(response => response.json()) // Convertir la réponse en JSON
            .then(data => afficherResultats(data)) // Appeler la fonction pour afficher les résultats
            .catch(error => console.error('Erreur:', error)); 
    } else {
        alert('Veuillez entrer un terme de recherche.');
    }
});

// Fonction pour afficher les résultats
function afficherResultats(resultats) {
    const sectionResultats = document.getElementById('job-offers');
    sectionResultats.innerHTML = ''; // Effacer les anciens résultats

    // Si des résultats sont trouvés
    if (resultats.length > 0) {
        resultats.forEach(job => {
            // Créer un élément pour chaque job
            const elementJob = document.createElement('div');
            elementJob.classList.add('job-offer'); // Use CSS class for styling
            elementJob.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Wage:</strong> $${job.wage}</p>
                <button onclick="openModal(${job.id})">Apply</button>
            `;
            
            sectionResultats.appendChild(elementJob); // Ajouter le job à la section des résultats
        });
    } else {
        // Si aucun résultat trouvé
        sectionResultats.innerHTML = '<p>Aucun résultat trouvé.</p>';
    }
}
 