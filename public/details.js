document.addEventListener("DOMContentLoaded", async () => {
  const taskDetail = document.getElementById("task-detail");
  const subtaskList = document.getElementById("subtask-list");
  const addSubtaskButton = document.getElementById("add-subtask");
  const commentList = document.getElementById("comment-list");
  const newCommentInput = document.getElementById("new-comment");
  const commentAuthorInput = document.getElementById("comment-author");
  const addCommentButton = document.getElementById("add-comment");
  const editButton = document.getElementById("edit-task");
  const deleteButton = document.getElementById("delete-task");

  // 🔹 Ajouter un bouton retour
  const backButton = document.createElement("button");
  backButton.textContent = "Retour";
  backButton.classList.add("btn-back");
  backButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirige vers la page principale
  });

  // 🔹 Récupération de l'ID de la tâche depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("id");

  if (!taskId) {
    taskDetail.textContent = "ID de tâche invalide.";
    return;
  }

  // 🔹 Charger les détails de la tâche
  async function loadTask() {
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

      // Charger les sous-tâches et commentaires
      loadSubtasks();
      loadComments();
    } catch (error) {
      taskDetail.textContent = "Erreur lors du chargement de la tâche.";
      console.error(error);
    }
  }

  // 🔹 Charger et afficher les sous-tâches
  async function loadSubtasks() {
    try {
      const response = await fetch(`/tasks/${taskId}`);
      if (!response.ok) throw new Error("Impossible de récupérer la tâche.");

      const task = await response.json();
      subtaskList.innerHTML = ""; // Efface l'ancien affichage

      (task.sousTaches || []).forEach((subtask) => {
        const li = document.createElement("li");
        li.textContent = `${subtask.titre} - ${subtask.statut} - ${
          subtask.echeance
            ? new Date(subtask.echeance).toLocaleDateString()
            : "Pas de date"
        }`;

        // 🔹 Bouton de suppression
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Supprimer";
        deleteBtn.classList.add("btn-delete");
        deleteBtn.addEventListener("click", async () => {
          await fetch(`/tasks/${taskId}/subtask/${subtask._id}`, {
            method: "DELETE",
          });
          loadSubtasks();
        });

        li.appendChild(deleteBtn);
        subtaskList.appendChild(li);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des sous-tâches :", error);
    }
  }

  // 🔹 Ajouter une sous-tâche
  addSubtaskButton.addEventListener("click", async () => {
    const titre = document.getElementById("new-subtask").value;
    const statut = document.getElementById("subtask-status").value;
    const echeance = document.getElementById("subtask-echeance").value;

    if (!titre) {
      alert("Le titre est requis.");
      return;
    }

    const newSubtask = { titre, statut, echeance };
    await fetch(`/tasks/${taskId}/subtask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSubtask),
    });

    loadSubtasks();
    document.getElementById("new-subtask").value = "";
  });

  // 🔹 Charger et afficher les commentaires
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

  // 🔹 Ajouter un commentaire
  addCommentButton.addEventListener("click", async () => {
    const auteur = commentAuthorInput.value.trim();
    const contenu = newCommentInput.value.trim();
    if (!auteur || !contenu) {
      alert("L'auteur et le contenu du commentaire sont requis.");
      return;
    }

    try {
      const response = await fetch(`/tasks/${taskId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auteur, contenu }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de l'ajout du commentaire.");

      newCommentInput.value = "";
      commentAuthorInput.value = "";
      loadComments();
    } catch (error) {
      console.error(error);
    }
  });

  // 🔹 Modifier la tâche
  editButton.addEventListener("click", () => {
    window.location.href = `/edit.html?id=${taskId}`;
  });

  // 🔹 Supprimer la tâche
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

  // Charger la tâche et ses données associées
  loadTask();
});
