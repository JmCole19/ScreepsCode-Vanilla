var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        var harvesters = _.filter(Game.creeps, (otherCreep) => otherCreep.memory.role == 'harvester');
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
        });

        // If the spawn needs energy and there are containers available
        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && containers.length > 0) {
            this.loadSpawner(creep, spawn, containers[0]);
        } else {
            this.haulResources(creep);
        }
    },

    haulResources: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType == RESOURCE_ENERGY
            });
            if (droppedEnergy) {
                if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });

            if (targets.length > 0) {
                var closestTarget = creep.pos.findClosestByPath(targets);
                if (creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    },

    loadSpawner: function(creep, spawn, container) {
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }
};

module.exports = roleHauler;
