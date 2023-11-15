
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const { email, nombre, contrasena } = req.body;

    if (![email, nombre, contrasena].includes('')) {
        try {

            // Validación de correo.
            const expRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!expRegular.test(email)) {
                return res.status(400).json({ mensaje: "Formato de correo electrónico no válido." });
            }

            // Validación de la contraseña
            if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) || !/[a-z]/.test(contrasena) || !/\d/.test(contrasena) || !/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) {
                return res.status(400).json({ mensaje: "La contraseña no cumple con los requisitos mínimos." });
            }

            // Hasheo de la contraseña recibida
            const contrasena_hash = await bcrypt.hash(contrasena, 10);

            const newUser = new User({
                email,
                nombre,
                contrasena: contrasena_hash,
            });

            const userSaved = await newUser.save();

            /*
            jwt.sign(
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
            );
            */

            // Respuesta exitosa del servidor con el usuario creado.
            res.json({
                id: userSaved._id,
                email: userSaved.email,
                nombre: userSaved.nombre,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ mensaje: "Error interno del servidor." });
        }
    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};
