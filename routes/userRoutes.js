import {register} from "../controller/userController.js";

export default async function userRoutes(fastify, options) {
    fastify.post('/register', register);
}
