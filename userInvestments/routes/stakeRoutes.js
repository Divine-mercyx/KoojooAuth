import {authenticate} from "../../user/middlewares/auth.js";
import {stakeTokens} from "../controllers/stakeController.js";

export default async function stakeRoutes(fastify, options) {
    fastify.post('/stake', {
        preValidation: authenticate,
        handler: stakeTokens
    })
}
