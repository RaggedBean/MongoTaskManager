const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// ➤ Récupérer toutes les tâches (avec filtres et tris)
router.get("/", async (req, res) => {
  try {
    const {
      statut,
      priorite,
      categorie,
      etiquette,
      avant,
      apres,
      q,
      tri,
      ordre,
    } = req.query;
    let filter = {};

    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;
    if (etiquette) filter.etiquettes = etiquette;
    if (avant) filter.echeance = { $lt: new Date(avant) };
    if (apres) filter.echeance = { $gt: new Date(apres) };
    if (q)
      filter.$or = [
        { titre: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];

    let sort = {};
    if (tri) sort[tri] = ordre === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tâches." });
  }
});

// ➤ Récupérer une tâche par ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée." });
    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la tâche." });
  }
});

// ➤ Créer une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création de la tâche." });
  }
});

// ➤ Modifier une tâche
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Tâche non trouvée." });
    res.json(task);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Erreur lors de la mise à jour de la tâche." });
  }
});

// ➤ Supprimer une tâche
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée." });
    res.json({ message: "Tâche supprimée avec succès." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la tâche." });
  }
});

module.exports = router;
