const express = require('express');

const authMiddleware = require("./middleware/auth");

const AuthController = require('./controllers/authController');
const VagasController = require('./controllers/projectController');

const routes = express.Router();

routes.post('/PwbsOs9YtfLi85clN8Sz', AuthController.login);
routes.post('/NRBQlog6f2Pwnqe3adQJ', AuthController.store);

routes.use(authMiddleware);

routes.get('/C7Ypo2iYtfLi8RrH1TRR', VagasController.perfil);
routes.get('/kW24SJmbA6surYp5qWPJ', VagasController.empresa);

routes.get('/8dr7YKjlJ3aXKcnwGJrm', VagasController.index);
routes.post('/C7Ypo2iFU0OTT7RrH1TR', VagasController.store);
routes.put('/NRBQdQlog6f2Pwnqe3aJ/:id', VagasController.update);
routes.delete('/tuo5NSqTcZ7fXUKBMtGh/:id', VagasController.destroy);

module.exports = routes;