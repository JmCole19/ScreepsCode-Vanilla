var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.sourceId) {
            // Find all available sources in the room
            var sources = creep.room.find(FIND_SOURCES);
            console.log("HARVESTER SOURCES: " + sources)

            // Find all the harvesters already assigned to sources
            var assignedHarvesters = _.groupBy(Game.creeps, (creep) => creep.memory.sourceId);
            var numHarvestersPerSource = _.mapValues(assignedHarvesters, (creeps) => creeps.length);

            // Sort the sources by the number of harvesters assigned to each source in ascending order
            sources.sort((source1, source2) => (numHarvestersPerSource[source1.id] || 0) - (numHarvestersPerSource[source2.id] || 0));

            // Find the least assigned source and assign the harvester to it
            for (const source of sources) {
                if (!(source.id in numHarvestersPerSource)) {
                    creep.memory.sourceId = source.id;
                    break;
                }
            }

            // If all sources are already assigned, assign the harvester to the least assigned source
            if (!creep.memory.sourceId) {
                creep.memory.sourceId = sources[0].id;
            }
        }

        var source = Game.getObjectById(creep.memory.sourceId);
        if (creep.pos.isNearTo(source)) {
            creep.harvest(source);
        } else {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = roleHarvester;
