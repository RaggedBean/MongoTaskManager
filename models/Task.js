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
  sousTaches: [
    {
      titre: { type: String, required: true },
      statut: {
        type: String,
        enum: ["à faire", "en cours", "terminée"],
        default: "à faire",
      },
      echeance: { type: Date, required: false },
    },
  ],
  commentaires: [
    {
      auteur: { type: String, required: true },
      date: { type: Date, default: Date.now },
      contenu: { type: String, required: true },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
