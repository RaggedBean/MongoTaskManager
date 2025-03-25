const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: false },
  dateCreation: { type: Date, default: Date.now },
  echeance: { type: Date, required: false },
  statut: {
    type: String,
    enum: ["à faire", "en cours", "terminée", "annulée"],
    default: "à faire",
  },
  priorite: {
    type: String,
    enum: ["basse", "moyenne", "haute", "critique"],
    default: "moyenne",
  },
  auteur: {
    nom: { type: String, required: false },
    prenom: { type: String, required: false },
    email: { type: String, required: false, match: /\S+@\S+\.\S+/ },
  },
  categorie: { type: String, required: false },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
