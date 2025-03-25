document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titre = document.getElementById("titre").value;
    const description = document.getElementById("description").value;
    const echeance = document.getElementById("echeance").value
      ? new Date(document.getElementById("echeance").value).toISOString()
      : null;
    const statut = document.getElementById("statut").value;
    const priorite = document.getElementById("priorite").value;
    const auteur = {
      nom: document.getElementById("auteur-nom").value,
      prenom: document.getElementById("auteur-prenom").value,
      email: document.getElementById("auteur-email").value,
    };
    const categorie = document.getElementById("categorie").value;

    const newTask = {
      titre,
      description,
      echeance,
      statut,
      priorite,
      auteur,
      categorie,
    };

    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const task = await response.json();
        addTaskToList(task);
        form.reset();
      } else {
        console.error("Erreur lors de l'ajout :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  });

  function addTaskToList(task) {
    const li = document.createElement("li");
    li.textContent = `${task.titre} - ${task.description} (Statut: ${task.statut})`;

    // Conteneur pour les boutons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    // Bouton Modifier
    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier";
    editBtn.classList.add("btn-edit");
    editBtn.addEventListener("click", () => {
      window.location.href = `/edit.html?id=${task._id}`;
    });

    // Bouton Supprimer
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("btn-delete");
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        try {
          const response = await fetch(`/tasks/${task._id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            li.remove();
          } else {
            console.error(
              "Erreur lors de la suppression :",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    });

    // Ajout des boutons dans le conteneur
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // Ajout du conteneur des boutons à la tâche
    li.appendChild(buttonContainer);
    taskList.appendChild(li);
  }

  async function loadTasks() {
    const tri = document.getElementById("tri").value;
    const ordre =
      document.getElementById("toggle-order").dataset.order || "asc";

    let url = "/tasks";
    if (tri) {
      url += `?tri=${tri}&ordre=${ordre}`;
    }

    try {
      const response = await fetch(url);
      const tasks = await response.json();

      taskList.innerHTML = ""; // Nettoyer la liste
      tasks.forEach(addTaskToList);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  document.getElementById("tri").addEventListener("change", loadTasks);

  document
    .getElementById("toggle-order")
    .addEventListener("click", function () {
      this.dataset.order = this.dataset.order === "asc" ? "desc" : "asc";
      this.textContent = this.dataset.order === "asc" ? "⬆" : "⬇";
      loadTasks();
    });

  loadTasks();
});
