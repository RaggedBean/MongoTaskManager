document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");

  if (taskId) {
    const response = await fetch(`/tasks/${taskId}`);
    const task = await response.json();

    document.getElementById("task-id").value = taskId;
    document.getElementById("titre").value = task.titre;
    document.getElementById("description").value = task.description || "";
    document.getElementById("echeance").value = task.echeance
      ? task.echeance.split("T")[0]
      : "";
    document.getElementById("statut").value = task.statut;
    document.getElementById("priorite").value = task.priorite;
    document.getElementById("auteur-nom").value = task.auteur.nom || "";
    document.getElementById("auteur-prenom").value = task.auteur.prenom || "";
    document.getElementById("auteur-email").value = task.auteur.email || "";
    document.getElementById("categorie").value = task.categorie || "";
  }

  document
    .getElementById("edit-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const taskId = document.getElementById("task-id").value;
      const updatedTask = {
        titre: document.getElementById("titre").value,
        description: document.getElementById("description").value,
        echeance: document.getElementById("echeance").value
          ? new Date(document.getElementById("echeance").value).toISOString()
          : null,
        statut: document.getElementById("statut").value,
        priorite: document.getElementById("priorite").value,
        auteur: {
          nom: document.getElementById("auteur-nom").value,
          prenom: document.getElementById("auteur-prenom").value,
          email: document.getElementById("auteur-email").value,
        },
        categorie: document.getElementById("categorie").value,
      };

      await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      window.location.href = "index.html";
    });
});
