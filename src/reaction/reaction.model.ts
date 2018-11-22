
import * as mongoose from 'mongoose';
import { IReaction } from './reaction.interface';

const reactionSchema: mongoose.Schema = new mongoose.Schema(
    {
        property: { type: String, required: true },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const ReactionModel = mongoose.model<IReaction & mongoose.Document>('Reaction', reactionSchema);
