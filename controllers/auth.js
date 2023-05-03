const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, name, password } = req.body;

    try{
    //Verificar el email
        const usuario = await Usuario.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body )

        //Hashear la constraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );  

        //Generar el JWT
        const token = await generateJWT(dbUser.id, name);

        //Crear usuario de DB
        await dbUser.save();

        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            email,
            token
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
    
        });
    }

}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({email});

        if( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'El password no es valido'
            });
        }

        //Generar el JWT
        const token = await generateJWT(dbUser.id, dbUser.name);

        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token: token
        })

    } catch (error){
        console.log(error);

        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }


}

const revalidateToken = async(req, res) => {

    const { uid, name } = req;
    console.log(req)

    const dbUser = await Usuario.findById(uid)

    const token = await generateJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        token
    })
}

module.exports = {
    createUser, loginUser, revalidateToken
}