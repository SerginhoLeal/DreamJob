const mongoose = require('mongoose');

const PointSchema = require('./PointSchema');

const mongoosePaginate = require('mongoose-paginate-v2')

const VagaSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true,
    },
    empresa:{
        type: String,
        required: true,
    },
    desenvolvedor:{
        type: String,
        required: true,
    },
    beneficios:{
        type: String,
        required: true,
    },
    wpps:{
        type: String,
        required: true,
    },
    mai:{
        type: String,
        required: true,
    },
    picture:{
        type: String,
        required: true,
    },
    location:{
        type: PointSchema,
        index:'2dsphere',
    },
    data:{
        type: Date,
        default:Date.now,
    },
});

VagaSchema.plugin(mongoosePaginate)

mongoose.model('Vaga', VagaSchema);