import {authenticate} from "../../user/middlewares/auth.js";
import {stakeTokens, unStakeTokens} from "../controllers/stakeController.js";

export default async function stakeRoutes(fastify, options) {
    fastify.post('/stake', {
        preValidation: authenticate,
        handler: stakeTokens
    });
    fastify.put('/unstake/:id', {
        preValidation: authenticate,
        handler: unStakeTokens
    })
}
