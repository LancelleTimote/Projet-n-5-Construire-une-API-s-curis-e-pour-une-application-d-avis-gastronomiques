const mongoose = require('mongoose'); //création d'un model user avec mongoose, on importe donc mongoose
//on rajoute ce validateur comme plugin
const uniqueValidator = require('mongoose-unique-validator');   //package qui valide l'unicité de l'email

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },  //unique pour ne pas que deux utilisateurs utilisent le même mail
    password: { type: String, required: true}   //le mdp même si ça sera un hash crypté, ça sera un string
});

//plugin pour garantir un email unique
userSchema.plugin(uniqueValidator); //on applique ce validateur au schéma avant d'en faire un modèle et on appelle la méthode plugin et on lui passe uniqueValidator

module.exports = mongoose.model('User', userSchema);    //on utilise la fonction modèle de mongoose, le modéle va s'appeler User, et on lui passer userSchema comme schéma de donnée