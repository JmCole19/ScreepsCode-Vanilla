const HUD = {
  drawHUD: function () {
    const room = Game.spawns['Spawn1'].room; // Change 'Spawn1' to your actual spawn name
    const roomVisual = new RoomVisual(room.name);

    // Display Room Information
    roomVisual.text(`Room: ${room.name}`, 1, 0.5, { align: 'left', color: '#ffffff' });

    // Display Performance Information
    const cpuUsage = Game.cpu.getUsed().toFixed(2);
    roomVisual.text(`CPU Usage: ${cpuUsage}`, 1, 1.5, { align: 'left', color: '#ffffff' });

    // Display Creep Information
    const creepCounts = this.countCreepsByRole();
    let y = 3;
    for (const role in creepCounts) {
      roomVisual.text(`${role}: ${creepCounts[role]}`, 1, y, { align: 'left', color: '#ffffff' });
      y++;
    }

    // Display Structure Information
    const structureCounts = this.countStructures();
    y += 2;
    for (const type in structureCounts) {
      roomVisual.text(`${type}: ${structureCounts[type].count} (${structureCounts[type].available}/${structureCounts[type].capacity})`, 1, y, { align: 'left', color: '#ffffff' });
      y++;
    }

    // Display Resource Information
    const resources = this.countResources();
    for (const resource in resources) {
      roomVisual.text(`${resource}: ${resources[resource].available}/${resources[resource].capacity}`, 1, y, { align: 'left', color: '#ffffff' });
      y++;
    }
  },

  countCreepsByRole: function () {
    const creepCounts = {};
    for (const creepName in Game.creeps) {
      const creep = Game.creeps[creepName];
      if (!creepCounts[creep.memory.role]) {
        creepCounts[creep.memory.role] = 1;
      } else {
        creepCounts[creep.memory.role]++;
      }
    }
    return creepCounts;
  },

  countStructures: function () {
    const structureCounts = {};
    const room = Game.spawns['Spawn1'].room; // Change 'Spawn1' to your actual spawn name
    const structures = room.find(FIND_STRUCTURES);
    for (const structure of structures) {
      const type = structure.structureType;
      if (!structureCounts[type]) {
        structureCounts[type] = { count: 1, available: 0, capacity: 0 };
      } else {
        structureCounts[type].count++;
      }
      for (const resourceType in structure.store) {
        if (!structureCounts[type][resourceType]) {
          structureCounts[type][resourceType] = 0;
        }
        structureCounts[type][resourceType] += structure.store[resourceType];
        structureCounts[type].available += structure.store[resourceType];
        structureCounts[type].capacity += structure.store.getCapacity(resourceType);
      }
    }
    return structureCounts;
  },

  countResources: function () {
    const resources = {};
    const room = Game.spawns['Spawn1'].room; // Change 'Spawn1' to your actual spawn name
    const structures = room.find(FIND_STRUCTURES);
    for (const structure of structures) {
      for (const resourceType in structure.store) {
        if (!resources[resourceType]) {
          resources[resourceType] = { available: 0, capacity: 0 };
        }
        resources[resourceType].available += structure.store[resourceType];
        resources[resourceType].capacity += structure.store.getCapacity(resourceType);
      }
    }
    return resources;
  }
};

module.exports = HUD;
