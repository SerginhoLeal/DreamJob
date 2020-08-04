const mongoose = require('mongoose');
const Bus = mongoose.model('Usuario');
const Vag = mongoose.model('Vaga');

module.exports ={
    async index(req, res){
        // const pages = req.query.page || 1;
        const docs = await Vag.find();
        return res.json(docs);
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

        const user = await Vag.create({
            codigo:n.codigo,
            empresa,
            desenvolvedor, 
            beneficios, 
            wpps,
            mai, 
            picture,
            location
        });
        
        return res.send(user);

        }catch(err){
            return res.statusCode(400).send({error:'fail'});
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
        await Vag.findByIdAndRemove(req.params.id);
        return res.send();
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