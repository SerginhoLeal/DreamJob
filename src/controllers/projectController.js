const mongoose = require('mongoose');
const Bus = mongoose.model('Usuario');
const Vag = mongoose.model('Vaga');

const {findConnections, sendMessage} = require('../../Websocket')

module.exports ={
    async index(req, res){
        // const pages = req.query.page || 1;
        const {tipo} = req.query;

        const docs = await Vag.find({
            tipo:{
                $in:tipo,
            },
        }).sort( { data: -1 } )

        return res.json({docs});
    },

    async store(req, res){
        const { user } = req.headers;
        const n = await Bus.findById(user);
        const {
            empresa, 
            desenvolvedor, 
            beneficios, 
            wpps,
            mai,
            picture,
            latitude,
            longitude,
        } = req.body;
        
    try{
        if(await Vag.findOne({empresa}))//se encontrar um email o cadastro não será realizado
        return res.status(400).send({error:'Empresa já em uso!'});
        
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        const EmpresaSocket = "empresa"

        const user = await Vag.create({
            tipo:EmpresaSocket,
            codigo:n.codigo,
            empresa,
            desenvolvedor, 
            beneficios, 
            wpps,
            mai, 
            picture,
            location
        });

        const sendSocketMessageTo = findConnections(
            EmpresaSocket,
        );
        // console.log(sendSocketMessageTo);
        sendMessage(sendSocketMessageTo, 'new-project', user)
        
        return res.send(user);

        }catch(err){
            console.log(err)
            return res.status(400).send({error:'fail'});
        }
    },

    async update(req, res){
        const { user } = req.headers;
        const n = await Bus.findById(user);
        const {
            empresa, 
            desenvolvedor, 
            beneficios, 
            wpps,
            mai,
            picture,
            latitude,
            longitude,
        } = req.body;

        try{
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            const user = await Vag.findByIdAndUpdate(req.params.id, {
                codigo:n.codigo,
                empresa,
                desenvolvedor, 
                beneficios, 
                wpps,
                mai, 
                picture,
                location
            }, {new:true});
            return res.json(user);
        }catch(err){
            console.log(err)
            return res.status(400).send({error:'fail'});
        }
    },

    async destroy(req,res){
        const { user } = req.headers;
        const { id } = req.params;

        const n = await Bus.findById(user);
        const m = await Vag.findById(id);
        
        n.codigo === m.codigo 
            ?
        await Vag.findByIdAndRemove(req.params.id) && 
        res.send()
            :
        res.status(400).send({error:'fail'});

    },

    async perfil(req,res){
        const {codigo} = req.query;

        const sens = await Vag.find({
            codigo:{
                $in:codigo,
            },
        });

        return res.json({sens});
    },

    async negocios(req,res){
        const {empresa} = req.query;

        const sens = await Vag.find({
            empresa:{
                $in:empresa,
            },
        });

        return res.json({sens});
    },
}