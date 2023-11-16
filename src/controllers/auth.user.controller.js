
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {

    const { email, nombre, contrasena } = req.body;

    if (![email, nombre, contrasena].includes('')) {

        // Validación de correo.
        const expRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!expRegular.test(email)) {
            
            return res.status(400).json({ mensaje: "Formato de correo electrónico no válido." });
        } else {
            // Validación de la contraseña
            if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) || !/[a-z]/.test(contrasena) || !/\d/.test(contrasena) || !/[!@#$%^&*(),.?":{}|<>_]/.test(contrasena)) {
                return res.status(400).json({ mensaje: "La contraseña es muy debil, recuerda poner un numero, una mayuscula y un digito, y que sea mayor a 8 caracteres. " });
            } else {
                try {
                    // Hasheo de la contraseña recibida
                    const contrasena_hash = await bcrypt.hash(contrasena, 10);
    
                    const newUser = new User({
                        email,
                        nombre,
                        contrasena: contrasena_hash,
                    });
    
                    const userSaved = await newUser.save();
                    // Respuesta de Usuario creado.
                    res.json({
                        id: userSaved._id,
                        email: userSaved.email,
                        nombre: userSaved.nombre,
                    });
                    
                    /*jwt.sign(
                        {
                            id: userSaved._id,
                        },
                        "qwerty321",
                        {
                            expiresIn: "1d",
                        },
                        (err, token) => {
                            if(err) console.log(err);
                            res.json({token});
                        }
                    );*/
                    
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ mensaje: "Error interno del servidor, usuario no guardado." });
                }
            }
        }

    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};

export const updateUser = async (req, res) => {

    const { id, nombre, contrasena } = req.body;


    if (![id, nombre, contrasena].includes('')) {

        if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) || !/[a-z]/.test(contrasena) || !/\d/.test(contrasena) || !/[!@#$%^&*(),.?":{}|<>_]/.test(contrasena)) {
            return res.status(400).json({ mensaje: "La contraseña es muy debil, recuerda poner un numero, una mayuscula y un digito, y que sea mayor a 8 caracteres. " });
        } else {
            try {
                // Hasheo de la contraseña recibida
                const contrasena_hash = await bcrypt.hash(contrasena, 10);
                try {
                    //console.log(id+" "+nombre+" "+contrasena_hash);
                    const user = await User.findByIdAndUpdate(id, {
                                    nombre, 
                                    contrasena: contrasena_hash
                                }, { new: true }); //Retornamos el usu actualizado, para usarlo en un futuro.
                    if (!user) {
                        return res.status(404).json({ error: 'Usuario no encontrado' });
                    }
                    //res.json(user);
                    res.json({mensaje: "Se actualizaron los datos"});
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error al actualizar usuario' });
                }

            } catch (error) {
                console.log(error);
                return res.status(500).json({ mensaje: "Error interno del servidor, usuario no guardado." });
            }
        }

    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};

