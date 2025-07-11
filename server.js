import fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import { connectDB } from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import cors from '@fastify/cors';
import {authenticate} from "./middlewares/auth.js";


dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;
const app = fastify();

app.register(cors);
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'secret123$%^&*()' });
app.register(userRoutes, { prefix: '/api/v1/users' });

app.get('/secure', { preValidation: authenticate }, async (req, reply) => {
    reply.send({ user: req.user });
});

app.get('/validate', {
    preValidation: (req, reply, done) => {
        app.authenticate(req, reply).then(done).catch(done);
    }
}, async (req, reply) => {
    reply.send({ user: req.user });
});


const start = async () => {
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
