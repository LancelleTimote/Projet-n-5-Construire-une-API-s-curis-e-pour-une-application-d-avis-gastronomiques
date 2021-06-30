const Sauce = require('../models/sauce');  //on importe notre nouveau modèle mongoose pour l'utiliser dans l'application

exports.createSauce = (req, res, next) => {    //post pour traiter seulement les requêtes post
    delete req.body._id;  //vu que le frontend renvoie un id qui n'est pas le bon (le bon est généré automatique par mongoDB), donc supprime le champ id du corps de la requête, avant de
                          //copier l'objet
    const sauce = new Sauce({ //on crée une nouvelle instance de notre model thing
      ...req.body //on utilise l'opérateur spread pour copier les champs qu'il y a dans le corps de la requête (title, description, ...)
    });
    sauce.save()  //pour enregistrer le thing dans la BDD, elle retourne une promise
      .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //obligé de renvoyer une réponse car sinon expiration de la requête, 201 pour une création de ressource
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })  //pour modifier un thing dans la base de donnée, le premier argument c'est l'objet de comparaison pour
    //savoir quel objet on modifie (celui dont l'id est égal à l'id qui est envoyé dans les paramètres de requête), le deuxième argument c'est la nouvelle version de l'objet (spread
    //operator pour récupérer le thing dans la requête, on ajoute que l'id correspond à celui des paramètres)
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }) //pour supprimer, qui prend l'objet de comparaison comme argument, comme updateOne
                                            //dans la bdd
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //premier segment dynamique, le frontend va envoyer l'id de l'objet, pour pouvoir aller chercher cette id on utilise ":id"
    Sauce.findOne({ _id: req.params.id }) //on utilise le modéle mongoose avec la méthode findOne pour trouver un seul objet, et on passe un objet de comparaison, là on veut que l'id
                                          //du Thing soit le même que le paramètre de requête au dessus
      .then(sauce => res.status(200).json(sauce)) //on retrouve le thing s'il existe dans la BDD, et on le renvoie en réponse au frontend
      .catch(error => res.status(404).json({ error })); //404 pour objet non trouvé
};

exports.getAllSauces = (req, res, next) => { //le premier argument est l'URL visé par l'application (le endpoint, la route), l'url total serait http://localhost:3000/api/stuff
    Sauce.find()  //on utilise le modéle mongoose avec la méthode find pour avoir la liste des objets, elle retourne une promise
    .then(sauces => res.status(200).json(sauces)) //on récupère le tableau de tous les things retourné par la BDD, on les renvoie en réponse au frontend, 200 code ok
    .catch(error => res.status(400).json({ error }));
};