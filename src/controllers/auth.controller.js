
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const { email, name, password, type_user } = req.body;

    if (![email, name, password, type_user].includes('')) {
        try {

            // Validación de correo.
            const expRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!expRegular.test(email)) {
                return res.status(400).json({ mensaje: "Formato de correo electrónico no válido." });
            }

            // Validación de la contraseña
            if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return res.status(400).json({ mensaje: "La contraseña no cumple con los requisitos mínimos." });
            }

            // Hasheo de la contraseña recibids por el body
            const passwHash = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                name,
                password: passwHash,
                type_user
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
                name: userSaved.name,
                type_user: userSaved.type_user
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ mensaje: "Error interno del servidor." });
        }
    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};
