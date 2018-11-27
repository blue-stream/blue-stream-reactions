import { UserError } from './applicationError';

export class ResourceInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Resource is invalid', 400);
    }
}

export class ReactionTypeInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'ReactionType is invalid', 400);
    }
}

export class ResourceTypeInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'ResourceType is invalid', 400);
    }
}

export class UserInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'User is invalid', 400);
    }
}

export class ReactionNotFoundError extends UserError {
    constructor(message?: string) {
        super(message || 'Reaction not found', 404);
    }
}
