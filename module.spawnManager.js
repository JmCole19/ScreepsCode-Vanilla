const bodyGenerator = require('module.bodyGenerator');

const spawnManager = {
    spawnCreep: function(role, newName, body) {
        if (Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } }) === OK) {
            console.log(`Spawned new ${role}: ${newName}`);
            return OK;
        } else {
            console.log(`Failed to spawn ${role}: ${newName}`);
            return ERR_BUSY; // Add more error checks here if needed
        }
    }
};

module.exports = spawnManager;

