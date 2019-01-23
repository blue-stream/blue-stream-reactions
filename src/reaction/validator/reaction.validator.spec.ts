import { expect } from 'chai';
import { ReactionValidator } from './reaction.validator';
import { ValidRequestMocks, responseMock } from './reaction.mocks';
import { ResourceInvalidError } from '../../utils/errors/userErrors';

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
            it('Should throw an ResourceInvalidError When resource is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.resource = undefined;

                ReactionValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
                });
            });

            it('Should throw an ResourceInvalidError When resource is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.resource = null;

                ReactionValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
                });
            });
        });
    });

    describe('Update Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canUpdate(new ValidRequestMocks().update, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an ResourceInvalidError When resource is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().update;
                invalidRequestMock.query.resource = undefined;

                ReactionValidator.canUpdate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
                });
            });

            it('Should throw an ResourceInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().update;
                invalidRequestMock.query.resource = null;

                ReactionValidator.canUpdate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
                });
            });
        });
    });

    describe('canDelete Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canDelete(new ValidRequestMocks().delete, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an ResourceInvalidError When resource is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().delete;
                invalidRequestMock.query.resource = undefined;

                ReactionValidator.canDelete(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
                });
            });

            it('Should throw an ResourceInvalidError When resource is null', function () {
                const invalidRequestMock = new ValidRequestMocks().delete;
                invalidRequestMock.query.resource = undefined;

                ReactionValidator.canDelete(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(ResourceInvalidError);
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

    describe('canGetAllTypesAmountsOfResource Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ReactionValidator.canGetAllTypesAmountsOfResource(new ValidRequestMocks().getAllTypesAmountsOfResource, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });
});
