import { Schema } from 'mongoose'

// Position sub-schema
export const PositionSchema = new Schema({
  galaxy: { type: Number, required: true },
  system: { type: Number, required: true },
  position: { type: Number, required: true }
}, { _id: false })

// Resources sub-schema
export const ResourcesSchema = new Schema({
  metal: { type: Number, default: 0 },
  crystal: { type: Number, default: 0 },
  deuterium: { type: Number, default: 0 },
  darkMatter: { type: Number, default: 0 },
  energy: { type: Number, default: 0 }
}, { _id: false })

// Ore deposits sub-schema
export const OreDepositsSchema = new Schema({
  metal: { type: Number, default: 0 },
  crystal: { type: Number, default: 0 },
  deuterium: { type: Number, default: 0 },
  initialMetal: { type: Number, default: 0 },
  initialCrystal: { type: Number, default: 0 },
  initialDeuterium: { type: Number, default: 0 }
}, { _id: false })

// Fleet sub-schema
export const FleetSchema = new Schema({
  lightFighter: { type: Number, default: 0 },
  heavyFighter: { type: Number, default: 0 },
  cruiser: { type: Number, default: 0 },
  battleship: { type: Number, default: 0 },
  battlecruiser: { type: Number, default: 0 },
  bomber: { type: Number, default: 0 },
  destroyer: { type: Number, default: 0 },
  smallCargo: { type: Number, default: 0 },
  largeCargo: { type: Number, default: 0 },
  colonyShip: { type: Number, default: 0 },
  recycler: { type: Number, default: 0 },
  espionageProbe: { type: Number, default: 0 },
  solarSatellite: { type: Number, default: 0 },
  darkMatterHarvester: { type: Number, default: 0 },
  deathstar: { type: Number, default: 0 }
}, { _id: false })

// Defense sub-schema
export const DefenseSchema = new Schema({
  rocketLauncher: { type: Number, default: 0 },
  lightLaser: { type: Number, default: 0 },
  heavyLaser: { type: Number, default: 0 },
  gaussCannon: { type: Number, default: 0 },
  ionCannon: { type: Number, default: 0 },
  plasmaTurret: { type: Number, default: 0 },
  smallShieldDome: { type: Number, default: 0 },
  largeShieldDome: { type: Number, default: 0 },
  antiBallisticMissile: { type: Number, default: 0 },
  interplanetaryMissile: { type: Number, default: 0 },
  planetaryShield: { type: Number, default: 0 }
}, { _id: false })

// Buildings sub-schema
export const BuildingsSchema = new Schema({
  metalMine: { type: Number, default: 0 },
  crystalMine: { type: Number, default: 0 },
  deuteriumSynthesizer: { type: Number, default: 0 },
  solarPlant: { type: Number, default: 0 },
  fusionReactor: { type: Number, default: 0 },
  roboticsFactory: { type: Number, default: 0 },
  naniteFactory: { type: Number, default: 0 },
  shipyard: { type: Number, default: 0 },
  hangar: { type: Number, default: 0 },
  researchLab: { type: Number, default: 0 },
  metalStorage: { type: Number, default: 0 },
  crystalStorage: { type: Number, default: 0 },
  deuteriumTank: { type: Number, default: 0 },
  darkMatterCollector: { type: Number, default: 0 },
  darkMatterTank: { type: Number, default: 0 },
  missileSilo: { type: Number, default: 0 },
  terraformer: { type: Number, default: 0 },
  lunarBase: { type: Number, default: 0 },
  sensorPhalanx: { type: Number, default: 0 },
  jumpGate: { type: Number, default: 0 },
  planetDestroyerFactory: { type: Number, default: 0 }
}, { _id: false })

// Technologies sub-schema
export const TechnologiesSchema = new Schema({
  energyTechnology: { type: Number, default: 0 },
  laserTechnology: { type: Number, default: 0 },
  ionTechnology: { type: Number, default: 0 },
  hyperspaceTechnology: { type: Number, default: 0 },
  plasmaTechnology: { type: Number, default: 0 },
  computerTechnology: { type: Number, default: 0 },
  espionageTechnology: { type: Number, default: 0 },
  combustionDrive: { type: Number, default: 0 },
  impulseDrive: { type: Number, default: 0 },
  hyperspaceDrive: { type: Number, default: 0 },
  weaponsTechnology: { type: Number, default: 0 },
  shieldingTechnology: { type: Number, default: 0 },
  armourTechnology: { type: Number, default: 0 },
  astrophysics: { type: Number, default: 0 },
  gravitonTechnology: { type: Number, default: 0 },
  darkMatterTechnology: { type: Number, default: 0 },
  terraformingTechnology: { type: Number, default: 0 },
  planetDestructionTech: { type: Number, default: 0 }
}, { _id: false })

// Build queue item sub-schema
export const BuildQueueItemSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['building', 'technology', 'ship', 'defense', 'demolish'] },
  itemType: { type: String, required: true },
  targetLevel: { type: Number },
  quantity: { type: Number },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true }
}, { _id: false })

// Waiting queue item sub-schema
export const WaitingQueueItemSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['building', 'technology', 'ship', 'defense', 'demolish'] },
  itemType: { type: String, required: true },
  targetLevel: { type: Number },
  quantity: { type: Number },
  priority: { type: Number, required: true },
  addedTime: { type: Number, required: true },
  planetId: { type: String }
}, { _id: false })

// Temperature sub-schema
export const TemperatureSchema = new Schema({
  min: { type: Number, default: -40 },
  max: { type: Number, default: 40 }
}, { _id: false })

// Moon sub-schema
export const MoonSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, default: 0 },
  fields: { type: Number, default: 1 },
  maxFields: { type: Number, default: 1 },
  buildings: BuildingsSchema,
  fleet: FleetSchema,
  defense: DefenseSchema,
  buildQueue: [BuildQueueItemSchema]
}, { _id: false })

// Planet schema for embedding
export const PlanetEmbeddedSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  ownerId: { type: String },
  position: PositionSchema,
  resources: ResourcesSchema,
  buildings: BuildingsSchema,
  fleet: FleetSchema,
  defense: DefenseSchema,
  buildQueue: [BuildQueueItemSchema],
  waitingBuildQueue: [WaitingQueueItemSchema],
  fields: { type: Number, default: 163 },
  maxFields: { type: Number, default: 163 },
  temperature: TemperatureSchema,
  image: { type: String },
  lastUpdate: { type: Number },
  oreDeposits: OreDepositsSchema,
  isHomeworld: { type: Boolean, default: false },
  moon: MoonSchema
}, { _id: false })
