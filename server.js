import fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import { connectDB } from './user/config/db.js';
import cors from '@fastify/cors';
import {authenticate} from "./user/middlewares/auth.js";
import authRoutes from './user/routes/authRoutes.js';
import userRoutes from "./user/routes/userRoutes.js";
import stakeRoutes from "./userInvestments/routes/stakeRoutes.js";


dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;
const app = fastify();

app.register(cors);
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'secret123$%^&*()' });
app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(userRoutes, { prefix: '/api/v1/users' });
app.register(stakeRoutes, { prefix: 'api/v1/investments' })

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
