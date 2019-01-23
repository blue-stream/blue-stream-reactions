import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { IReaction, ReactionType, ResourceType } from './reaction.interface';
import { Server } from '../server';

import {
    ReactionNotFoundError,
    UserInvalidError,
    ResourceTypeInvalidError,
    ReactionTypeInvalidError,
    ResourceInvalidError,
} from '../utils/errors/userErrors';

import { config } from '../config';
import { ReactionManager } from './reaction.manager';
import { sign } from 'jsonwebtoken';
import { ReactionRepository } from './reaction.repository';

describe('Reaction Router', function () {
    let server: Server;

    const authorizationHeader = `Bearer ${sign({ id: 'a@a' }, config.authentication.secret)}`;

    const existingResource: string = '5bf54919902f5a46a0fb2e73';
    const reaction: IReaction = {
        resource: existingResource,
        resourceType: ResourceType.Video,
        type: ReactionType.Like,
        user: 'a@a',
    };

    const reaction2: IReaction = {
        resource: existingResource,
        resourceType: ResourceType.Video,
        type: ReactionType.Dislike,
        user: 'a@b',
    };

    const reactionArr: IReaction[] = [reaction, reaction2];
    const invalidReaction: any = {
        resource: '12',
        resourceType: 'Da',
        type: 'Niet',
        user: 'ab',
    };

    const invalidResourceReaction: any = {
        resource: '2',
        resourceType: ResourceType.Video,
        type: ReactionType.Like,
        user: 'a@a',
    };

    const invalidResourceTypeReaction: any = {
        resource: '5bf54919902f5a46a0fb2e73',
        resourceType: 'not a real resource type',
        type: ReactionType.Like,
        user: 'a@a',
    };

    const invalidTypeReaction: any = {
        resource: '5bf54919902f5a46a0fb2e73',
        resourceType: ResourceType.Video,
        type: 'Not a real type',
        user: 'a@a',
    };

    const invalidUserReaction: any = {
        resource: '5bf54919902f5a46a0fb2e73',
        resourceType: ResourceType.Video,
        type: ReactionType.Like,
        user: 'a',
    };

    const reactionFilter: Partial<IReaction> = {
        resourceType: ResourceType.Video,
    };

    const reactionDataToUpdate: Partial<IReaction> = { type: ReactionType.Dislike };
    const unexistingReaction = {
        resource: '5bf54919902f5a46a0fb2e33',
        user: 'a@aaaab',
    };
    const unknownProperty: Object = { unknownProperty: true };

    before(async function () {

        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
    });

    describe('#POST /api/reaction/', function () {
        context('When request is valid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return created reaction', function (done: MochaDone) {
                request(server.app)
                    .post('/api/reaction/')
                    .send(reaction)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource', reaction.resource);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when resourceType is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/reaction/')
                    .send(invalidResourceTypeReaction)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ResourceTypeInvalidError.name);
                        expect(res.body).to.have.property('message', new ResourceTypeInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/reaction/', function () {
        let returnedReaction: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return updated reaction', function (done: MochaDone) {
                request(server.app)
                    .put('/api/reaction/')
                    .send({ type: reactionDataToUpdate.type })
                    .set({ authorization: authorizationHeader })
                    .query({ resource: reaction.resource, user: reaction.user })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', reactionDataToUpdate.type);

                        done();
                    });
            });

            it('Should return error status when reaction is not found', function (done: MochaDone) {
                request(server.app)
                    .put('/api/reaction/')
                    .send({ type: reactionDataToUpdate.type })
                    .set({ authorization: authorizationHeader })
                    .query({ resource: unexistingReaction.resource, user: reaction.user })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ReactionNotFoundError.name);
                        expect(res.body).to.have.property('message', new ReactionNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return error status when reaction type is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/reaction/')
                    .send({ type: invalidTypeReaction.type })
                    .set({ authorization: authorizationHeader })
                    .query({ resource: reaction.resource })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ReactionTypeInvalidError.name);
                        expect(res.body).to.have.property('message', new ReactionTypeInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#DELETE /api/reaction/', function () {
        let returnedReaction: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return true', function (done: MochaDone) {
                request(server.app)
                    .delete('/api/reaction/')
                    .set({ authorization: authorizationHeader })
                    .query({ resource: reaction.resource })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.true;

                        done();
                    });
            });

            it('Should return error status when resource not found', function (done: MochaDone) {
                request(server.app)
                    .delete('/api/reaction/')
                    .set({ authorization: authorizationHeader })
                    .query({ resource: unexistingReaction.resource })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ReactionNotFoundError.name);
                        expect(res.body).to.have.property('message', new ReactionNotFoundError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/reaction/one', function () {
        let returnedReactions: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionRepository.createMany(reactionArr);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get('/api/reaction/one')
                    .query(reaction2)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('resource', reactionArr[1].resource);

                        done();
                    });
            });

            it('Should return error when reaction not found', function (done: MochaDone) {
                request(server.app)
                    .get('/api/reaction/one')
                    .query({ resource: unexistingReaction.resource, user: unexistingReaction.user })
                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ReactionNotFoundError.name);
                        expect(res.body).to.have.property('message', new ReactionNotFoundError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/reaction/many', function () {
        let returnedReactions: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionRepository.createMany(reactionArr);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get('/api/reaction/many')
                    .query(reactionFilter)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('type', reactionArr[1].type);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/reaction/:resource/amounts', function () {
        let returnedReactions: any;
        const numberOfTypes: number = ((<any>Object).values(ResourceType)).length;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionRepository.createMany(reactionArr);
            });

            it('Should return amount of each reaction type', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/${reaction.resource}/amounts`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('Array');
                        expect(res.body).to.be.of.length(1);

                        ((<any>Object).values(ReactionType)).forEach((reactionType: string) => {
                            const amountOfType: number = reactionArr.reduce(
                                (amount, currReaction) => {
                                    if (currReaction.type.toString() === reactionType) {
                                        return amount + 1;
                                    }

                                    return amount;
                                },
                                0);

                            expect(res.body[0].types).to.have.property(reactionType, amountOfType);
                        });

                        done();
                    });
            });

            it('Should return empty array when resource not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/${unexistingReaction.resource}/amounts`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('Array');
                        expect(res.body).to.be.of.length(0);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/reaction/amount', function () {
        let returnedReactions: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionRepository.createMany(reactionArr);
            });

            it('Should return reaction', function (done: MochaDone) {
                const neededAmount = reactionArr.filter((currentReaction: IReaction) => {
                    let match = true;
                    for (const prop in reactionFilter) {
                        match = match && currentReaction[prop as keyof IReaction] === reactionFilter[prop as keyof IReaction];
                    }

                    return match;
                }).length;

                request(server.app)
                    .get('/api/reaction/amount')
                    .query(reactionFilter)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.equal(neededAmount);

                        done();
                    });
            });
        });
    });
});
