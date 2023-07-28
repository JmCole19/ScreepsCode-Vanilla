const bodyGenerator = require('module.bodyGenerator');

const spawnManager = {
    spawnQueue: [],

    addToSpawnQueue: function (role, newName, body) {
        this.spawnQueue.push({ role, newName, body });
    },

    clearSpawnQueue: function () {
        this.spawnQueue = [];
    },

    processSpawnQueue: function () {
        if (this.spawnQueue.length > 0) {
            const nextSpawn = this.spawnQueue[0];
            const { role, newName, body } = nextSpawn;
            const spawnResult = this.spawnCreep(role, newName, body);

            if (spawnResult === OK) {
                this.spawnQueue.shift(); // Remove the first element (spawned creep) from the queue
            }
        }
    },

    spawnCreep: function (role, newName, body) {
        if (Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } }) === OK) {
            console.log(`Spawned new ${role}: ${newName}`);
            return OK;
        } else {
            console.log(`Failed to spawn ${role}: ${newName}`);
            return ERR_BUSY; // Add more error checks here if needed
        }
    },

    getBodyParts: function (role) {
        return bodyGenerator.generateBody(role);
    },

    getSpawnQueue: function () {
        return this.spawnQueue;
    },
};

module.exports = spawnManager;
