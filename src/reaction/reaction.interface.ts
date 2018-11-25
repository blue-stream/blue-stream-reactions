export enum ReactionType {
    Like = 'LIKE',
    Dislike = 'DISLIKE',
}

export enum ResourceType {
    Comment = 'COMMENT',
    Video = 'VIDEO',
}

export interface IReaction {
    resource: string;
    resourceType: ResourceType;
    user: string;
    type: ReactionType;
}
