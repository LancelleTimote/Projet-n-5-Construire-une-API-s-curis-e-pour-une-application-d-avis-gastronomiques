const http = require('http');
const app = require('./app');

const port = 3000;

app.set('port', port);

const errorHandler = error => { //errorHandler recherche les différentes erreurs et les gère de manière appropriée, elle est ensuite enregistrée dans le serveur
    console.log(error+": Une erreur est survenue au démarrage du server.");
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    console.log('En attente d\'une communication réseau sur le port '+port);
});
server.on('request', () => {
    let objDate = new Date();
    console.log("Une requête provenant de l'application a bien été reçue ! ("
    +objDate.getDate()+"/"+(objDate.getMonth()+1)+"/"+objDate.getFullYear()+" à "
    +objDate.getHours()+":"+objDate.getMinutes()+":"+objDate.getSeconds()+")");
});

server.listen(port);