import {login, register} from "../controller/userController.js";

export default async function authRoutes(fastify, options) {
    fastify.post('/register', register);
    fastify.post('/login', login);
}
