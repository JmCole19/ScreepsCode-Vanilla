var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMaintenance = require('role.maintenance');
var roleHauler = require('role.hauler');
var spawnManager = require('module.spawnManager');
var bodyGenerator = require('module.bodyGenerator')
const HUD = require('tools.hud');

module.exports.loop = function () {
    // Count the number of creeps for each role
    const roleCounts = _.countBy(Game.creeps, (creep) => creep.memory.role);

    console.log('Harvesters: ' + (roleCounts.harvester || 0));
    console.log('Haulers: ' + (roleCounts.hauler || 0));
    console.log('Builders: ' + (roleCounts.builder || 0));
    console.log('Upgraders: ' + (roleCounts.upgrader || 0));
    console.log('Defenders: ' + (roleCounts.defender || 0));
    console.log('Maintenance Crew: ' + (roleCounts.maintenance || 0));

    // Desired counts for different roles
    const desiredRoles = [
        { role: 'harvester', count: 4 },
        { role: 'defender', count: 4 },
        { role: 'maintenance', count: 3 },
        { role: 'hauler', count: 4 },
        { role: 'builder', count: 6 },
        { role: 'upgrader', count: 2 },
        // Add other roles with their desired counts here
    ];

    // Spawn creeps based on desired counts
    console.log("HERE " + roleCounts['builder'])
    console.log("HERE " + JSON.stringify(desiredRoles))
    for (const desiredRole of desiredRoles) {
        const { role, count } = desiredRole;
        if (roleCounts[role] < count || !roleCounts[role]) {
            const newName = `${role.charAt(0).toUpperCase()}${role.slice(1)}${Game.time}`;
            console.log(`Spawning new ${role}: ${newName}`);
            const body = module.exports.getBodyParts(role); // Function to get the desired body parts
            const spawnResult = spawnManager.spawnCreep(role, newName, body);
            console.log(`Spawn result for ${role}: ${spawnResult}`);
            if (spawnResult === OK) {
                break; // Spawned a creep, stop spawning more for this tick
            }
        }
    }

    // Run roles for each creep
    for (const name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role === 'defender') {
            roleDefender.run(creep);
        } else if (creep.memory.role === 'maintenance') {
            roleMaintenance.run(creep);
        } else if (creep.memory.role === 'hauler') {
            roleHauler.run(creep);
        }
        // Add other roles here, if needed
    }
    // Display all builders and upgraders in the console
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    console.log('All Builders: ', builders.map(creep => creep.name));
    console.log('All Upgraders: ', upgraders.map(creep => creep.name));

    HUD.drawHUD();
};

// Use the bodyGenerator to get the desired body parts for different roles
module.exports.getBodyParts = function (role) {
    return bodyGenerator.generateBody(role);
};