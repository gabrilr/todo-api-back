import Project from "../models/project.model.js";
import User from "../models/user.model.js";

export const registerProject = async (req, res) => {

    const { titulo, descripcion, clave, fecha_inicio } = req.body;

    if (![titulo, descripcion, clave, fecha_inicio].includes('')) {

        // Validamos el formato de fecha con expresiones regulares.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_inicio)) {
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
                        clave,
                        fecha_inicio
                    });

                    const projectSaved = await newProject.save();

                    res.json({
                        id_responsable: projectSaved.id_responsable,
                        titulo: projectSaved.titulo,
                        descripcion: projectSaved.descripcion,
                        fecha_inicio: projectSaved.fecha_inicio
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

//db.prueba.find({ $or: [{author:/miguel/i}, {title: /miguel/i}] }); no borrar xd
export const allProjects = async (req, res) => {

    try {
        //const projects = await Project.find({_id: req.params.id}).select('titulo ');
        //const projects = await Project.find({ id_responsable: idResponsableBuscado }, { titulo: 1, clave: 1, descripcion: 1, _id: 1 });
        const projects = await Project.find({id_responsable: idResponsableBuscado,
                            colaboradores: {
                                $elemMatch: { id_colaborador: idColaboradorBuscado }
                            }
                        }, { titulo: 1, clave: 1, descripcion: 1, _id: 1 });
        //     , (err, projects) => {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(projects);
        //     }
        // }
        //);
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
            res.status(500).json({ mensaje: "Error al obtener los proyectos" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }

}