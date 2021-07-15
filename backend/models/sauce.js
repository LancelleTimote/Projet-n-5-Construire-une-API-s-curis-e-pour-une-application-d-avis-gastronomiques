const mongoose = require('mongoose'); //importation de mongoose pour pouvoir l'utiliser

//notre schéma de donnée qui contient les données souhaités pour chaque Thing (pas besoin d'id car automatiquement généré par Mongoose)
const sauceSchema = mongoose.Schema ({  //fonction schéma mis à disposition par le package mongoose
    userId: { type: String, required: true }, //nom du champ (clé), puis on crée un objet avec le type, et champ requis (sans titre pas possible d'enregistrer un thing dans la base)
    name: { type: String, required: true, unique: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});
  
module.exports = mongoose.model('Sauce', sauceSchema);  //on exporte le model terminé, le premier argument c'est le nom du model