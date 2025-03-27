# Gestionnaire de Tâches

Ce projet est une application web permettant de gérer des tâches avec des fonctionnalités telles que la création, l'affichage, la modification et la suppression des tâches. L'application utilise **Node.js**, **Express**, **MongoDB** et une interface en **HTML, CSS et JavaScript**.

## 🚀 Installation et Configuration

### 1️⃣ Prérequis
- **Node.js** (>= 14.x)
- **MongoDB** (local ou via MongoDB Atlas)

### 2️⃣ Installation
Clonez ce dépôt et installez les dépendances :
```bash
git clone https://github.com/RaggedBean/MongoTaskManager.git
cd MongoTaskManager
npm install
```

### 3️⃣ Configuration
Créez un fichier `.env` et ajoutez :
```
MONGO_URI=mongodb://localhost:27017/taches_db
PORT=3000
```
💡 Remplacez `MONGO_URI` par votre URI MongoDB si vous utilisez un service distant.

### 4️⃣ Lancer le Serveur
```bash
npm start
```
Le serveur démarre sur **http://localhost:3000**.

## 📌 API REST
L'application expose une API REST pour gérer les tâches.

### 📍 Routes disponibles
#### 1️⃣ **Récupérer toutes les tâches**
```http
GET /tasks
```
✅ **Réponse :**
```json
[
  {
    "_id": "65f4d0e12345",
    "titre": "Acheter du lait",
    "description": "Pense à prendre du lait entier",
    "statut": "à faire",
    "priorite": "moyenne",
    "auteur": { "nom": "Dupont", "prenom": "Jean", "email": "jean.dupont@example.com" },
    "categorie": "Courses",
    "echeance": "2025-04-01",
    "etiquettes": ["courses", "important"],
    "sousTaches": []
  }
]
```

#### 2️⃣ **Récupérer une tâche par ID**
```http
GET /tasks/:id
```
✅ **Réponse :**
```json
{
  "_id": "65f4d0e12345",
  "titre": "Acheter du lait",
  ...
}
```

#### 3️⃣ **Créer une tâche**
```http
POST /tasks
```
📥 **Corps JSON :**
```json
{
  "titre": "Nouveau titre",
  "description": "Détails de la tâche",
  "statut": "à faire",
  "priorite": "basse",
  "auteur": { "nom": "Martin", "prenom": "Paul", "email": "paul@example.com" },
  "categorie": "Travail",
  "etiquettes": ["urgent"],
  "sousTaches": []
}
```
✅ **Réponse :** `201 Created`

#### 4️⃣ **Modifier une tâche**
```http
PUT /tasks/:id
```
📥 **Corps JSON :** (champs modifiés)
```json
{
  "statut": "en cours",
  "priorite": "haute"
}
```
✅ **Réponse :** `200 OK`

#### 5️⃣ **Supprimer une tâche**
```http
DELETE /tasks/:id
```
✅ **Réponse :** `204 No Content`

## 🖥️ Mode d’Emploi
### Accès à l’interface web
- Ouvrez **index.html** dans un navigateur
- Permet de **créer, modifier et supprimer** des tâches
- **Filtrage** par statut, catégorie et étiquettes disponible
- Ajout/modification des **sous-tâches et commentaires**

### Fonctionnalités
✅ **Créer une tâche** via le formulaire principal  
✅ **Modifier une tâche** en cliquant dessus dans la liste  
✅ **Supprimer une tâche** avec le bouton 🗑️  
✅ **Ajout dynamique d’étiquettes** dans l’éditeur de tâches  
✅ **Interface responsive et accessible**

