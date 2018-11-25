
import { IReaction } from './reaction.interface';
import { ReactionModel } from './reaction.model';
import { ServerError } from '../utils/errors/applicationError';

export class ReactionRepository {
    static create(reaction: IReaction)
        : Promise<IReaction> {
        return ReactionModel.create(reaction);
    }

    static createMany(reactions: IReaction[])
        : Promise<IReaction[]> {
        return ReactionModel.insertMany(reactions);
    }

    static updateById(id: string, reaction: Partial<IReaction>)
        : Promise<IReaction | null> {
        return ReactionModel.findByIdAndUpdate(
            id,
            { $set: reaction },
            { new: true, runValidators: true },
        ).exec();
    }

    static deleteById(id: string)
        : Promise<IReaction | null> {
        return ReactionModel.findByIdAndRemove(
            id,
        ).exec();
    }

    static getById(id: string)
        : Promise<IReaction | null> {
        return ReactionModel.findById(
            id,
        ).exec();
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
