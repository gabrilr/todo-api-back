import Project from "../models/project.model.js";
import User from "../models/user.model.js";

export const registerProject = async (req, res) => {
    const { titulo, descripcion, fechaInicio } = req.body;

    if (![titulo, descripcion, fechaInicio].includes('')) {

        // Validamos el formato de fecha con expresiones regulares.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
            return res.status(400).json({ mensaje: "Formato de fecha de inicio no válido" });
        }

        const id_responsable = req.params.id;

        try {
            // Validamos que exista el usuario antes de crear el proyecto.
            const userFound = await User.findById(id_responsable);

            if (userFound) {

                try {
                    const newProject = new Project({
                        id_responsable,
                        titulo,
                        descripcion,
                        fechaInicio
                    });

                    const projectSaved = await newProject.save();

                    res.json({
                        id_responsable: projectSaved.id_responsable,
                        titulo: projectSaved.titulo,
                        descripcion: projectSaved.descripcion,
                        fechaInicio: projectSaved.fechaInicio
                    });

                } catch (error) {
                    console.error(error);
                    res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
                }

            } else {
                res.status(404).json({ mensaje: "Error al crear el proyecto, usuario inválido" });
            }

        } catch (error) {
            console.log("Error al crear el proyecto ", error);
            res.status(500).json({ mensaje: "Error al buscar al usuario" });
        }

    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};

export const allProject = async (req, res) => {

    try {

        const projects = await Project.find().select('titulo');

        try {

            res.json(
            // {
            //     _id : project._id,
            //     id_responsable : project.id_responsable,
            //     titulo : project.titulo,
            //     descripcion : project.descripcion,
            // }

                projects

            );

        } catch (error) {
            res.json("Falla :c");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }

}
