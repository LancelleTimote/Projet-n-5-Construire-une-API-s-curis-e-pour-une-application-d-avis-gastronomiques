const mongoose = require('mongoose');   //importation de mongoose pour pouvoir l'utiliser
const uniqueValidator = require('mongoose-unique-validator'); //importation du package de validation pour pré-valider les informations avant de les enregistrer (npm install --save mongoose-unique-validator)

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },  //unique pour ne pas que deux utilisateurs utilisent le même mail
  password: { type: String, required: true} //le mdp même si ça sera un hash crypté, ça sera un string
});

userSchema.plugin(uniqueValidator); //application du package de validation au schema avant d'en faire un modéle, avec uniqueValidator en argument

module.exports = mongoose.model('User', userSchema);  //on utilise la fonction modèle de mongoose, le modéle va s'appeler User, et on lui passer userSchema comme schéma de donnée