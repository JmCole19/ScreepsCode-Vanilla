var roleDefender = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            this.attackHostiles(creep, hostiles);
        } else {
            this.patrolRoom(creep);
        }
    },

    attackHostiles: function(creep, hostiles) {
        var target = creep.pos.findClosestByRange(hostiles);
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    },

    patrolRoom: function(creep) {
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

module.exports = roleDefender;