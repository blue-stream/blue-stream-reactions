import { Request, Response } from 'express';
import { ReactionManager } from './reaction.manager';

import { ReactionNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class ReactionController {
    static async create(req: Request, res: Response) {
        res.json(await ReactionManager.create(req.body.reaction));
    }

    static async createMany(req: Request, res: Response) {
        res.json(await ReactionManager.createMany(req.body.reactions));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await ReactionManager.updateById(req.params.id, req.body.reaction);
        if (!updated) {
            throw new ReactionNotFoundError();
        }

        res.json(updated);
    }

    static async updateMany(req: Request, res: Response) {

        const updated: UpdateResponse = await ReactionManager.updateMany(req.body.reactionFilter, req.body.reaction);

        if (updated.n === 0) {
            throw new ReactionNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await ReactionManager.deleteById(req.params.id);
        if (!deleted) {
            throw new ReactionNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const reaction = await ReactionManager.getById(req.params.id);
        if (!reaction) {
            throw new ReactionNotFoundError();
        }

        res.json(reaction);
    }

    static async getOne(req: Request, res: Response) {
        const reaction = await ReactionManager.getOne(req.query);
        if (!reaction) {
            throw new ReactionNotFoundError();
        }

        res.json(reaction);
    }

    static async getMany(req: Request, res: Response) {
        res.json(await ReactionManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ReactionManager.getAmount(req.query));
    }
}
