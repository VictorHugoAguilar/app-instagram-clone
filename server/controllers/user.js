const User = require('../models/user');
const bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');


async function register(input) {
    console.log('Registrando usuario...');
    console.log('Usuario de entrada ', input);
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Validamos si el email esta en uso
    const foundEmail = await User.findOne({ email });
    console.log('Email encontrado -> ', foundEmail);
    // Si el valor no es encotrado se puede registrar
    if (foundEmail) {
        throw new Error('El email ya está en uso');
    }

    // Validamos si el username esta registrado
    const foundUsername = await User.findOne({ username });
    console.log('Username encontrado -> ', foundUsername);
    // Si el valor no es encotrado se puede registrar
    if (foundUsername) {
        throw new Error('El Username ya está en uso');
    }

    // Encriptamos
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();
        return user;
    } catch (error) {
        console.error(error);
    }

    console.log('Usuario formateado ', newUser)
    return null;

}

async function login(input) {
    const { email, password } = input;
    console.log('Email: ', email);
    console.log('Password: ', password);
    // comprobamos el usuario ingresado
    const userFound = await User.findOne({ email: email.toLowerCase() });
    // Si no lo encuentra
    if (!userFound) {
        throw new Error('El usuario o email no existe o no es correcto');
    }
    // Verificamos si el pass es correcto
    const passwordSucess = await bcryptjs.compare(password, userFound.password);
    if (!passwordSucess) {
        throw new Error('El usuario o email no existe o no es correcto');
    }
    console.log(createToken(userFound, process.env.SECRET_KEY, "24h" ))
    // Si todo es correcto
    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h" )
    }

}

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, nombre, email, username} = user;
    const payload = {
        id, nombre, email, username
    };
    return jwt.sign(payload, SECRET_KEY, {expiresIn});
}

module.exports = {
    register,
    login,
}