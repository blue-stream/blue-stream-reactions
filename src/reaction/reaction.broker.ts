import * as rabbit from '../utils/rabbit';
import { ReactionManager } from './reaction.manager';

export class ReactionBroker {
    public static async subscribe() {
        rabbit.subscribe(
            'application',
            'topic',
            'reaction-action-queue',
            'commentService.comment.remove.succeeded',
            ReactionBroker.deleteMany,
        );
        rabbit.subscribe(
            'application',
            'topic',
            'reaction-action-queue',
            'videoService.video.remove.succeeded',
            ReactionBroker.deleteMany,
        );
    }

    private static async deleteMany(data: { id: string }) {
        if (data && data.id) {
            await ReactionManager.deleteMany(data.id);
        }
    }
}
