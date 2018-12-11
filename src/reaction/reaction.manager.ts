import { IReaction, ReactionType, ResourceType } from './reaction.interface';
import { ReactionRepository } from './reaction.repository';

export class ReactionManager implements ReactionRepository {
    static async create(reaction: IReaction) {
        const existingReaction: IReaction | null =
            await ReactionManager.getOne({
                user: reaction.user,
                resource: reaction.resource,
            });

        if (existingReaction) {
            return Promise.resolve(existingReaction);
        }

        return ReactionRepository.create(reaction);
    }

    static update(resource: string, user: string, type: ReactionType) {
        return ReactionRepository.update(resource, user, type);
    }

    static delete(resource: string, user: string) {
        return ReactionRepository.delete(resource, user);
    }

    static deleteMany(resource: string[] | string) {
        return ReactionRepository.deleteMany(resource);
    }

    static getOne(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getOne(reactionFilter);
    }

    static getMany(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getMany(reactionFilter);
    }

    static getAllTypesAmountsOfResource(resource: string) {
        const reactionTypes: ReactionType[] = (<any>Object).values(ReactionType);

        return Promise.all(reactionTypes.map((type) => {
            return ReactionManager.getAmount({ resource, type }).then((amount) => {
                return ({ type, amount });
            });
        }));
    }

    static getAmount(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getAmount(reactionFilter);
    }
}
