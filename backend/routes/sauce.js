const express = require('express'); //importation d'express (après l'avoir installer avec la console)
const router = express.Router();    //on crée un router avec la méthode d'express

const sauceCtrl = require('../controllers/sauce');  //on importe les routes controllers
const auth = require('../middleware/auth'); //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger

router.post('/', auth, sauceCtrl.createSauce);
  
router.put('/:id', auth, sauceCtrl.modifySauce);
  
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
router.get('/:id', auth, sauceCtrl.getOneSauce);
  
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;  //on exporte le router