document.addEventListener("DOMContentLoaded", async () => {
  const taskDetail = document.getElementById("task-detail");
  const editButton = document.getElementById("edit-task");
  const deleteButton = document.getElementById("delete-task");

  // Ajout du bouton retour
  const backButton = document.createElement("button");
  backButton.textContent = "Retour";
  backButton.classList.add("btn-back");
  backButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirige vers la page principale
  });

  // Récupération de l'ID de la tâche depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("id");

  if (!taskId) {
    taskDetail.textContent = "ID de tâche invalide.";
    return;
  }

  try {
    const response = await fetch(`/tasks/${taskId}`);
    if (!response.ok) throw new Error("Impossible de récupérer la tâche.");

    const task = await response.json();

    // Affichage des détails de la tâche
    taskDetail.innerHTML = `
      <h2>${task.titre}</h2>
      <p><strong>Description :</strong> ${
        task.description || "Aucune description"
      }</p>
      <p><strong>Échéance :</strong> ${
        task.echeance
          ? new Date(task.echeance).toLocaleDateString()
          : "Non définie"
      }</p>
      <p><strong>Statut :</strong> ${task.statut}</p>
      <p><strong>Priorité :</strong> ${task.priorite}</p>
      <p><strong>Catégorie :</strong> ${task.categorie || "Non spécifiée"}</p>
      <p><strong>Auteur :</strong> ${task.auteur?.nom || "?"} ${
      task.auteur?.prenom || ""
    } (${task.auteur?.email || "?"})</p>
    `;

    // Ajouter le bouton retour sous les infos
    taskDetail.appendChild(backButton);

    // Bouton Modifier
    editButton.addEventListener("click", () => {
      window.location.href = `/edit.html?id=${task._id}`;
    });

    // Bouton Supprimer
    deleteButton.addEventListener("click", async () => {
      if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        try {
          const response = await fetch(`/tasks/${taskId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            alert("Tâche supprimée.");
            window.location.href = "index.html";
          } else {
            alert("Erreur lors de la suppression.");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    });
  } catch (error) {
    taskDetail.textContent = "Erreur lors du chargement de la tâche.";
    console.error(error);
  }
});
