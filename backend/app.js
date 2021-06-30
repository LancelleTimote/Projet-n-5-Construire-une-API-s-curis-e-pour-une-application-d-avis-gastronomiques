const express = require('express'); //importation de express
const mongoose = require('mongoose'); //importation pour MongoDB
const sauce = require('./models/sauce');  //on importe notre nouveau modèle mongoose pour l'utiliser dans l'application

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
    console.log(req.body);  //le corps de la requête dont on a accès grâce à express.json
    res.status(201).json({  //res obligatoire car le frontend attend une réponse (sinon site charge en continu), code 201 pour une ressource créer
        message: 'Objet créé !'   //on envoie un message en json
    });
});

app.use('/api/sauces', (req, res, next) => { //le premier argument est l'URL visé par l'application (le endpoint, la route), l'url total serait http://localhost:3000/api/stuff
    const sauces = [ //tableau stuff avec 2 objets
      {             //la forme des objets attendus par le frontend
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,    //prix en centimes, pour utiliser le moins de chiffres après la virgule, pour éviter les problèmes d'arithmétique
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(sauces);    //attribu un code 200 à la réponse (réponse réussi), et envoie en json le tableau stuff
});

module.exports = app;   //exportation de l'application pour pouvoir l'utiliser dans les autres fichiers