// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les sauces
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller sauce.js

const express = require('express');
const router = express.Router();    //on crée un router avec la méthode d'express
const sauceCtrl = require('../controllers/sauce');  //on importe les controllers, on associe les fonctions aux différentes routes
const auth = require('../middleware/auth');  //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger
const multer = require('../middleware/multer-config');  //on importe le middleware pour le téléchargement des images, pour la route post quand on crée un nouvel objet

router.post('/', auth, multer, sauceCtrl.createSauce);  //route qui permet de créer "une sauce"
router.post('/:id/like', auth, sauceCtrl.rateOneSauce); //route qui permet de gérer les likes des sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce);    //route qui permet de modifier "une sauce"
router.delete('/:id', auth, sauceCtrl.deleteSauce); //route qui permet de supprimer "une sauce"
router.get('/:id', auth, sauceCtrl.getOneSauce);    //route qui permet de cliquer sur une des sauces précise
router.get('/', auth, sauceCtrl.getAllSauces);  //route qui permet de récupérer toutes les sauces

module.exports = router;