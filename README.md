# Documentation complete - Netflim FILE API

## Table des matieres

1. [Vue d'ensemble](#vue-densemble)
2. [Installation et configuration](#installation-et-configuration)
3. [Architecture](#architecture)
4. [Authentification](#authentification)
5. [Endpoints resume](#endpoints-resume)
6. [Modeles de donnees](#modeles-de-donnees)
7. [Exemples d'utilisation](#exemples-dutilisation)
8. [Codes HTTP](#codes-http)
9. [Cas d'erreur courants](#cas-derreur-courants)
10. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

### A propos du service

**Netflim FILE** est un microservice dedie a la gestion des fichiers (images et videos) de la plateforme Netflim. Il offre le televersement, le streaming video et la suppression des fichiers, avec creation et suppression des metadonnees cote DATA API.

**Informations cles:**
- **Version**: 1.0.0
- **Type**: REST API (Express.js + Node.js)
- **Stockage**: disque local (repertoire `uploads`)
- **Authentification**: JWT (optionnel en dev via `JWT_ENABLED`)
- **Communication inter-service**: appels HTTP vers DATA API avec `x-service-token`
- **Documentation**: Swagger/OpenAPI 3.0

### Fonctionnalites principales

- Televersement d'images et videos
- Streaming video avec Range requests
- Recuperation d'image via l'endpoint de stream
- Suppression fichier disque + suppression en base via DATA API
- Validation des requetes
- Documentation Swagger

---

## Installation et configuration

### Prerequis

- Node.js >= 16
- npm
- Git
- Service Netflim DATA accessible

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/clementbas/Netflim_FILE.git
cd Netflim_FILE

# 2. Installer les dependances
npm install

# 3. Configurer l'environnement
copy nul .env
```

### Configuration `.env`

```bash
# Serveur
PORT=4003
NODE_ENV=development

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=500000000

# Securite
JWT_SECRET=<VOTRE_SECRET_JWT>
JWT_ENABLED=true

# Inter-services
DATA_SERVICE_URL=http://localhost:4000/api
SERVICE_TOKEN=<VOTRE_SERVICE_TOKEN>
```

### Demarrage

```bash
# Mode developpement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'API sera disponible a: `http://localhost:4003`

### Acceder a la documentation Swagger

- **Interface interactive**: `http://localhost:4003/docs`
- **Spec JSON**: `http://localhost:4003/api-docs`

---

## Architecture

### Structure du projet

```
src/
├── app.js                          # Configuration Express et bootstrap
├── config/
│   ├── dataService.client.js       # Client HTTP vers DATA API
│   ├── env.js                      # Variables d'environnement
│   └── multer.config.js            # Configuration upload disque
├── controllers/
│   └── file.controller.js          # Orchestration des endpoints
├── docs/
│   └── swagger.yaml                # Documentation Swagger
├── middlewares/
│   ├── auth.middleware.js          # JWT auth (optionnel)
│   ├── error.middleware.js         # Gestion d'erreurs
│   └── validation.middleware.js    # Validation Joi
├── routes/
│   └── file.routes.js              # Definition routes
├── services/
│   ├── file-db.service.js          # Appels DATA API
│   ├── file.service.js             # Manipulation fichiers
│   └── streaming.service.js        # Streaming video
├── utils/
│   └── apiError.js                 # Erreurs standardisees
└── validations/
		└── file.validation.js          # Schemas Joi
```

### Architecture en couches

```
Routes (file.routes.js)
		↓
Controllers (file.controller.js)
		↓
Services (file.service.js, streaming.service.js)
		↓
Disque (uploads)
		↓
Services DATA (file-db.service.js)
```

---

## Authentification

### JWT Bearer Token (utilisateurs)

Toutes les routes sont protegees par JWT si `JWT_ENABLED=true`.

**En-tete requis**:
```
Authorization: Bearer <JWT>
```

### Communication inter-service (DATA API)

Le service appelle le microservice DATA pour creer, lire ou supprimer les metadonnees. Ces appels incluent automatiquement:

```
x-service-token: <SERVICE_TOKEN>
```

---

## Endpoints resume

| Methode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/files/upload` | Televerser un fichier (image ou video) |
| GET | `/files/{id}/stream` | Stream video ou renvoyer image |
| DELETE | `/files/{id}` | Supprimer un fichier et ses metadonnees |

---

## Modeles de donnees

### UploadResponse

```json
{
	"success": true,
	"file": {
		"id": "9f9b2c0a-4b59-4cc8-8f6e-6f2f7e8b2a10",
		"path": "uploads/Action/Avatar/1700000000000-sample.mp4"
	}
}
```

### DeleteResponse

```json
{
	"success": true
}
```

### ErrorResponse

```json
{
	"success": false,
	"error": {
		"message": "Token invalide ou expire",
		"status": 401
	}
}
```

---

## Exemples d'utilisation

### 1. Televerser un fichier

```bash
curl -X POST http://localhost:4003/files/upload \
	-H "Authorization: Bearer YOUR_JWT" \
	-F "categoryName=Action" \
	-F "folder=Avatar" \
	-F "file=@./sample.mp4"
```

**Reponse (201)**:
```json
{
	"success": true,
	"file": {
		"id": "9f9b2c0a-4b59-4cc8-8f6e-6f2f7e8b2a10",
		"path": "uploads/Action/Avatar/1700000000000-sample.mp4"
	}
}
```

### 2. Stream video

```bash
curl -X GET http://localhost:4003/files/9f9b2c0a-4b59-4cc8-8f6e-6f2f7e8b2a10/stream \
	-H "Authorization: Bearer YOUR_JWT" \
	-H "Range: bytes=0-"
```

### 3. Recuperer une image

```bash
curl -X GET http://localhost:4003/files/9f9b2c0a-4b59-4cc8-8f6e-6f2f7e8b2a10/stream \
	-H "Authorization: Bearer YOUR_JWT" \
	--output image.jpg
```

### 4. Supprimer un fichier

```bash
curl -X DELETE http://localhost:4003/files/9f9b2c0a-4b59-4cc8-8f6e-6f2f7e8b2a10 \
	-H "Authorization: Bearer YOUR_JWT"
```

---

## Codes HTTP

| Code | Sens | Exemple |
|------|------|---------|
| 200 | OK | Requete reussie |
| 201 | Created | Ressource creee |
| 400 | Bad Request | Donnees invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou invalide |
| 404 | Not Found | Ressource inexistante |
| 500 | Server Error | Erreur serveur |

---

## Cas d'erreur courants

### Erreur 401 - Non authentifie

```bash
curl -X POST http://localhost:4003/files/upload \
	-F "file=@./sample.mp4"

# Reponse
{
	"success": false,
	"error": {
		"message": "Token manquant ou invalide",
		"status": 401
	}
}
```

**Solutions**:
- Ajouter l'en-tete `Authorization: Bearer <JWT>`
- Verifier que `JWT_ENABLED=true`

### Erreur 404 - Fichier introuvable

```bash
curl -X GET http://localhost:4003/files/invalid-id/stream \
	-H "Authorization: Bearer YOUR_JWT"

# Reponse
{
	"success": false,
	"error": {
		"message": "Fichier introuvable",
		"status": 404
	}
}
```

**Solutions**:
- Verifier l'ID retourne lors de l'upload
- Verifier que le fichier existe toujours sur disque

---

## Bonnes pratiques

### 1. Structurer les chemins

```bash
# category et folder sont utilises pour structurer les uploads
curl -X POST http://localhost:4003/files/upload \
	-H "Authorization: Bearer $JWT" \
	-F "categoryName=Action" \
	-F "folder=Avatar" \
	-F "file=@./poster.jpg"
```

### 2. Verifier la taille des fichiers

```bash
# MAX_FILE_SIZE controle la limite (en octets)
MAX_FILE_SIZE=500000000
```

### 3. Gerer les erreurs cote client

```bash
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4003/files/invalid-id/stream)
if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "206" ]; then
	echo "Erreur HTTP: $HTTP_CODE"
fi
```

---

## Support et contact

- **GitHub**: https://github.com/clementbas/Netflim_FILE
- **Issues**: https://github.com/clementbas/Netflim_FILE/issues
- **Documentation Swagger**: http://localhost:4003/docs