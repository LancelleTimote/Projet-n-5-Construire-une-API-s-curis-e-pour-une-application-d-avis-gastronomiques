const bcrypt = require('bcrypt'); //importation de bcrypt après installation (npm install --save bcrypt)

const User = require('../models/User'); //importation du modèle User

exports.signup = (req, res, next) => {  //pour l'enregistrement / création de nouveau utilisateur
    bcrypt.hash(req.body.password, 10)  //fonction pour hasher / crypter le mdp, fonction asynchrone qui prend du temps qui renvoie une Promise et dans laquelle nous recevons le hash
                                        //généré. On passe en argmuent le mdp du corps de la req qui sera passer par le frontend. 10 (salt) pour le nombre de fois qu'on exécute l'algorithme
                                        // de hashage (plus le nombre est grand, plus ça prend du temps, mais plus le hashage est sécurisé)
    .then(hash => { //on récupère le hash du mdp
       const user = new User({  //on crée le nouvel utilisateur avec notre modèle mongoose
           email: req.body.email,   //pour le mail, on passe celui dans le corps de la requête
           password : hash  //pour le mdp on va enregistrer le hash crée dans then, afin de ne pas stocker le mdp à blanc
       }); 
       user.save()  //on utilise la méthode save de notre user pour l'enregistrer dans la bdd
       .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //on renvoie 201 pour une création de ressource, avec un message
       .catch(error => res.status(400).json({ error }));    //400 pour différencier du 500 en dessous
    })
    .catch(error => res.status(500).json({ error }));   //500 parce que c'est une erreur serveur
};

exports.login = (req, res, next) => {

};