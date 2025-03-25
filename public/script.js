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

    console.log("Données envoyées :", newTask);

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
    li.textContent = `${task.titre} - ${task.description}`;
    taskList.appendChild(li);
  }

  async function loadTasks() {
    try {
      const response = await fetch("/tasks");
      const tasks = await response.json();
      tasks.forEach(addTaskToList);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  loadTasks();
});
