/*
import { expect } from 'chai';
import { Types } from 'mongoose';
import { ReactionValidator } from './reaction.validator';
import { ValidRequestMocks, responseMock } from './reaction.mocks';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';

describe('Reaction Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.reaction.property = undefined;

                ReactionValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.reaction.property = null;

                ReactionValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.reaction.property = '122223344214142';

                ReactionValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    describe('CreateMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canCreateMany(new ValidRequestMocks().createMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.reactions[1].property = undefined;

                ReactionValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.reactions[1].property = null;

                ReactionValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body.reactions[1].property = '21412412421412414214';

                ReactionValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    describe('UpdateById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canUpdateById(new ValidRequestMocks().updateById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.reaction.property = undefined;

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.reaction.property = null;

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.reaction.property = '2142142142141241';

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = undefined;

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = null;

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = '1244';

                ReactionValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });

        describe('canUpdateMany Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canUpdateMany(new ValidRequestMocks().updateMany, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });

            context('When invalid arguments are passed', function () {
                it('Should throw an PropertyInvalidError When property is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.reaction.property = undefined;

                    ReactionValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
                    });
                });

                it('Should throw an PropertyInvalidError When property is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.reaction.property = null;

                    ReactionValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
                    });
                });

                it('Should throw an PropertyInvalidError When property is too long', function () {
                    const invalidRequestMock = new ValidRequestMocks().updateMany;
                    invalidRequestMock.body.reaction.property = '21414141412414124';

                    ReactionValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(PropertyInvalidError);
                    });
                });
            });
        });

        describe('canDeleteById Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canDeleteById(new ValidRequestMocks().deleteById, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });

            context('When invalid arguments are passed', function () {
                it('Should throw an IdInvalidError When id is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = undefined;

                    ReactionValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = undefined;

                    ReactionValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                    const invalidRequestMock = new ValidRequestMocks().deleteById;
                    invalidRequestMock.params.id = '1243';

                    ReactionValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });
            });
        });

        describe('canGetById Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canGetById(new ValidRequestMocks().getById, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });

            context('When invalid arguments are passed', function () {
                it('Should throw an IdInvalidError When id is undefined', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = undefined;

                    ReactionValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is null', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = null;

                    ReactionValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });

                it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                    const invalidRequestMock = new ValidRequestMocks().getById;
                    invalidRequestMock.params.id = '1234';

                    ReactionValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                        expect(error).to.exist;
                        expect(error).to.be.an.instanceof(IdInvalidError);
                    });
                });
            });
        });

        describe('canGetOne Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canGetOne(new ValidRequestMocks().getOne, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });
        });

        describe('canGetMany Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });
        });

        describe('canGetAmount Validator', function () {
            context('When valid arguments are passed', function () {
                it('Should not throw an error', function () {
                    ReactionValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                        expect(error).to.not.exist;
                    });
                });
            });
        });
    });
});
*/