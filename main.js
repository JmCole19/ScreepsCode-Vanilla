const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleDefender = require('role.defender');
const roleMaintenance = require('role.maintenance');
const roleHauler = require('role.hauler');
const roleRanger = require('role.ranger'); // Add the ranger role script here
const roleHealer = require('role.healer'); // Add the healer role script here
const spawnManager = require('module.spawnManager');
const bodyGenerator = require('module.bodyGenerator');
const HUD = require('tools.hud');

let desiredHarvestersHaulers = {
    harvester: 4,
    hauler: 4,
};

let desiredWorkers = {
    builder: 6,
    upgrader: 2,
    maintenance: 4,
    // Add other roles with their desired counts here
};

let desiredMilitary = {
    defender: 4,
    healer: 2,
    ranger: 1,
    // Add desired military roles for future expansion
};

// Mapping of role names to their respective script objects
const roleScripts = {
    harvester: roleHarvester,
    upgrader: roleUpgrader,
    builder: roleBuilder,
    defender: roleDefender,
    maintenance: roleMaintenance,
    hauler: roleHauler,
    ranger: roleRanger,
    healer: roleHealer,
    // Add other roles and their respective script objects here
};

// Energy thresholds and desired counts for different resource levels
const energyThresholds = [
    {
        threshold: 0.8, // 80% of energy capacity
        counts: {
            harvester: 6,
            hauler: 6,
            builder: 8,
            maintenance: 6,
            defender: 6,
            healer: 2,
            ranger: 2,
        },
    },
    {
        threshold: 0.6, // 60% of energy capacity
        counts: {
            harvester: 5,
            hauler: 5,
            builder: 7,
            maintenance: 5,
            defender: 5,
            healer: 2,
            ranger: 1,
        },
    },
    {
        threshold: 0.4, // 40% of energy capacity
        counts: {
            harvester: 4,
            hauler: 4,
            builder: 6,
            maintenance: 4,
            defender: 4,
            healer: 1,
            ranger: 1,
        },
    },
    {
        threshold: 0.2, // 20% of energy capacity
        counts: {
            harvester: 3,
            hauler: 3,
            builder: 5,
            maintenance: 3,
            defender: 3,
            healer: 1,
            ranger: 1,
        },
    },
    {
        threshold: 0, // 0% of energy capacity (fallback case)
        counts: {
            harvester: 2,
            hauler: 2,
            builder: 4,
            maintenance: 2,
            defender: 2,
            healer: 1,
            ranger: 1,
        },
    },
];

module.exports.loop = function () {
    // Check if there are currently any living harvesters and haulers
    let haulersCount = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler').length;
    let harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length;

    // If there are no haulers or harvesters, clear the spawn queue and add them
    if (haulersCount < desiredHarvestersHaulers.hauler || harvestersCount < desiredHarvestersHaulers.harvester) {
        spawnManager.clearSpawnQueue();

        while (haulersCount < desiredHarvestersHaulers.hauler) {
            let haulerName = `Hauler${Game.time}`;
            spawnManager.addToSpawnQueue('hauler', haulerName, module.exports.getBodyParts('hauler'));
            haulersCount++;
        }

        while (harvestersCount < desiredHarvestersHaulers.harvester) {
            let harvesterName = `Harvester${Game.time}`;
            spawnManager.addToSpawnQueue('harvester', harvesterName, module.exports.getBodyParts('harvester'));
            harvestersCount++;
        }
    }

    // Calculate available resources
    const room = Game.spawns['Spawn1'].room;
    const energyAvailable = room.energyAvailable;
    const energyCapacity = room.energyCapacityAvailable;

    // Adjust desired creep counts based on available resources
    let desiredCounts;
    for (const { threshold, counts } of energyThresholds) {
        if (energyAvailable >= energyCapacity * threshold) {
            desiredCounts = counts;
            break;
        }
    }

    if (desiredCounts) {
        Object.assign(desiredHarvestersHaulers, {
            harvester: desiredCounts.harvester,
            hauler: desiredCounts.hauler,
        });
        Object.assign(desiredWorkers, {
            builder: desiredCounts.builder,
            maintenance: desiredCounts.maintenance,
        });
        Object.assign(desiredMilitary, {
            defender: desiredCounts.defender,
            healer: desiredCounts.healer,
            ranger: desiredCounts.ranger,
        });
    } else {
        console.log('Warning: No desired counts found for current energy level.');
    }

    // Process the spawn queue and spawn creeps in order
    spawnManager.processSpawnQueue();

    // Count the number of creeps for each role
    const roleCounts = _.countBy(Game.creeps, (creep) => creep.memory.role);

    console.log('Harvesters: ' + (roleCounts.harvester || 0));
    console.log('Haulers: ' + (roleCounts.hauler || 0));
    console.log('Builders: ' + (roleCounts.builder || 0));
    console.log('Upgraders: ' + (roleCounts.upgrader || 0));
    console.log('Defenders: ' + (roleCounts.defender || 0));
    console.log('Maintenance Crew: ' + (roleCounts.maintenance || 0));

    // Spawn harvesters/haulers first
    for (const role in desiredHarvestersHaulers) {
        const count = desiredHarvestersHaulers[role];
        if (roleCounts[role] < count || !roleCounts[role]) {
            const newName = `${role.charAt(0).toUpperCase()}${role.slice(1)}${Game.time}`;
            console.log(`Spawning new ${role}: ${newName}`);
            const body = module.exports.getBodyParts(role); // Function to get the desired body parts
            spawnManager.addToSpawnQueue(role, newName, body);
        }
    }

    // Spawn workers (builders, upgraders, maintenance) after harvesters/haulers are spawned
    for (const role in desiredWorkers) {
        const count = desiredWorkers[role];
        if (roleCounts[role] < count || !roleCounts[role]) {
            const newName = `${role.charAt(0).toUpperCase()}${role.slice(1)}${Game.time}`;
            console.log(`Spawning new ${role}: ${newName}`);
            const body = module.exports.getBodyParts(role); // Function to get the desired body parts
            spawnManager.addToSpawnQueue(role, newName, body);
        }
    }

    // Spawn desired military roles for future expansion, including defenders
    for (const role in desiredMilitary) {
        const count = desiredMilitary[role];
        if (roleCounts[role] < count || !roleCounts[role]) {
            const newName = `${role.charAt(0).toUpperCase()}${role.slice(1)}${Game.time}`;
            console.log(`Spawning new ${role}: ${newName}`);
            const body = module.exports.getBodyParts(role); // Function to get the desired body parts
            spawnManager.addToSpawnQueue(role, newName, body);
        }
    }

    // Run roles for each creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        const roleScript = roleScripts[role];
        if (roleScript) {
            roleScript.run(creep);
        } else {
            console.log(`No script found for role: ${role}`);
        }
    }

    HUD.drawHUD();
};

// Use the bodyGenerator to get the desired body parts for different roles
module.exports.getBodyParts = function (role) {
    return bodyGenerator.generateBody(role);
};
