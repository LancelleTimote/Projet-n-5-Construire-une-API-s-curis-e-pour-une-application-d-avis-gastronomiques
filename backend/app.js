const express = require('express'); //importation de express
const mongoose = require('mongoose'); //importation pour MongoDB
const app = express();  //app qui sera notre application express
const path = require('path'); //nous donne accès au chemin de notre système de fichiers (comme on sait pas le chemin exact à l'avance pour le dossier images(express.static))
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');  //importation routes utilisateurs
require('dotenv').config();
const username = process.env.userNameMongoDb;
const mdp = process.env.mdpMongoDb;

mongoose.connect(`mongodb+srv://${username}:${mdp}@sopekocko.xoxwf.mongodb.net/Piquante?retryWrites=true&w=majority`,  //notre adresse récupéré dans le cluster MongoDB
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {   //ne prend pas d'addresse en 1er paramètre pour s'appliquer à toute les routes, on ajoute des header à l'objet réponse
    res.setHeader('Access-Control-Allow-Origin', '*');  //on dit que l'origin, qui a le droit d'accéder à notre API c'est tout le monde '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    //on autorise l'utilisation de certains en-tête sur l'objet requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');    //on autorise aussi certaines méthodes, les verbes de requêtes
    next();
});

app.use(express.json());  //pour extraire l'objet JSON de la demande POST provenant de l'application front-end, permet de transformer le corps de la requête en objet JS utilisable
                          //(anciennement body parser, intégré à express)

app.use('/images', express.static(path.join(__dirname, 'images'))); //répond aux requêtes envoyé à /images, express.static pour servir le dossier static images, __dirname pour le nom
                                                                    //du dossier dans lequel on va se trouver, auquel on rajoute images

app.use('/api/sauces', sauceRoutes); //importation des routes POST, PUT, DELETE, GET, comme on veut enregistrer notre routeur pour toutes les demandes effectuées vers /api/stuff
app.use('/api/auth', userRoutes); //enregistrement des routes, api/auth est la route attendu par le frontend, la racine de tout ce qui sera authentification

module.exports = app;   //exportation de l'application pour pouvoir l'utiliser dans les autres fichiers