import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validProperty: string = '12345';
    readonly validProperty2: string = '23456';
    readonly validProperty3: string = '34567';

    readonly reaction = {
        property: this.validProperty,
    };

    readonly reaction2 = {
        property: this.validProperty2,
    };

    readonly reaction3 = {
        property: this.validProperty3,
    };

    readonly reactionFilter = this.reaction;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/reaction/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            reaction: this.reaction,
        },
    });

    createMany = createRequest({
        method: 'POST',
        url: '/api/reaction/many/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            reactions: [
                this.reaction,
                this.reaction2,
                this.reaction3,
            ],
        },
    });

    updateMany = createRequest({
        method: 'PUT',
        url: '/api/reaction/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: {
            reactionFilter: this.reactionFilter,
            reaction: this.reaction,
        },
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/reaction/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
        body: {
            reaction: this.reaction,
        },
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/reaction/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: `/api/reaction/one?reactionFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/reaction/many?reactionFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/reaction/amount?reactionFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.reaction,
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/reaction/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });
}
