const mongoose = require('mongoose');
const Bus = mongoose.model('Usuario');
const Vag = mongoose.model('Vaga');

module.exports ={
    async index(req, res){
        const Vagas = await Vag.paginate({},{page:1, limit:10});
        return res.json(Vagas);
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
        const user = await Vag.findByIdAndUpdate(req.params.id, req.body, {new:true});
        return res.json(user);
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

    async empresa(req,res){
        const {empresa} = req.query;

        const sens = await Vag.find({
            empresa:{
                $in:empresa,
            },
        });

        return res.json({sens});
    },
}