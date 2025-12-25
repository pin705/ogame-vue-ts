import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'
import {
  PositionSchema,
  ResourcesSchema,
  FleetSchema,
  DefenseSchema,
  BuildingsSchema,
  TechnologiesSchema,
  BuildQueueItemSchema,
  WaitingQueueItemSchema,
  PlanetEmbeddedSchema
} from './schemas'

// Officer sub-schema
const OfficerSchema = new Schema({
  type: { type: String, required: true },
  active: { type: Boolean, default: false },
  hiredAt: { type: Number },
  expiresAt: { type: Number }
}, { _id: false })

// Fleet mission sub-schema
const FleetMissionSchema = new Schema({
  id: { type: String, required: true },
  playerId: { type: String, required: true },
  npcId: { type: String },
  isHostile: { type: Boolean },
  originPlanetId: { type: String, required: true },
  targetPosition: PositionSchema,
  targetIsMoon: { type: Boolean },
  targetPlanetId: { type: String },
  debrisFieldId: { type: String },
  missionType: { type: String, required: true },
  fleet: FleetSchema,
  cargo: ResourcesSchema,
  departureTime: { type: Number, required: true },
  arrivalTime: { type: Number, required: true },
  returnTime: { type: Number },
  status: { type: String, enum: ['outbound', 'returning', 'arrived'] },
  isGift: { type: Boolean },
  giftTargetNpcId: { type: String },
  expeditionZone: { type: String }
}, { _id: false })

// Missile attack sub-schema
const MissileAttackSchema = new Schema({
  id: { type: String, required: true },
  playerId: { type: String, required: true },
  originPlanetId: { type: String, required: true },
  targetPosition: PositionSchema,
  targetPlanetId: { type: String },
  missileCount: { type: Number, required: true },
  launchTime: { type: Number, required: true },
  arrivalTime: { type: Number, required: true },
  status: { type: String, enum: ['flying', 'arrived', 'intercepted'] }
}, { _id: false })

// Battle report sub-schema
const BattleReportSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  attackerId: { type: String, required: true },
  defenderId: { type: String, required: true },
  attackerPlanetId: { type: String, required: true },
  defenderPlanetId: { type: String, required: true },
  attackerFleet: FleetSchema,
  defenderFleet: FleetSchema,
  defenderDefense: DefenseSchema,
  attackerLosses: FleetSchema,
  defenderLosses: {
    fleet: FleetSchema,
    defense: DefenseSchema
  },
  winner: { type: String, enum: ['attacker', 'defender', 'draw'] },
  read: { type: Boolean, default: false },
  plunder: ResourcesSchema,
  debrisField: ResourcesSchema,
  rounds: { type: Number },
  attackerRemaining: FleetSchema,
  defenderRemaining: {
    fleet: FleetSchema,
    defense: DefenseSchema
  },
  moonChance: { type: Number }
}, { _id: false })

// Spy report sub-schema
const SpyReportSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  spyId: { type: String, required: true },
  targetPlanetId: { type: String, required: true },
  targetPlanetName: { type: String },
  targetPosition: PositionSchema,
  targetPlayerId: { type: String, required: true },
  resources: ResourcesSchema,
  fleet: FleetSchema,
  defense: DefenseSchema,
  buildings: BuildingsSchema,
  technologies: TechnologiesSchema,
  read: { type: Boolean, default: false },
  counterEspionageChance: { type: Number },
  spyLosses: { type: Number }
}, { _id: false })

// Trade report sub-schema
const TradeReportSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  senderId: { type: String, required: true },
  senderPlanetId: { type: String, required: true },
  receiverId: { type: String, required: true },
  receiverPlanetId: { type: String, required: true },
  resources: ResourcesSchema,
  read: { type: Boolean, default: false }
}, { _id: false })

// Achievement sub-schema
const AchievementSchema = new Schema({
  id: { type: String, required: true },
  unlockedAt: { type: Number, required: true }
}, { _id: false })

// Campaign progress sub-schema
const CampaignProgressSchema = new Schema({
  currentMissionIndex: { type: Number, default: 0 },
  completedMissions: [{ type: String }],
  missionProgress: Schema.Types.Mixed,
  rewards: {
    totalDarkMatter: { type: Number, default: 0 },
    totalResources: ResourcesSchema
  }
}, { _id: false })

// Settings sub-schema
const SettingsSchema = new Schema({
  showHints: { type: Boolean, default: true },
  seenHints: [{ type: String }],
  locale: { type: String, default: 'en' },
  theme: { type: String, default: 'dark' },
  autoSave: { type: Boolean, default: true },
  soundEnabled: { type: Boolean, default: true },
  notificationsEnabled: { type: Boolean, default: true }
}, { _id: false })

export const PlayerSchema = defineMongooseModel({
  name: 'Player',
  schema: {
    // Link to User
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    
    // Player identity
    playerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    
    // Planets
    planets: [PlanetEmbeddedSchema],
    currentPlanetId: { type: String },
    
    // Technologies
    technologies: TechnologiesSchema,
    researchQueue: [BuildQueueItemSchema],
    waitingResearchQueue: [WaitingQueueItemSchema],
    
    // Officers
    officers: [OfficerSchema],
    
    // Fleet missions
    fleetMissions: [FleetMissionSchema],
    missileAttacks: [MissileAttackSchema],
    
    // Reports
    battleReports: [BattleReportSchema],
    spyReports: [SpyReportSchema],
    tradeReports: [TradeReportSchema],
    
    // Achievements & Campaign
    achievements: [AchievementSchema],
    campaignProgress: CampaignProgressSchema,
    
    // Diplomacy
    allies: [{ type: String }],
    enemies: [{ type: String }],
    
    // Game state
    settings: SettingsSchema,
    gameSpeed: { type: Number, default: 1 },
    lastUpdate: { type: Number, default: Date.now },
    
    // Stats
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
  },
  options: {
    timestamps: true
  }
})
