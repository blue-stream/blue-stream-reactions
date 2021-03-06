
import * as mongoose from 'mongoose';
import { IReaction, ReactionType, ResourceType } from './reaction.interface';
import { ReactionValidatons } from './validator/reaction.validations';

const reactionSchema: mongoose.Schema = new mongoose.Schema(
    {
        resource: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
            validate: {
                validator: ReactionValidatons.isUserValid,
            },
        },
        type: {
            type: String,
            required: true,
            enum: (<any>Object).values(ReactionType),
        },
        resourceType: {
            type: String,
            required: true,
            enum: (<any>Object).values(ResourceType),
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        timestamps: {
            createdAt: false,
            updatedAt: true,
        },
        id: false,
    });

reactionSchema.index({ resource: 1, user: -1 });

export const ReactionModel = mongoose.model<IReaction & mongoose.Document>('Reaction', reactionSchema);
