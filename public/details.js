document.addEventListener("DOMContentLoaded", async () => {
  const taskDetail = document.getElementById("task-detail");
  const commentList = document.getElementById("comment-list");
  const newCommentInput = document.getElementById("new-comment");
  const addCommentButton = document.getElementById("add-comment");
  const editButton = document.getElementById("edit-task");
  const deleteButton = document.getElementById("delete-task");

  // 🔹 Ajouter le bouton retour
  const backButton = document.createElement("button");
  backButton.textContent = "Retour";
  backButton.classList.add("btn-back");
  backButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirige vers la page principale
  });

  // 📌 Récupération de l'ID de la tâche depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("id");

  if (!taskId) {
    taskDetail.textContent = "ID de tâche invalide.";
    return;
  }

  // 🔹 Fonction pour charger les détails de la tâche
  async function loadTask() {
    try {
      const response = await fetch(`/tasks/${taskId}`);
      if (!response.ok) throw new Error("Impossible de récupérer la tâche.");

      const task = await response.json();

      // 📌 Affichage des détails de la tâche
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

      // 📌 Ajouter le bouton retour sous les infos
      taskDetail.appendChild(backButton);

      // 📌 Charger les commentaires après avoir affiché la tâche
      loadComments();
    } catch (error) {
      taskDetail.textContent = "Erreur lors du chargement de la tâche.";
      console.error(error);
    }
  }

  // 🔹 Fonction pour charger et afficher les commentaires
  async function loadComments() {
    try {
      const response = await fetch(`/tasks/${taskId}/comments`);
      if (!response.ok)
        throw new Error("Impossible de récupérer les commentaires.");

      const comments = await response.json();
      commentList.innerHTML = ""; // Efface l'ancien affichage

      comments.forEach((comment) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${comment.auteur}</strong> 
        (${new Date(comment.date).toLocaleString()}):<br> 
        ${comment.contenu}`;
        commentList.appendChild(li);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires :", error);
    }
  }

  // 🔹 Fonction pour ajouter un commentaire
  addCommentButton.addEventListener("click", async () => {
    const contenu = newCommentInput.value.trim();
    if (!contenu) return;

    try {
      const response = await fetch(`/tasks/${taskId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auteur: "test@email.com", // À remplacer plus tard par un vrai système d'utilisateur
          contenu,
        }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de l'ajout du commentaire.");

      // Effacer l'input et recharger les commentaires sans recharger la page
      newCommentInput.value = "";
      loadComments();
    } catch (error) {
      console.error(error);
    }
  });

  // 🔹 Bouton Modifier : redirige vers la page d'édition
  editButton.addEventListener("click", () => {
    window.location.href = `/edit.html?id=${taskId}`;
  });

  // 🔹 Bouton Supprimer : supprime la tâche et retourne à la page principale
  deleteButton.addEventListener("click", async () => {
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      try {
        const response = await fetch(`/tasks/${taskId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression.");

        alert("Tâche supprimée.");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  });

  loadTask();
});
