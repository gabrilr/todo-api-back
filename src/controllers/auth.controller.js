import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { token } from "morgan";

export const register = async (req, res) => {

    const { email, name, password, type_user } = req.body;

    try {
        
        const passwHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: passwHash,
            type_user
        });

        // console.log(newUser);

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
        res.json({
            id: userSaved._id,
            email: userSaved.email,
            name: userSaved.name,
            passwHash: userSaved.password
        });
    } catch (error) {
        console.log(error);        
    }

};

export const login = (req, res) => res.send('rifologin');
