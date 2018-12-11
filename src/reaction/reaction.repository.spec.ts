
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IReaction, ResourceType, ReactionType } from './reaction.interface';
import { ReactionRepository } from './reaction.repository';

const reaction: IReaction = {
    resource: '5bf54919902f5a46a0fb2e73',
    resourceType: ResourceType.Video,
    type: ReactionType.Like,
    user: 'a@a',
};

const reaction2: IReaction = {
    resource: '5bf54919902f5a46a0fb2e73',
    resourceType: ResourceType.Video,
    type: ReactionType.Dislike,
    user: 'a@b',
};

const reaction3: IReaction = {
    resource: '5bf54919902f5a46f0fb2273',
    resourceType: ResourceType.Video,
    type: ReactionType.Like,
    user: 'a@c',
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
    type: ReactionType.Like,
    resourceType: ResourceType.Video,
};

const reactionDataToUpdate: Partial<IReaction> = { type: ReactionType.Dislike };
const unexistingReaction: Partial<IReaction> = {
    resource: '5bf54919902f5a46a0fb2e33',
};
const unknownProperty: Object = { unknownProperty: true };

describe('Reaction Repository', function () {
    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        context('When reaction is valid', function () {
            it('Should create reaction', async function () {
                const createdReaction = await ReactionRepository.create(reaction);

                expect(createdReaction).to.exist;
                expect(createdReaction).to.have.property('resource', reaction.resource);
                expect(createdReaction).to.have.property('resourceType', reaction.resourceType);
                expect(createdReaction).to.have.property('type', reaction.type);
                expect(createdReaction).to.have.property('user', reaction.user);
                expect(createdReaction).to.have.property('updatedAt');
            });
        });

        context('When reaction is invalid', function () {
            it('Should throw validation error when given incorrect user', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.create(invalidUserReaction);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/Reaction validation failed: user/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('user');
                    expect(err.errors.user).to.have.property('name', 'ValidatorError');

                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when given incorrect resourceType', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.create(invalidResourceTypeReaction);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/Reaction validation failed: resourceType/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('resourceType');
                    expect(err.errors.resourceType).to.have.property('name', 'ValidatorError');

                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when given incorrect type', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.create(invalidTypeReaction);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/Reaction validation failed: type/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('type');
                    expect(err.errors.type).to.have.property('name', 'ValidatorError');

                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when empty reaction passed', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.create({} as IReaction);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown);
                }
            });
        });
    });

    describe('#createMany()', function () {
        context('When data is valid', function () {
            it('Should create many documents', async function () {
                const createdDocuments = await ReactionRepository.createMany(reactionArr);

                expect(createdDocuments).to.exist;
                expect(createdDocuments).to.be.an('array');
                expect(createdDocuments).to.have.lengthOf(reactionArr.length);
            });

            it('Should not create documents when empty array passed', async function () {
                const docs = await ReactionRepository.createMany([]);

                expect(docs).to.exist;
                expect(docs).to.be.an('array');
                expect(docs).to.be.empty;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when 1 of the docs invalid', async function () {
                let hasThrown = false;
                const docs: IReaction[] = [
                    ...reactionArr,
                    {} as IReaction,
                ];

                try {
                    await ReactionRepository.createMany(docs);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#update()', function () {

        let createdReaction: IReaction;

        beforeEach(async function () {
            createdReaction = await ReactionRepository.create(reaction);
            expect(createdReaction).have.property('updatedAt');
        });

        context('When data is valid', function () {

            it('Should update an existsing reaction', async function () {
                const updatedDoc =
                    await ReactionRepository.update(createdReaction.resource, createdReaction.user, reactionDataToUpdate.type!);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('type', reactionDataToUpdate.type);
            });

            it('Should return null when updated doc does not exists', async function () {
                const updatedDoc = await ReactionRepository.update(new mongoose.Types.ObjectId().toHexString(), 'a@b', reactionDataToUpdate.type!);
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.update(createdReaction.resource, createdReaction.user, invalidReaction.type);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/Validation failed.+for path/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw error when when empty data provided', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.update(createdReaction.resource, createdReaction.user, undefined!);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#delete()', function () {

        let createdReaction: IReaction;

        beforeEach(async function () {
            createdReaction = await ReactionRepository.create(reaction);
        });

        context('When data is valid', function () {

            it('Should delete document by resource & user and return true', async function () {
                const deleted = await ReactionRepository.delete(createdReaction.resource, createdReaction.user);
                expect(deleted).to.exist;
                expect(deleted).to.be.true;

                const getDeleted = await ReactionRepository.getOne(reaction);
                expect(getDeleted).to.not.exist;
            });

            it('Should return false when document does not exist', async function () {
                const deleted = await ReactionRepository.delete(new mongoose.Types.ObjectId().toHexString(), 'a@v');
                expect(deleted).to.be.false;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when resource is not in the correct format', async function () {
                const deleted = await ReactionRepository.delete(invalidReaction.resource, 'a@a');
                expect(deleted).to.exist;
                expect(deleted).to.be.false;
            });
        });
    });

    describe('#deleteMany()', function () {

        let createdReaction: IReaction;
        let createdReaction2: IReaction;
        let createdReaction3: IReaction;

        beforeEach(async function () {
            createdReaction = await ReactionRepository.create(reaction);
            createdReaction2 = await ReactionRepository.create(reaction2);
            createdReaction3 = await ReactionRepository.create(reaction3);
        });

        context('When data is valid', function () {

            it('Should delete documents by resource and return true', async function () {
                const deleted = await ReactionRepository.deleteMany(createdReaction.resource);
                expect(deleted).to.exist;
                expect(deleted).to.be.true;

                const getDeleted = await ReactionRepository.getOne(reaction);
                const getDeleted2 = await ReactionRepository.getOne(reaction2);
                expect(getDeleted).to.not.exist;
                expect(getDeleted2).to.not.exist;
            });

            it('Should delete documents by resources and return true', async function () {
                const deleted = await ReactionRepository.deleteMany([createdReaction.resource, createdReaction2.resource, createdReaction3.resource]);
                expect(deleted).to.exist;
                expect(deleted).to.be.true;

                const getDeleted = await ReactionRepository.getOne(reaction);
                const getDeleted2 = await ReactionRepository.getOne(reaction2);
                const getDeleted3 = await ReactionRepository.getOne(reaction3);
                expect(getDeleted).to.not.exist;
                expect(getDeleted2).to.not.exist;
                expect(getDeleted3).to.not.exist;
            });

            it('Should return false when document does not exist', async function () {
                const res = await ReactionRepository.deleteMany(new mongoose.Types.ObjectId().toHexString());
                expect(res).to.be.true;

                const getReaction = await ReactionRepository.getOne(reaction);
                const getReaction2 = await ReactionRepository.getOne(reaction2);
                expect(getReaction).to.exist;
                expect(getReaction2).to.exist;
            });

            it('Should return false when documents does not exist', async function () {
                const res = await ReactionRepository.deleteMany([new mongoose.Types.ObjectId().toHexString(), new mongoose.Types.ObjectId().toHexString()]);
                expect(res).to.be.true;

                const getReaction = await ReactionRepository.getOne(reaction);
                const getReaction2 = await ReactionRepository.getOne(reaction2);
                const getReaction3 = await ReactionRepository.getOne(reaction3);
                expect(getReaction).to.exist;
                expect(getReaction2).to.exist;
                expect(getReaction3).to.exist;
            });
        });
    });

    describe('#getOne()', function () {

        context('When data is valid', function () {
            let createdReaction: IReaction;

            beforeEach(async function () {
                createdReaction = await ReactionRepository.create(reaction);
            });

            it('Should return document by id', async function () {
                const returnedReaction = await ReactionRepository.getOne({
                    resource: reaction.resource,
                    user: reaction.user,
                } as Partial<IReaction>);

                expect(returnedReaction).to.exist;

                for (const prop in reaction) {
                    expect(returnedReaction).to.have.property(prop, reaction[prop as keyof IReaction]);
                }
            });

            it('Should return document by reactionType', async function () {
                const createdReaction = await ReactionRepository.getOne({
                    type: reaction.type,
                } as Partial<IReaction>);

                expect(createdReaction).to.exist;

                for (const prop in reaction) {
                    expect(createdReaction).to.have.property(prop, reaction[prop as keyof IReaction]);
                }
            });

            it('Should return null when document does not exist', async function () {
                const returnedReaction = await ReactionRepository.getOne(unexistingReaction);
                expect(returnedReaction).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter does not exist', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.getOne({});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in the correct format', async function () {
                const doc = await ReactionRepository.getOne(unknownProperty);
                expect(doc).to.not.exist;
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ReactionRepository.createMany(reactionArr);
            });

            it('Should return all documents when filter is empty', async function () {
                const returnedReactions = await ReactionRepository.getMany({});
                expect(returnedReactions).to.exist;
                expect(returnedReactions).to.be.an('array');
                expect(returnedReactions).to.have.lengthOf(reactionArr.length);
            });

            it('Should return only matching documents', async function () {
                const returnedReactions = await ReactionRepository.getMany(reactionFilter);
                expect(returnedReactions).to.exist;
                expect(returnedReactions).to.be.an('array');

                const amountOfRequiredDocuments = reactionArr.filter((item: IReaction) => {
                    let match = true;
                    for (const prop in reactionFilter) {
                        match = match && item[prop as keyof IReaction] === reactionFilter[prop as keyof IReaction];
                    }

                    return match;
                }).length;

                expect(returnedReactions).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria does not match any document', async function () {
                const returnedReactions = await ReactionRepository.getMany(unexistingReaction);
                expect(returnedReactions).to.exist;
                expect(returnedReactions).to.be.an('array');
                expect(returnedReactions).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.getMany(0 as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return empty array when filter is not in correct format', async function () {
                const documents = await ReactionRepository.getMany(unknownProperty);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ReactionRepository.createMany(reactionArr);
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await ReactionRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(reactionArr.length);
            });

            it('Should return amount of filtered documents', async function () {
                const amount = await ReactionRepository.getAmount(reactionFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');

                const amountOfRequiredDocuments = reactionArr.filter((item: IReaction) => {
                    let match = true;
                    for (const prop in reactionFilter) {
                        match = match && item[prop as keyof IReaction] === reactionFilter[prop as keyof IReaction];
                    }

                    return match;
                }).length;

                expect(amount).to.equal(amountOfRequiredDocuments);
            });

            it('Should return 0 when no documents matching filter', async function () {
                const amount = await ReactionRepository.getAmount(unexistingReaction);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });

        context('When data is invalid', function () {
            it('Should return 0 when filter is not in the correct format', async function () {
                const amount = await ReactionRepository.getAmount(unknownProperty);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });
    });
});
