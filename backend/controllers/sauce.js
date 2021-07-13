const Sauce = require('../models/Sauce');  //on importe notre nouveau modèle mongoose pour l'utiliser dans l'application
const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //pour extraire l'objet JSON du thing dans req.body
    delete sauceObject._id;  //on enlève le champ id du corps de la requête, car le front-end renvoi un id qui n'est pas bon
    const sauce = new Sauce({ //création d'une nouvelle instance du model Thing
        ...sauceObject, //permet de copier les champs qu'il y a dans le body de la request et il va détailler le titre, etc...
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //génération de l'url de l'image, req.protocol pour le http ou https, ensuite le host du serveur
                                                                                    //localhost:3000 mais pour un déploiement ça sera la racine du serveur, le dossier images, et le
                                                                                    //le nom du fichier
    });
    if(!req.body.errorMessage) {
        sauce.save()  //permet d'enregistrer le thing dans la base de donnée, la méthode save renvoie une promise
        .then(() => {
            res.status(201).json({ message: 'La sauce a été créée avec succès !' }); //il faut renvoyer une réponse à la front-end, pour éviter l'expiration de la requête, code 201 pour une bonne
                                                                                    //création de ressources, et envoie un message en json
        })
        .catch(error => {
            if(error.message.indexOf("to be unique")>0) {
                req.body.errorMessage = "Le nom de cette sauce existe déjà!";
            }
            next();
        })
    } else {
        next();
    }
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?  //on crée un objet thingObject qui regarde si req.file existe ou non
    {
        ...JSON.parse(req.body.sauce),  //s'il existe, on traite la nouvelle image, on récupère la chaîne de caractère, on la parse en objet
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    //on modifie l'image URL
    } : { ...req.body };    //s'il n'existe pas, on traite simplement l'objet entrant, on prend le corps de la requête
    if(!req.body.errorMessage) {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //pour modifier un thing dans la base de donnée, le premier argument c'est l'objet de comparaison
        //pour savoir quel objet on modifie (celui dont l'id est égal à l'id qui est envoyé dans les paramètres de requête), le deuxième argument c'est la nouvelle version de l'objet
        .then(() => {
            if(!req.file) {
                res.status(200).json({ message: 'La sauce a bien été modifiée!' })
            } else {
                next();
            }
        })
        .catch(error => { 
            if(error.message.indexOf("duplicate key")>0) {
                req.body.errorMessage = 'Le nom de cette sauce existe déjà!';
            }
            next();
        })
    } else {
        next();
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })   //on trouve l'objet dans la bdd, on veut trouver celui qui a l'id qui correspond à celui dans les paramètres de la requête
    .then(sauce => {    //quand on le trouve
        const filename = sauce.imageUrl.split('/images/')[1];   //on extrait le nom du fichier à supprimer, le split va retourner un tableau de 2 éléments, 1er élément tout ce
                                                                //qui est avant /images/, puis 2ème éléments tout ce qu'il y a après
        fs.unlink(`images/${filename}`, () => { //avec ce nom de fichier, on le supprime avec fs.unlink, le 1er argument c'est la chaîne de caractère qui correspond au chemin de
                                                //l'image donc images/filename, et le 2ème argument c'est le callback (=>), ce qu'il faut faire une fois le fichier supprimé
            Sauce.deleteOne({ _id: req.params.id }) //pour supprimer, qui prend l'objet de comparaison comme argument, comme updateOne, une fois que l'image est supprimer, on
                                                    //supprime l'objet dans la bdd
                .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !' }))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));   //erreur 500 pour une erreur serveur
};

exports.getOneSauce = (req, res, next) => { //premier segment dynamique, le frontend va envoyer l'id de l'objet, pour pouvoir aller chercher cette id on utilise ":id"
    Sauce.findOne({ _id: req.params.id }) //on utilise le modéle mongoose avec la méthode findOne pour trouver un seul objet, et on passe un objet de comparaison, là on veut que l'id
                                          //du Thing soit le même que le paramètre de requête au dessus
    .then(sauce => {    //on retrouve le thing s'il existe dans la BDD, et on le renvoie en réponse au frontend
        res.status(200).json(sauce);
    })
    .catch( error => {
        res.status(404).json({ error: error }); //404 pour objet non trouvé
    });
};

exports.getAllSauces = (req, res, next) => { //le premier argument est l'URL visé par l'application (le endpoint, la route), l'url total serait http://localhost:3000/api/stuff
    Sauce.find()  //on utilise le modéle mongoose avec la méthode find pour avoir la liste des objets, elle retourne une promise
    .then(sauces => {   //on récupère le tableau de tous les things retourné par la BDD, on les renvoie en réponse au frontend, 200 code ok
        res.status(200).json(sauces);
    })
    .catch(error => {
        res.status(400).json({ message: error });
    });
};