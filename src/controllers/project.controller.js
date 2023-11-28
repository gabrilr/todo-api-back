import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import { generarCodigoAleatorio } from '../libs/rnd.js';
import moment from 'moment';
import { log } from "console";

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
            res.status(500).json({ mensaje: "Error, id usuario no valido." });
        }

    } else {
        res.status(400).json({ mensaje: "Los campos no pueden estar vacíos." });
    }
};

//db.prueba.find({ $or: [{author:/miguel/i}, {title: /miguel/i}] }); no borrar xd
export const allProjects = async (req, res) => {

    const id = req.body.id;
    //console.log('->'+id);
    try {
        const projects = await Project.find(
            {
              $or: [
                { id_responsable: id },
                { 'colaborador.colaborador': id },
              ],
            },
            { titulo: 1, clave: 1, descripcion: 1, _id: 1 }
        );
        //console.log(JSON.stringify(projects));
        const myprojects = await Promise.all(projects.map(async (project) => {

            const totalTickets = await Ticket.countDocuments({ id_proyecto: project._id });
            const ticketsDone = await Ticket.countDocuments({ id_proyecto: project._id, estatus: 'done' });
            const ticketsCheck = await Ticket.find({ id_proyecto: project._id, estatus: 'check' },{_id:1, titulo:1, descripcion:1 });
            
            return {
                _id: project._id,
                titulo: project.titulo,
                clave: project.clave,
                totalTickets: totalTickets,
                ticketsDone: ticketsDone,
                ticketsCheck: ticketsCheck
            };
        }));

        res.json(myprojects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }
}

export const allColabProject = async (req, res) => {

    const _id = req.body.id;

    try {
        const mycolabProjects = await Project.findById( _id, { colaborador: 1 }).populate({
            path: 'colaboradores.colaborador',
            select: '-contrasena -createdAt -updatedAt -__v'
        });// select excluye los campos de populate, pero se necesita un '-'.

        if (!mycolabProjects) {
            res.status(404).json({ mensaje: "Proyecto no encontrado" });
        }
        res.json(mycolabProjects.colaboradores);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }
}

export const addNewColabProject = async (req, res) => {

    const { id_proyecto, id } = req.body;

    const userFound = await User.findById(id);
    const project = await Project.findById(id_proyecto);
    if (userFound && project) {

        try {
            if (project.id_responsable == id) {
                return res.json({ mensaje: "El usuario responsable no puede ser al mismo tiempo colaborador" });
            }
            //console.log(JSON.stringify(project.colaboradores));
            const colabExistente = project.colaboradores.find(colab => 
                colab.colaborador.toString() == id // recorre el json y busca el id
            );
            
            if (colabExistente) {
                return res.status(400).json({ mensaje: "El colaborador ya está registrado en el proyecto" });
            }

            project.colaboradores.push({
                colaborador: id,
                //fecha_ingreso: new Date(), // no es necesario agregar fecha
            });
            const proyectoActualizado = await project.save();

            // const projAdd = await Project.findByIdAndUpdate(
            //     id_proyecto ,
            //     { $push: { colaboradores: id } },
            //     { new: true }
            // );
            res.json({
                    mensaje: 'Te has unido al proyecto, con exito',
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: "Error al añadir un nuevo colaborador" });
        }
    }
}
