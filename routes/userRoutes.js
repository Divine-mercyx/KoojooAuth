import {
    deleteAccount,
    getUserTrustScore,
    getUserValidationToJoinGroup,
    promoteToTreasurer
} from "../controller/userController.js";
import {authenticate} from "../middlewares/auth.js";

export default async function userRoutes(fastify, options) {
    fastify.put('/promote-to-treasurer', {
        preValidation: authenticate,
        handler: promoteToTreasurer
    });
    fastify.delete('/delete-account', {
        preValidation: authenticate,
        handler: deleteAccount
    })
    fastify.get('/get-trust-score', {
        preValidation: authenticate,
        handler: getUserTrustScore
    });
    fastify.get('/user-validity', {
        preValidation: authenticate,
        handler: getUserValidationToJoinGroup
    })
}
