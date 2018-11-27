
import { IReaction, ReactionType } from './reaction.interface';
import { ReactionModel } from './reaction.model';
import { ServerError } from '../utils/errors/applicationError';
import { Document } from 'mongoose';

export class ReactionRepository {
    static create(reaction: IReaction)
        : Promise<IReaction> {
        return ReactionModel.create(reaction);
    }

    static createMany(reactions: IReaction[])
        : Promise<IReaction[]> {
        return ReactionModel.insertMany(reactions);
    }

    static update(resource: string, user: string, type: ReactionType) {
        return ReactionModel
            .findOneAndUpdate(
                { resource, user },
                { $set: { type } },
                { new: true, runValidators: true })
            .exec();
    }

    static delete(resource: string, user: string): Promise<IReaction & Document> {
        return ReactionModel.deleteOne({
            resource,
            user,
        }).exec();
    }

    static getOne(reactionFilter: Partial<IReaction>)
        : Promise<IReaction | null> {
        if (Object.keys(reactionFilter).length === 0) {
            throw new ServerError('Filter is required.');
        }
        return ReactionModel.findOne(
            reactionFilter,
        ).exec();
    }

    static getMany(reactionFilter: Partial<IReaction>)
        : Promise<IReaction[]> {
        return ReactionModel.find(
            reactionFilter,
        ).exec();
    }

    static getAmount(reactionFilter: Partial<IReaction>)
        : Promise<number> {
        return ReactionModel
            .countDocuments(reactionFilter)
            .exec();
    }
}
