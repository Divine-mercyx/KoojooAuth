import fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import { connectDB } from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import cors from '@fastify/cors';


dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;
const app = fastify();

app.register(cors);
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'secret123$%^&*()' });
app.register(userRoutes, { prefix: '/api/v1/users' });
app.decorate('authenticate', async (request, reply) => {
    try { await request.jwtVerify();}
    catch (err) { reply.code(401).send({ message: 'Unauthorized' });}
});

const start = async () => {
    try {
        await app.listen({ port: PORT });
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
