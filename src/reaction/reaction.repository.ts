
import { IReaction, ReactionType, ResourceType } from './reaction.interface';
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

    static update(resource: string, user: string, type: ReactionType) {
        return ReactionModel
            .findOneAndUpdate(
                { resource, user },
                { $set: { type } },
                { new: true, runValidators: true })
            .exec();
    }

    static async delete(resource: string, user: string): Promise<boolean> {
        const response: { n: Number, ok: Number } = await ReactionModel.deleteOne({
            resource,
            user,
        }).exec();

        return Promise.resolve(response.n === 1 && response.ok === 1);
    }

    static async deleteMany(resource: string[] | string): Promise<boolean> {
        let response: { n: Number, ok: Number };

        if (resource instanceof Array) {
            response = await ReactionModel.deleteMany({
                resource: { $in: resource },
            }).exec();
        } else {
            response = await ReactionModel.deleteMany({
                resource,
            }).exec();
        }

        return Promise.resolve(response.ok === 1);
    }

    static getOne(resource: string, user: string)
        : Promise<IReaction | null> {
        if (!resource || !user) {
            throw new ServerError('Resource and User are required.');
        }
        return ReactionModel.findOne({
            resource,
            user,
        }).exec();
    }

    static getMany(reactionFilter: Partial<IReaction>)
        : Promise<IReaction[]> {
        return ReactionModel.find(
            reactionFilter,
        ).exec();
    }

    static getUserReactedResources(resources: string[], user: string) {
        return ReactionModel.find(
            {
                user,
                resource: {
                    $in: resources,
                },
            },
            {
                _id: 0,
                resource: 1,
                type: 1,
            },
        ).exec();
    }

    static getAllTypesAmounts(resources: string | string[]) {
        return ReactionModel
            .aggregate()
            .match({
                resource: {
                    $in: typeof resources === 'string' ? [resources] : resources,
                },
            })
            .group({
                _id: {
                    resource: '$resource',
                    type: '$type',
                },
                amount: {
                    $sum: 1,
                },
            })
            .project({
                resource: '$_id.resource',
                type: '$_id.type',
                amount: '$amount',
                _id: 0,
            })
            .group({
                _id: '$resource',
                types: {
                    $push: {
                        type: '$type',
                        amount: '$amount',
                    },
                },
            })
            .project({
                _id: 0,
                resource: '$_id',
                types: {
                    $arrayToObject: {
                        $map: {
                            input: '$types',
                            as: 'el',
                            in: {
                                k: '$$el.type',
                                v: '$$el.amount',
                            },
                        },
                    },
                },
            });
    }

    static getReactionAmountByTypeAndResourceType(
        type: ReactionType,
        resourceType: ResourceType,
        startIndex: number = 0,
        endIndex: number = 20,
        sortBy: string = 'amount',
        sortOrder: '' | '-' = '-',
        ) {
        return ReactionModel
            .aggregate()
            .match({
                resourceType,
                type,
            })
            .group({
                _id: {
                    resource: '$resource',
                    type: '$type',
                },
                amount: {
                    $sum: 1,
                },
            })
            .project({
                resource: '$_id.resource',
                type: '$_id.type',
                amount: '$amount',
                _id: 0,
            })
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(+endIndex - +startIndex);
    }

    static getAmount(reactionFilter: Partial<IReaction>)
        : Promise<number> {
        return ReactionModel
            .countDocuments(reactionFilter)
            .exec();
    }
}
