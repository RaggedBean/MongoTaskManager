const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(express.static("public"));
app.use(express.json()); // Pour lire les JSON
app.use("/tasks", taskRoutes); // Définir les routes des tâches

mongoose
  .connect("mongodb://localhost:27017/gestion-taches", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
