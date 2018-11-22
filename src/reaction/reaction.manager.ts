import { IReaction } from './reaction.interface';

import { ReactionRepository } from './reaction.repository';

export class ReactionManager implements ReactionRepository {
    static create(reaction: IReaction) {
        return ReactionRepository.create(reaction);
    }

    static createMany(reactions: IReaction[]) {
        return ReactionRepository.createMany(reactions);
    }

    static updateById(id: string, reaction: Partial<IReaction>) {
        return ReactionRepository.updateById(id, reaction);
    }

    static updateMany(reactionFilter: Partial<IReaction>, reaction: Partial<IReaction>) {
        return ReactionRepository.updateMany(reactionFilter, reaction);
    }

    static deleteById(id: string) {
        return ReactionRepository.deleteById(id);
    }

    static getById(id: string) {
        return ReactionRepository.getById(id);
    }

    static getOne(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getOne(reactionFilter);
    }

    static getMany(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getMany(reactionFilter);
    }

    static getAmount(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getAmount(reactionFilter);
    }
}
