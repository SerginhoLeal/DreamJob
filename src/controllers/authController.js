const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../Config/authConfig.json');

const Grap = mongoose.model('Usuario');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    });
}

module.exports = {
    async login(req, res){
        const {name, password} = req.body;
        try{
            const user = await Grap.findOne({name}).select('+password');
        
        if(!user)
            return res.status(400).send({error:'fail'});
        
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error:'fail'});
        
        user.password = undefined;

        res.send({
            user,
            token:generateToken({id: user.id}),
        });
        }catch{
            return res.status(400).send({error:'fail'});
        }
    },

    async store(req, res){
        const {name,email,password,curriculo} = req.body;
    try{
        if(await Grap.findOne({name}))
            return res.status(400).send({error:'Nome_já_e_uso!'});

        if(await Grap.findOne({email}))
            return res.status(400).send({error:'Email_já_e_uso!'});

        const tente = Math.floor(Math.random() * 10000000) + 3

        const user = await Grap.create({name,email,password,curriculo,codigo:tente});

        res.send({
            user,
            token:generateToken({id: user.id}),
        });

        user.password = undefined;

        }catch(err){
            return res.status(400).send({error:'fail'});
        }
    },

    async updateuser(req, res){
        const { user } = req.headers;
        const { userUpdate } = req.params;

        const n = await Grap.findById(user);
        const m = await Grap.findById(userUpdate);

        const {
            name,
            email,
            password,
            curriculo,
        } = req.body;

        if(password === "")
            return res.status(400).send({error:'falha_senha_vazia'});

        /*
            oldPassword
            newPassword
        */

        const hash = await bcrypt.hash(password, 10);

        if(n.codigo === m.codigo){
            const user = await Grap.findByIdAndUpdate(req.params.userUpdate, {
                name,
                email,
                password:hash,
                curriculo,
                codigo:m.codigo
            }, {new:true});
            return res.json(user);
        }

        return res.json({error:'fail'});
    }
};