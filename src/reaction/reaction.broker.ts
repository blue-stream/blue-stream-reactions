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

    private static async deleteMany(data: { id?: string, ids?: string[] }) {
        if (data) {
            if (data.id) {
                await ReactionManager.deleteMany(data.id);
            } else if (data.ids) {
                await ReactionManager.deleteManyByResources(data.ids);
            }
        }
    }
}
