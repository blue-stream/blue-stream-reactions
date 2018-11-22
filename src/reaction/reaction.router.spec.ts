import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { IReaction } from './reaction.interface';
import { Server } from '../server';
import { PropertyInvalidError, IdInvalidError, ReactionNotFoundError } from '../utils/errors/userErrors';
import { config } from '../config';
import { ReactionManager } from './reaction.manager';
import { sign } from 'jsonwebtoken';

describe('Reaction Module', function () {
    let server: Server;
    const validProppertyString: string = '12345';
    const reaction: IReaction = {
        property: validProppertyString,
    };
    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;
    const invalidId: string = '1';
    const invalidProppertyString: string = '123456789123456789';
    const invalidReaction: IReaction = {
        property: invalidProppertyString,
    };
    

    const reaction2: IReaction = {
        property: '45678',
    };
    const reaction3: IReaction = {
        property: '6789',
    };

    const unexistingReaction: IReaction = {
        property: 'a',
    };

    const reactions: IReaction[] =
        [reaction, reaction2, reaction3, reaction3];

    const invalidReactions: IReaction[] =
        [reaction, invalidReaction, reaction3];

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
                    .send({ reaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', validProppertyString);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/reaction/')
                    .send({ reaction: invalidReaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });
    
    describe('#POST /api/reaction/many/', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return created reaction', function (done: MochaDone) {
                request(server.app)
                    .post('/api/reaction/many/')
                    .send({ reactions })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', reactions[1].property);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/reaction/many/')
                    .send({ reactions: invalidReactions })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/reaction/many', function () {
        let returnedReactions: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionManager.createMany(reactions);
            });

            it('Should return updated reaction', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/many`)
                    .send({ reaction: reaction2, reactionFilter: reaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('ok', 1);
                        expect(res.body).to.have.property('nModified', 1);

                        done();
                    });
            });

            it('Should return 404 error status code', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/many`)
                    .send({ reaction, reactionFilter: unexistingReaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(404)
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

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReactions = await ReactionManager.createMany(reactions);
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/many`)
                    .send({ reaction: invalidReaction, reactionFilter: reaction2 })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/reaction/:id', function () {
        let returnedReaction: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return updated reaction', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/${returnedReaction.id}`)
                    .send({ reaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', reaction.property);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/${new mongoose.Types.ObjectId()}`)
                    .send({ reaction })
                    
                    .set({ authorization: authorizationHeader })
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

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/2`)
                    .send({ reaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/reaction/${returnedReaction.id}`)
                    .send({ reaction: invalidReaction })
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#DELETE /api/reaction/:id', function () {
        let returnedReaction: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return updated reaction', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/reaction/${returnedReaction.id}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', reaction.property);

                        done();
                    });
            });

            it('Should return error status when id not found', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/reaction/${new mongoose.Types.ObjectId()}`)
                    
                    .set({ authorization: authorizationHeader })
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

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/reaction/${invalidId}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

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
                returnedReactions = await ReactionManager.createMany(reactions);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/one?property=${reaction3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', reactions[2].property);

                        done();
                    });
            });

            it('Should return error when reaction not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/one?property=${unexistingReaction.property}`)
                    
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
                returnedReactions = await ReactionManager.createMany(reactions);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/many?property=${reaction3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', reactions[2].property);

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
                returnedReactions = await ReactionManager.createMany(reactions);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/amount?property=${reaction3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(2);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/reaction/:id', function () {
        let returnedReaction: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return reaction', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/${returnedReaction.id}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', reaction.property);

                        done();
                    });
            });

            it('Should return error when reaction not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/${new mongoose.Types.ObjectId()}`)
                    
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

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedReaction = await ReactionManager.create(reaction);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/reaction/${invalidId}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });
    });
