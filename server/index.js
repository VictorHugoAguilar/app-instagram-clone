const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const { ApolloServer } = require('apollo-server');
const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolver");

mongoose.connect(process.env.BBDD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}, (err, _) => {
    if (err) {
        console.log('Error de conexión', err);
    } else {
        let datosConexion = "name: " + _.connections[0].name + "\n";
        datosConexion += " host: " + _.connections[0].host + "\n";
        datosConexion += " port: " + _.connections[0].port + "\n";
        datosConexion += " user: " + _.connections[0].user + "\n";
        datosConexion += " pass: " + _.connections[0].pass + "\n";
        datosConexion += " db: " + _.connections[0].db + "\n";
        console.log('Conexión correcta\n------------------\n', datosConexion);
        server();
    }
});



function server(){
    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers
    });

    serverApollo.listen().then( (response) => {
        console.log('Server ON');
    });
}