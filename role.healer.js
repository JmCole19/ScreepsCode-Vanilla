var roleHealer = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var allies = creep.room.find(FIND_MY_CREEPS, {
            filter: (ally) => ally.hits < ally.hitsMax,
        });
        if (allies.length > 0) {
            this.healAllies(creep, allies);
        } else {
            this.followDefenders(creep);
        }
    },

    healAllies: function (creep, allies) {
        var target = creep.pos.findClosestByRange(allies, {
            filter: (ally) => ally.hits < ally.hitsMax,
        });
        if (creep.heal(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    },

    followDefenders: function (creep) {
        // Assuming you have designated positions for defenders to patrol in the room
        var defenderPositions = [
            new RoomPosition(25, 25, creep.room.name),
            new RoomPosition(25, 10, creep.room.name),
            new RoomPosition(40, 40, creep.room.name),
            // Add more defender patrol positions as needed
        ];

        // Find the closest defender to follow
        var closestDefender = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (defender) => defender.memory.role === 'defender',
        });

        if (closestDefender) {
            // Move to the defender's position
            creep.moveTo(closestDefender.pos, { visualizePathStyle: { stroke: '#ffffff' } });
        } else {
            // If no defenders are present, patrol like a ranger
            this.patrolRoom(creep);
        }
    },

    patrolRoom: function (creep) {
        // Assuming you have designated positions for patrolling in the room
        var patrolPoints = [
            new RoomPosition(25, 25, creep.room.name),
            new RoomPosition(25, 10, creep.room.name),
            new RoomPosition(40, 40, creep.room.name),
            // Add more patrol positions as needed
        ];

        // Move to the next patrol position
        if (!creep.memory.patrolIndex || creep.memory.patrolIndex >= patrolPoints.length) {
            creep.memory.patrolIndex = 0;
        }
        var target = patrolPoints[creep.memory.patrolIndex];
        if (creep.pos.isEqualTo(target)) {
            creep.memory.patrolIndex++;
        } else {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

module.exports = roleHealer;
