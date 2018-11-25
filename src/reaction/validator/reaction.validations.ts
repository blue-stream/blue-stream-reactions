import { Types } from 'mongoose';
import { ResourceType, ReactionType } from '../reaction.interface';

export class ReactionValidatons {

    public static isUserValid(user: string) {
        const userRegex: RegExp = /\w+@\w+/i;

        return userRegex.test(user);
    }

    public static isReactionTypeValid(reactionType: string) {
        return (<any>Object).values(ReactionType).includes(reactionType);
    }

    public static isResourceTypeValid(resourceType: string) {
        return ((<any>Object).values(ResourceType).includes(resourceType));
    }

    public static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }
}
