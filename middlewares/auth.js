export const authenticate = async (req, reply) => {
    try {
        await req.jwtVerify();
    } catch (err) {
        reply.code(401).send({ message: 'Unauthorized' });
    }
};
