const express = require('express'); //importation d'express (après l'avoir installer avec la console)
const router = express.Router();    //on crée un router avec la méthode d'express

const sauceCtrl = require('../controllers/sauce');  //on importe les routes controllers

router.post('/', sauceCtrl.createSauce);
  
router.put('/:id', sauceCtrl.modifySauce);
  
router.delete('/:id', sauceCtrl.deleteSauce);
  
router.get('/:id', sauceCtrl.getOneSauce);
  
router.get('/', sauceCtrl.getAllSauces);

module.exports = router;  //on exporte le router