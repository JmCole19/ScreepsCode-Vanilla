const bodyGenerator = {
    generateBody: function(role) {
        switch (role) {
            case 'harvester':
                return [WORK, WORK, MOVE];
            case 'builder':
                return [WORK, CARRY, MOVE];
            case 'upgrader':
                return [WORK, CARRY, MOVE];
            case 'defender':
                return [ATTACK, TOUGH, MOVE];
            case 'maintenance':
                return [WORK, CARRY, MOVE];
            case 'hauler':
                return [CARRY, CARRY, MOVE, MOVE];
            // Add other roles and their corresponding body parts here, if needed
            default:
                return [];
        }
    }
};

module.exports = bodyGenerator;