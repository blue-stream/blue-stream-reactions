import { IReaction, ReactionType, ResourceType } from './reaction.interface';
import { ReactionRepository } from './reaction.repository';

export class ReactionManager implements ReactionRepository {
    static async create(reaction: IReaction) {
        const existingReaction: IReaction | null =
            await ReactionManager.getOne(reaction.user, reaction.resource);

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

    static getOne(resource: string, user: string) {
        return ReactionRepository.getOne(resource, user);
    }

    static getMany(
        reactionFilter: Partial<IReaction>,
        startIndex?: number,
        endIndex?: number,
        sortBy?: string,
        sortOrder?: '' | '-') {
        return ReactionRepository.getMany(reactionFilter, startIndex, endIndex, sortBy, sortOrder);
    }

    static getAllTypesAmountsOfResource(resources: string | string[]) {
        return ReactionRepository.getAllTypesAmounts(resources);
    }

    static getUserReactedResources(resources: string[], user: string) {
        return ReactionRepository.getUserReactedResources(resources, user);
    }

    static getReactionAmountByTypeAndResourceType(
        type: ReactionType,
        resourceType: ResourceType,
        startIndex?: number,
        endIndex?: number,
        sortBy?: string,
        sortOrder?: '' | '-',
        timeLimitInHours?: number) {
        return ReactionRepository.getReactionAmountByTypeAndResourceType(type, resourceType, startIndex, endIndex, sortBy, sortOrder, timeLimitInHours);
    }

    static getAmount(reactionFilter: Partial<IReaction>) {
        return ReactionRepository.getAmount(reactionFilter);
    }
}
