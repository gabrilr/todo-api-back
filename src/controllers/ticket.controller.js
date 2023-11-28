import projectModel from "../models/project.model.js";
import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

export const registerTicket = async (req, res) => {
    const { titulo, descripcion, id_responsable/*, fotos*/ } = req.body;

    // Validación de existencia de campos
    console.log(JSON.stringify(req.body));
    if ([titulo, descripcion, id_responsable].includes('')) {
        return res.status(400).json({ mensaje: "Faltaron algunos datos..." });
    }

    const id_proyecto = req.params.id;

    try {
        // Validamos que exista el usuario antes de crear el ticket.
        const project = await projectModel.findById(id_proyecto);
        const userFound = await User.findById(id_responsable);

        if (!userFound || !project) {
            return res.status(404).json({ mensaje: "Error al crear el ticket, usuario inválido o el proyecto no existe" });
        }

        try {
            const newTicket = new Ticket({
                id_proyecto,
                id_responsable,
                titulo,
                descripcion,
                fotos: [],
                comentarios: [],
            });

            const ticketSaved = await newTicket.save();

            res.json({
                titulo: ticketSaved.titulo,
                descripcion: ticketSaved.descripcion,
                id_responsable: ticketSaved.id_responsable,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error interno del servidor al crear el ticket" });
        }

    } catch (error) {
        console.log("Error al crear el ticket ", error);
        res.status(500).json({ mensaje: "Error al buscar al usuario" });
    }
};

export const allTickets = async (req, res) => {

    const _id = req.body.id;
    const project = await projectModel.findById(_id);

    if (!project) {
        return res.status(404).json({ mensaje: "Error al obtener los ticket del proyecto." });
    }

    try {
        const tickets = await Ticket.find(
            { id_proyecto: _id },
            {  _id: 1, id_responsable: 1, titulo: 1, descripcion: 1 }
        );

        // const myprojects = await Promise.all(projects.map(async (project) => {

        //     const totalTickets = await Ticket.countDocuments({ id_proyecto: project._id });
        //     const ticketsDone = await Ticket.countDocuments({ id_proyecto: project._id, estatus: 'done' });
        //     const ticketsCheck = await Ticket.find({ id_proyecto: project._id, estatus: 'check' });
            
        //     return {
        //         _id: project._id,
        //         titulo: project.titulo,
        //         clave: project.clave,
        //         totalTickets: totalTickets,
        //         ticketsDone: ticketsDone,
        //         ticketsCheck: ticketsCheck
        //     };
        // }));

        res.json(tickets);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error interno del servidor al crear el proyecto" });
    }
}