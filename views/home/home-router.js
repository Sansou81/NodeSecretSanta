const express = require('express');
const {genererNaif} = require("./home");
const {addPersonne} = require("./home");
const {getPersonne} = require("./home");
const {supprimerPersonne} = require("./home");
const router = express.Router();

/**
 * Ajoute une personne à partir d'un DTO.
 */
router.post('/api/participant/ajouter', function (req, res) {
    let resulat = addPersonne(req.body);
    if (resulat) {
        res.status(200);
    } else {
        res.status(400);
    }
    res.send();
});

/**
 * Supprime une personne à partir d'un id.
 */
router.post('/api/participant/supprimer/:id', function (req, res) {
    const id = Number(req.params.id);
    let resultat = supprimerPersonne(id);
    if (resultat) {
        res.status(200);
    } else {
        res.status(400);
    }
    res.send();
});

/**
 * Retourne un JSON contenant la liste des participants
 */
router.get('/api/participant', function (req, res) {
    res.status(200);
    res.json(JSON.stringify(getPersonne()));
    res.send();
});

/**
 * Lance la génération du tirage et l'envoi des mails
 */
router.post('/api/participant/generer', function (req, res) {
    let resulat = genererNaif(req.body);
    if (resulat) {
        res.status(200);
    } else {
        res.status(400);
    }
    res.send();
});

module.exports = router;
