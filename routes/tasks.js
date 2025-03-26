const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Récupérer toutes les données d'une tâche
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

// Récupérer toutes les tâches avec filtres et tri
router.get("/", async (req, res) => {
  try {
    const { tri, ordre } = req.query;

    let sortOption = {}; // Par défaut, pas de tri
    if (tri) {
      const sortOrder = ordre === "desc" ? -1 : 1;
      sortOption[tri] = sortOrder;
    }

    const tasks = await Task.find().sort(sortOption); // Appliquer le tri
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer une tâche par son ID
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

// Créer une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création de la tâche." });
  }
});

// Modifier une tâche
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

// Supprimer une tâche
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

// Ajouter un commentaire à une tâche
router.post("/:id/comment", async (req, res) => {
  try {
    const { auteur, contenu } = req.body;
    if (!auteur || !contenu) {
      return res.status(400).json({ error: "Auteur et contenu requis" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    // Ajouter le commentaire
    task.commentaires.push({ auteur, contenu });
    await task.save();

    res.json(task.commentaires);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});

// Récupérer les commentaires d'une tâche
router.get("/:id/comments", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json(task.commentaires);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});

module.exports = router;
