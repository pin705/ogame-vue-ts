import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'
import {
  PositionSchema,
  ResourcesSchema,
  FleetSchema,
  TechnologiesSchema,
  PlanetEmbeddedSchema
} from './schemas'

// Diplomatic relation sub-schema
const DiplomaticRelationSchema = new Schema({
  fromId: { type: String, required: true },
  toId: { type: String, required: true },
  reputation: { type: Number, default: 0 },
  status: { type: String, enum: ['hostile', 'neutral', 'friendly'], default: 'neutral' },
  lastUpdated: { type: Number, default: Date.now },
  history: [{
    timestamp: { type: Number },
    change: { type: Number },
    reason: { type: String },
    details: { type: String }
  }]
}, { _id: false })

// Spy report for NPC
const NPCSpyReportSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  targetPlanetId: { type: String, required: true },
  targetPlanetName: { type: String },
  targetPosition: PositionSchema,
  targetPlayerId: { type: String, required: true },
  resources: ResourcesSchema,
  fleet: FleetSchema,
  defense: Schema.Types.Mixed,
  buildings: Schema.Types.Mixed,
  technologies: Schema.Types.Mixed
}, { _id: false })

// Attacked by tracking
const AttackedBySchema = new Schema({
  count: { type: Number, default: 0 },
  lastAttackTime: { type: Number },
  planetId: { type: String }
}, { _id: false })

// Fleet mission for NPC
const NPCFleetMissionSchema = new Schema({
  id: { type: String, required: true },
  playerId: { type: String, required: true },
  npcId: { type: String },
  isHostile: { type: Boolean },
  originPlanetId: { type: String, required: true },
  targetPosition: PositionSchema,
  targetIsMoon: { type: Boolean },
  targetPlanetId: { type: String },
  missionType: { type: String, required: true },
  fleet: FleetSchema,
  cargo: ResourcesSchema,
  departureTime: { type: Number, required: true },
  arrivalTime: { type: Number, required: true },
  returnTime: { type: Number },
  status: { type: String, enum: ['outbound', 'returning', 'arrived'] }
}, { _id: false })

export const NPCSchema = defineMongooseModel({
  name: 'NPC',
  schema: {
    npcId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    note: { type: String },
    planets: [PlanetEmbeddedSchema],
    technologies: TechnologiesSchema,
    
    // AI settings
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    aiType: { type: String, enum: ['aggressive', 'defensive', 'trader', 'expansionist', 'balanced'] },
    difficultyLevel: { type: Number, default: 1 },
    distanceToHomeworld: { type: Number },
    
    // Behavior tracking
    lastSpyTime: { type: Number },
    lastAttackTime: { type: Number },
    playerSpyReports: { type: Map, of: NPCSpyReportSchema },
    fleetMissions: [NPCFleetMissionSchema],
    
    // Attack tracking - use object instead of Map for simpler handling
    attackedBy: { type: Map, of: AttackedBySchema },
    alertUntil: { type: Number },
    
    // Diplomatic relations
    relations: [DiplomaticRelationSchema],
    allies: [{ type: String }],
    enemies: [{ type: String }]
  },
  options: {
    timestamps: true
  }
})
