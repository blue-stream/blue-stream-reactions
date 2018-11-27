
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IReaction } from './reaction.interface';
import { ReactionRepository } from './reaction.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';
const reaction: IReaction = {
    property: 'prop',
};
const reactionArr: IReaction[] = ['prop', 'prop', 'prop', 'b', 'c', 'd'].map(item => ({ property: item }));
const invalidReaction: any = {
    property: { invalid: true },
};
const reactionFilter: Partial<IReaction> = { property: 'prop' };
const reactionDataToUpdate: Partial<IReaction> = { property: 'updated' };
const unexistingReaction: Partial<IReaction> = { property: 'unexisting' };
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
                expect(createdReaction).to.have.property('property', 'prop');
                expect(createdReaction).to.have.property('createdAt');
                expect(createdReaction).to.have.property('updatedAt');
                expect(createdReaction).to.have.property('_id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When reaction is invalid', function () {
            it('Should throw validation error when incorrect property type', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.create(invalidReaction);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/cast.+failed/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('property');
                    expect(err.errors.property).to.have.property('name', 'CastError');
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
                expect(createdDocuments).to.have.lengthOf(6);
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
            expect(createdReaction).have.property('id');
        });

        context('When data is valid', function () {

            it('Should update an existsing reaction', async function () {
                const updatedDoc = await ReactionRepository.update(createdReaction.id!, reactionDataToUpdate);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdReaction.id);
                for (const prop in reactionDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, reactionDataToUpdate[prop as keyof IReaction]);
                }
            });

            it('Should not update an existing reaction when empty data provided', async function () {
                const updatedDoc = await ReactionRepository.update(createdReaction.id!, {});
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdReaction.id);

                for (const prop in reaction) {
                    expect(updatedDoc).to.have.property(prop, createdReaction[prop as keyof IReaction]);
                }
            });

            it('Should return null when updated doc does not exists', async function () {
                const updatedDoc = await ReactionRepository.update(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.update(createdReaction.id as string, { property: null } as any);
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

        let document: IReaction;

        beforeEach(async function () {
            document = await ReactionRepository.create(reaction);
        });

        context('When data is valid', function () {

            it('Should delete document by id', async function () {
                const deleted = await ReactionRepository.delete(document.id!);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('id', document.id);

                const doc = await ReactionRepository.getOne(document.id!);
                expect(doc).to.not.exist;
            });

            it('Should return null when document not exists', async function () {
                const deleted = await ReactionRepository.delete(new mongoose.Types.ObjectId().toHexString());
                expect(deleted).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in the correct format', async function () {
                let hasThrown = false;

                try {
                    await ReactionRepository.delete('invalid id');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'CastError');
                    expect(err).to.have.property('kind', 'ObjectId');
                    expect(err).to.have.property('path', '_id');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getOne()', function () {

        context('When data is valid', function () {
            let document: IReaction;

            beforeEach(async function () {
                document = await ReactionRepository.create(reaction);
            });

            it('Should return document by id', async function () {
                const doc = await ReactionRepository.getOne({ _id: document.id } as Partial<IReaction>);
                expect(doc).to.exist;
                for (const prop in reaction) {
                    expect(doc).to.have.property(prop, reaction[prop as keyof IReaction]);
                }
            });

            it('Should return document by property', async function () {
                const doc = await ReactionRepository.getOne(reactionFilter);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in reaction) {
                    expect(doc).to.have.property(prop, reaction[prop as keyof IReaction]);
                }
            });

            it('Should return null when document not exists', async function () {
                const doc = await ReactionRepository.getOne(unexistingReaction);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter not exists', async function () {
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
                const documents = await ReactionRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(reactionArr.length);
            });

            it('Should return only matching documents', async function () {
                const documents = await ReactionRepository.getMany(reactionFilter);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');

                const amountOfRequiredDocuments = reactionArr.filter((item: IReaction) => {
                    let match = true;
                    for (const prop in reactionFilter) {
                        match = match && item[prop as keyof IReaction] === reactionFilter[prop as keyof IReaction];
                    }

                    return match;
                }).length;

                expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await ReactionRepository.getMany(unexistingReaction);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
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

            it('Should return null when filter is not in correct format', async function () {
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
