const express = require('express'); //importation de express

const app = express();  //app qui sera notre application express

app.use((req, res, next) => {
    console.log('Requête reçue !'); //message qui va apparaitre dans la console
    next();     //next permet d'envoyer au prochain middleware
});
  
app.use((req, res, next) => {
    res.status(201);    //modification du code de la réponse http
    next();
});
  
app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });  //message qui va apparaitre dans Postman
    next();
});
  
app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');   //message qui va apparaitre dans la console à la fin
});

module.exports = app;   //exportation de l'application pour pouvoir l'utiliser dans les autres fichiers