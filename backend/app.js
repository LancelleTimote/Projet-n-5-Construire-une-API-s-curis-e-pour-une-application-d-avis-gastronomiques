const express = require('express'); //importation de express
const mongoose = require('mongoose'); //importation pour MongoDB
const Sauce = require('./models/sauce');  //on importe notre nouveau modèle mongoose pour l'utiliser dans l'application

mongoose.connect('mongodb+srv://PekockoAdmin:OMMyQLOX67w2mUbL@sopekocko.xoxwf.mongodb.net/Piquante?retryWrites=true&w=majority',  //notre adresse récupéré dans le cluster MongoDB
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();  //app qui sera notre application express

app.use((req, res, next) => {   //ne prend pas d'addresse en 1er paramètre pour s'appliquer à toute les routes, on ajoute des header à l'objet réponse
    res.setHeader('Access-Control-Allow-Origin', '*');  //on dit que l'origin, qui a le droit d'accéder à notre API c'est tout le monde '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    //on autorise l'utilisation de certains en-tête sur l'objet requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');    //on autorise aussi certaines méthodes, les verbes de requêtes
    next();
});

app.use(express.json());  //pour extraire l'objet JSON de la demande POST provenant de l'application front-end, permet de transformer le corps de la requête en objet JS utilisable
                          //(anciennement body parser, intégré à express)

app.post('/api/sauces', (req, res, next) => {    //post pour traiter seulement les requêtes post
  delete req.body._id;  //vu que le frontend renvoie un id qui n'est pas le bon (le bon est généré automatique par mongoDB), donc supprime le champ id du corps de la requête, avant de
                        //copier l'objet
  const sauce = new Sauce({ //on crée une nouvelle instance de notre model thing
    ...req.body //on utilise l'opérateur spread pour copier les champs qu'il y a dans le corps de la requête (title, description, ...)
  });
  sauce.save()  //pour enregistrer le thing dans la BDD, elle retourne une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //obligé de renvoyer une réponse car sinon expiration de la requête, 201 pour une création de ressource
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/sauces/:id', (req, res, next) => { //premier segment dynamique, le frontend va envoyer l'id de l'objet, pour pouvoir aller chercher cette id on utilise ":id"
  Sauce.findOne({ _id: req.params.id }) //on utilise le modéle mongoose avec la méthode findOne pour trouver un seul objet, et on passe un objet de comparaison, là on veut que l'id
                                        //du Thing soit le même que le paramètre de requête au dessus
    .then(thing => res.status(200).json(thing)) //on retrouve le thing s'il existe dans la BDD, et on le renvoie en réponse au frontend
    .catch(error => res.status(404).json({ error })); //404 pour objet non trouvé
});

app.get('/api/sauces', (req, res, next) => { //le premier argument est l'URL visé par l'application (le endpoint, la route), l'url total serait http://localhost:3000/api/stuff
  Sauce.find()  //on utilise le modéle mongoose avec la méthode find pour avoir la liste des objets, elle retourne une promise
  .then(things => res.status(200).json(things)) //on récupère le tableau de tous les things retourné par la BDD, on les renvoie en réponse au frontend, 200 code ok
  .catch(error => res.status(400).json({ error }));
});

module.exports = app;   //exportation de l'application pour pouvoir l'utiliser dans les autres fichiers