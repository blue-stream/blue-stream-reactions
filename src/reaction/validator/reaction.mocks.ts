import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';
import { ReactionType, ResourceType, IReaction } from '../reaction.interface';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validResource: string = '5bf54919902f5a46a0fb2e73';
    readonly validResourceType: ResourceType = ResourceType.Video;
    readonly validType: ReactionType = ReactionType.Like;
    readonly validUser: string = 'a@a';

    readonly reaction: IReaction = {
        resource: this.validResource,
        resourceType: this.validResourceType,
        type: this.validType,
        user: this.validUser,
    };

    readonly reactionFilter = this.reaction;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/reaction/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.reaction,
    });

    update = createRequest({
        method: 'PUT',
        url: '/api/reaction/',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: {
            resource: this.reaction.resource,
            user: this.reaction.user,
        },
        body: { type: this.reaction.type },
    });

    delete = createRequest({
        method: 'DELETE',
        url: '/api/reaction/',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: {
            resource: this.reaction.resource,
            user: this.reaction.user,
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: `/api/reaction/one?resource=${this.validResource}&resourceType=${this.validResourceType}&type=${this.validType}&user=${this.validUser}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/reaction/many?resource=${this.validResource}&resourceType=${this.validResourceType}&type=${this.validType}&user=${this.validUser}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/reaction/amount?resource=${this.validResource}&resourceType=${this.validResourceType}&type=${this.validType}&user=${this.validUser}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getAllTypesAmountsOfResource = createRequest({
        method: 'GET',
        url: `/api/reaction/${this.validResource}/amount`,
        headers: {
            authorization: this.authorizationHeader,
        },
        params: { resource: this.reaction.resource },
    });
}
