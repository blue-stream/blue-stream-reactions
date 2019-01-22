import { ReactionManager } from '../reaction/reaction.manager';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    getReactionsByResources(resources: string[]) {
        return ReactionManager.getAllTypesAmountsOfResource(resources);
    },
});
