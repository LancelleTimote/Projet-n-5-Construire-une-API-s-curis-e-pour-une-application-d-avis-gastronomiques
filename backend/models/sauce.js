const mongoose = require('mongoose');

//notre schéma de donnée qui contient les données souhaités pour chaque Thing (pas besoin d'id car automatiquement généré par Mongoose)
const sauceSchema = mongoose.Schema ({  //fonction schéma mis à disposition par le package mongoose
    userId: { type: String, required: true },               //userId du createur
    name: { type: String, required: true, unique: true},    //nom de la sauce
    manufacturer: { type: String, required: true },         //créateur de la sauce
    description: { type: String, required: true },          //description de la sauce
    mainPepper: { type: String, required: true },           //ingredients qui pimentent la sauce
    imageUrl: { type: String, required: true },             //adresse de l'image de presentation de la sauce
    heat: { type: Number, required: true },                 //niveau de piquant de la sauce
    likes: { type: Number, required: false, default: 0 },   //nombre de like reçu
    dislikes: { type: Number, required: false, default: 0 },//nombre de dislike reçu
    usersLiked: { type: Array, required: false },           //utilisateurs qui like la sauce
    usersDisliked: { type: Array, required: false }         //utilisateurs qui disLike la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);  //on exporte le model terminé, le premier argument c'est le nom du model