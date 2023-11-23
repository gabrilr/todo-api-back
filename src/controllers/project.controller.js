import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import { generarCodigoAleatorio } from '../libs/rnd.js';
import moment from 'moment';

export const registerProject = async (req, res) => {

    const { id_responsable, titulo, descripcion } = req.body;
    let fecha_inicio = req.body.fecha_inicio;

    if (![id_responsable, titulo, descripcion].includes('')) {

        //Si no se agrega la fecha se le agrega por defecto la fecha de hoy
        if (fecha_inicio == "") {

            const hoy = moment();
            fecha_inicio = hoy.format('YYYY-MM-DD');
            //console.log(hoy.format('YYYY-MM-DD'));
        }
        // Validamos el formato de fecha con expresiones regulares.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_inicio)) {
            return res.status(400).json({ mensaje: "Formato de fecha de inicio no válido" });
        }

        try {
            // Validamos que exista el usuario antes de crear el proyecto.
            const userFound = await User.findById(id_responsable);

            if (userFound) {

                let clave = generarCodigoAleatorio();
                let claveRepetida = await Project.find({ clave: clave });

                //console.log(JSON.stringify(claveRepetida));
                while(!claveRepetida.length === 0){

                    console.log('clave repetida');
                    clave = generarCodigoAleatorio();
                    claveRepetida = await Project.findOne({ clave: clave });
                }

                try {
                    const newProject = new Project({
                        id_responsable,
                        titulo,
                        descripcion,
                        clave,
                        colaboradores: [],
                        fecha_inicio
                    });

                    const projectSaved = await newProject.save();

                    res.json({
                        id_responsable: projectSaved.id_responsable,
                        titulo: projectSaved.titulo,
                        clave: projectSaved.clave,
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

    const id = req.body.id;

    try {
        //const projects = await Project.find({_id: req.params.id}).select('titulo ');
        //const projects = await Project.find({ id_responsable: idResponsableBuscado }, { titulo: 1, clave: 1, descripcion: 1, _id: 1 });
        // const projects = await Project.find({id_responsable: id, colaboradores: id},
        //                             { titulo: 1, clave: 1, descripcion: 1, _id: 1 });

                            // colaboradores: {
                            //     $elemMatch: { id_colaborador: id }
                            // }
                        //Project.find({ colaboradores: userId });
        //     , (err, projects) => {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(projects);
        //     }
        // }
        //);
        const projects = await Project.find(
            {
              $or: [
                { id_responsable: id },
                { colaboradores: id },
              ],
            },
            { titulo: 1, clave: 1, descripcion: 1, _id: 1 }
        );

        const myprojects = await Promise.all(projects.map(async (project) => {

            const totalTickets = await Ticket.countDocuments({ id_proyecto: project._id });
            const ticketsDone = await Ticket.countDocuments({ id_proyecto: project._id, estatus: 'done' });
            const ticketsCheck = await Ticket.find({ id_proyecto: project._id, estatus: 'done' });
            
            //proyecto: project,
            return {
                titulo: project.titulo,
                clave: project.clave,
                totalTickets: totalTickets,
                ticketsDone: ticketsDone,
                ticketsCheck: ticketsCheck,
            };

        }));

        res.json(myprojects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }
}

export const addNewColab = async (req, res) => {

    //const id_proyecto = req.body.id;
    const { id_proyecto, id } = req.body;

    try {
        
        try {
            const proyectoActualizado = await Project.findByIdAndUpdate(
                id_proyecto ,
                { $push: { colaboradores: id } },
                { new: true }
            );
            res.json(
                {mensaje: 'ok'}
            );

        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los proyectos" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }

}
