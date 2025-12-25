import { defineMongooseModel } from '#nuxt/mongoose'

// Position sub-schema
const PositionSchema = {
  galaxy: { type: 'number', required: true },
  system: { type: 'number', required: true },
  position: { type: 'number', required: true }
}

// Resources sub-schema
const ResourcesSchema = {
  metal: { type: 'number', default: 0 },
  crystal: { type: 'number', default: 0 },
  deuterium: { type: 'number', default: 0 },
  darkMatter: { type: 'number', default: 0 },
  energy: { type: 'number', default: 0 }
}

// Ore deposits sub-schema
const OreDepositsSchema = {
  metal: { type: 'number', default: 0 },
  crystal: { type: 'number', default: 0 },
  deuterium: { type: 'number', default: 0 },
  initialMetal: { type: 'number', default: 0 },
  initialCrystal: { type: 'number', default: 0 },
  initialDeuterium: { type: 'number', default: 0 }
}

// Fleet sub-schema
const FleetSchema = {
  lightFighter: { type: 'number', default: 0 },
  heavyFighter: { type: 'number', default: 0 },
  cruiser: { type: 'number', default: 0 },
  battleship: { type: 'number', default: 0 },
  battlecruiser: { type: 'number', default: 0 },
  bomber: { type: 'number', default: 0 },
  destroyer: { type: 'number', default: 0 },
  smallCargo: { type: 'number', default: 0 },
  largeCargo: { type: 'number', default: 0 },
  colonyShip: { type: 'number', default: 0 },
  recycler: { type: 'number', default: 0 },
  espionageProbe: { type: 'number', default: 0 },
  solarSatellite: { type: 'number', default: 0 },
  darkMatterHarvester: { type: 'number', default: 0 },
  deathstar: { type: 'number', default: 0 }
}

// Defense sub-schema
const DefenseSchema = {
  rocketLauncher: { type: 'number', default: 0 },
  lightLaser: { type: 'number', default: 0 },
  heavyLaser: { type: 'number', default: 0 },
  gaussCannon: { type: 'number', default: 0 },
  ionCannon: { type: 'number', default: 0 },
  plasmaTurret: { type: 'number', default: 0 },
  smallShieldDome: { type: 'number', default: 0 },
  largeShieldDome: { type: 'number', default: 0 },
  antiBallisticMissile: { type: 'number', default: 0 },
  interplanetaryMissile: { type: 'number', default: 0 },
  planetaryShield: { type: 'number', default: 0 }
}

// Buildings sub-schema
const BuildingsSchema = {
  metalMine: { type: 'number', default: 0 },
  crystalMine: { type: 'number', default: 0 },
  deuteriumSynthesizer: { type: 'number', default: 0 },
  solarPlant: { type: 'number', default: 0 },
  fusionReactor: { type: 'number', default: 0 },
  roboticsFactory: { type: 'number', default: 0 },
  naniteFactory: { type: 'number', default: 0 },
  shipyard: { type: 'number', default: 0 },
  hangar: { type: 'number', default: 0 },
  researchLab: { type: 'number', default: 0 },
  metalStorage: { type: 'number', default: 0 },
  crystalStorage: { type: 'number', default: 0 },
  deuteriumTank: { type: 'number', default: 0 },
  darkMatterCollector: { type: 'number', default: 0 },
  darkMatterTank: { type: 'number', default: 0 },
  missileSilo: { type: 'number', default: 0 },
  terraformer: { type: 'number', default: 0 },
  lunarBase: { type: 'number', default: 0 },
  sensorPhalanx: { type: 'number', default: 0 },
  jumpGate: { type: 'number', default: 0 },
  planetDestroyerFactory: { type: 'number', default: 0 }
}

// Technologies sub-schema
const TechnologiesSchema = {
  energyTechnology: { type: 'number', default: 0 },
  laserTechnology: { type: 'number', default: 0 },
  ionTechnology: { type: 'number', default: 0 },
  hyperspaceTechnology: { type: 'number', default: 0 },
  plasmaTechnology: { type: 'number', default: 0 },
  computerTechnology: { type: 'number', default: 0 },
  espionageTechnology: { type: 'number', default: 0 },
  combustionDrive: { type: 'number', default: 0 },
  impulseDrive: { type: 'number', default: 0 },
  hyperspaceDrive: { type: 'number', default: 0 },
  weaponsTechnology: { type: 'number', default: 0 },
  shieldingTechnology: { type: 'number', default: 0 },
  armourTechnology: { type: 'number', default: 0 },
  astrophysics: { type: 'number', default: 0 },
  gravitonTechnology: { type: 'number', default: 0 },
  darkMatterTechnology: { type: 'number', default: 0 },
  terraformingTechnology: { type: 'number', default: 0 },
  planetDestructionTech: { type: 'number', default: 0 }
}

// Build queue item sub-schema
const BuildQueueItemSchema = {
  id: { type: 'string', required: true },
  type: { type: 'string', enum: ['building', 'technology', 'ship', 'defense', 'demolish'] },
  itemType: { type: 'string', required: true },
  targetLevel: { type: 'number' },
  quantity: { type: 'number' },
  startTime: { type: 'number', required: true },
  endTime: { type: 'number', required: true }
}

// Waiting queue item sub-schema
const WaitingQueueItemSchema = {
  id: { type: 'string', required: true },
  type: { type: 'string', enum: ['building', 'technology', 'ship', 'defense', 'demolish'] },
  itemType: { type: 'string', required: true },
  targetLevel: { type: 'number' },
  quantity: { type: 'number' },
  priority: { type: 'number', required: true },
  addedTime: { type: 'number', required: true },
  planetId: { type: 'string' }
}

// Temperature sub-schema
const TemperatureSchema = {
  min: { type: 'number', default: -40 },
  max: { type: 'number', default: 40 }
}

// Planet schema for embedding
export const PlanetEmbeddedSchema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true },
  ownerId: { type: 'string' },
  position: PositionSchema,
  resources: ResourcesSchema,
  buildings: BuildingsSchema,
  fleet: FleetSchema,
  defense: DefenseSchema,
  buildQueue: [BuildQueueItemSchema],
  waitingBuildQueue: [WaitingQueueItemSchema],
  lastUpdate: { type: 'number', default: Date.now },
  maxSpace: { type: 'number', default: 163 },
  maxFleetStorage: { type: 'number', default: 1000 },
  isMoon: { type: 'boolean', default: false },
  parentPlanetId: { type: 'string' },
  diameter: { type: 'number' },
  jumpGateLastUsed: { type: 'number' },
  oreDeposits: OreDepositsSchema,
  temperature: TemperatureSchema
}

// Export sub-schemas for reuse
export {
  PositionSchema,
  ResourcesSchema,
  FleetSchema,
  DefenseSchema,
  BuildingsSchema,
  TechnologiesSchema,
  BuildQueueItemSchema,
  WaitingQueueItemSchema
}
