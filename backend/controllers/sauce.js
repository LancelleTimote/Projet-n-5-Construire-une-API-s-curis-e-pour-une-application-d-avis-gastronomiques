//on prend toute la logique métier pour la déporter dans le fichier sauce.js de controllers
//on ne garde que la logique de routing dans le fichier sauce.js du router. On importe aussi le model Sauce
//on a ajouté le controller sauce avec une constante sauceCtrl dans le fichier sauce.js du router

const Sauce = require('../models/Sauce');   //on importe notre nouveau modèle mongoose pour l'utiliser dans l'application
const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers (ici les téléchargements et modifications d'images)
const jwt = require('jsonwebtoken');
require('dotenv').config();

//création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //on stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    delete sauceObject._id;     //on supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    const sauce = new Sauce({   //création d'une instance du modèle Sauce
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`   //on modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
    });
    sauce.save()    //sauvegarde de la sauce dans la base de données
    .then(() => res.status(201).json({ message: 'The sauce was created successfully !' }))  //on envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
    .catch(error => res.status(400).json({ error }));   //on ajoute un code erreur en cas de problème
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (      //on crée un objet thingObject qui regarde si req.file existe ou non
        Sauce.findOne({ _id: req.params.id })   //si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlinkSync(`images/${filename}`)
        }),
        sauceObject = { //on modifie les données et on ajoute la nouvelle image
            ...JSON.parse(req.body.sauce),  //s'il existe, on traite la nouvelle image, on récupère la chaîne de caractère, on la parse en objet
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,    //on modifie l'image URL
        }
    ) : (   //opérateur ternaire équivalent à if() {} else {} => condition ? instruction si vrai : instruction si faux
        sauceObject = { ...req.body }   //s'il n'existe pas, on traite simplement l'objet entrant, on prend le corps de la requête
    ) 
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //pour modifier dans la base de donnée
    .then(() => res.status(200).json({ message: 'The sauce has been changed !' }))
    .catch(error => res.status(400).json({ error }));
};

// if (sauce.userId !== req.user) {  //on compare l'id de l'auteur de la sauce et l'id de l'auteur de la requête
//     res.status(403).json({ message: 'Forbidden action !' });  //si ce ne sont pas les mêmes id = code 401: unauthorized.
//     return sauce;
// } else {

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })   //avant de supprimer l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
    .then((sauce) => {
        const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
        const userId = decodedToken.userId;
        if (sauce.userId === userId) {
            const filename = sauce.imageUrl.split('/images/')[1];   //pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
            fs.unlink(`images/${filename}`, () => {                 //avec ce nom de fichier, on appelle unlink pour suppr le fichier
                Sauce.deleteOne({ _id: req.params.id })             //on supprime le document correspondant de la base de données
                    .then(() => res.status(200).json({ message: 'The sauce has been removed !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        }else{
            res.status(401).json({ error: 'Identifiant utilisateur invalide !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//récupère une sauce grâce à son id depuis la base MongoDB
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })   //on utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requêt
    .then(sauce => res.status(200).json(sauce))         //si ok on retourne une réponse et l'objet
    .catch(error => res.status(404).json({ error }));   //si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
};

//récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()    //on utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
    .then(sauces => res.status(200).json(sauces))       //si OK on retourne un tableau de toutes les données
    .catch(error => res.status(400).json({ error }));   //si erreur on retourne un message d'erreur
};

//fonction d'évaluation des sauces (like ou dislike)
//3 conditions possible car voici ce qu'on reçoit du frontend, la valeur du like est soit: 0, 1 ou -1 (req.body.like)
//un switch statement est parfaitement adapté
exports.rateOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => { 
        switch (req.body.like) {
            case 0:                                                                 //si l'utilisateur enlève son like ou dislike
                if (sauce.usersLiked.includes(req.body.userId)) {                   //on vérifie si le user a déjà like cette sauce
                    Sauce.updateOne({ _id: req.params.id }, {                       //on décrémente la valeur des likes de 1 (soit -1)
                    $inc: { likes: -1 },                                            //si oui, on va mettre à jour la sauce avec le _id présent dans la requête
                    $pull: { usersLiked: req.body.userId },                         //on retire l'utilisateur du tableau
                    _id: req.params.id})
                    .then(() => res.status(201).json({ message: "Like successfully canceled !" }))   //code 201: created
                    .catch(error => res.status(400).json({ error }));                               //code 400 : bad request

                }else if (sauce.usersDisliked.includes(req.body.userId)){           //on vérifie si l'utilisateur a déjà dislike cette sauce
                    Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId },
                    _id: req.params.id})
                    .then(() => res.status(201).json({ message: "Dislike successfully canceled !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;
            
            case 1:                                                         //si l'utilisateur like la sauce
                if (!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)) {    //on vérifie si l'utilisateur n'a pas déjà like ou dislike cette sauce
                    Sauce.updateOne({ _id: req.params.id }, {               //on recherche la sauce avec le _id présent dans la requête
                    $inc: { likes: 1 },                                     //on incrémente de 1 la valeur de likes
                    $push: { usersLiked: req.body.userId },                 //on ajoute l'utilisateur dans le array usersLiked
                    _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Like successfully added !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;
            
            case -1:                                                        //si utilisateur dislike la sauce
                if (!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)) {    //on vérifie si l'utilisateur n'a pas déjà dislike ou like cette sauce
                    Sauce.updateOne({ _id: req.params.id }, {               //on recherche la sauce avec le _id présent dans la requête
                    $inc: { dislikes: 1 },                                  //on incrémente de 1 la valeur de dislikes
                    $push: { usersDisliked: req.body.userId },              //on rajoute l'utilisateur à l'array usersDiliked
                    _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Dislike successfully added !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;

            default:
                throw("Impossible to react on this sauce, try again later !") //on envoie l'exception
        }
    })
    .catch(error => res.status(400).json({ error }));    
  };