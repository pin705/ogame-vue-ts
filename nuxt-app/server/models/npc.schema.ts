import { defineMongooseModel } from '#nuxt/mongoose'
import {
  PositionSchema,
  FleetSchema,
  TechnologiesSchema,
  PlanetEmbeddedSchema
} from './schemas'

// Diplomatic relation sub-schema
const DiplomaticRelationSchema = {
  fromId: { type: 'string', required: true },
  toId: { type: 'string', required: true },
  reputation: { type: 'number', default: 0 },
  status: { type: 'string', enum: ['hostile', 'neutral', 'friendly'], default: 'neutral' },
  lastUpdated: { type: 'number', default: Date.now },
  history: [{
    timestamp: { type: 'number' },
    change: { type: 'number' },
    reason: { type: 'string' },
    details: { type: 'string' }
  }]
}

// Spy report for NPC
const NPCSpyReportSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  targetPlanetId: { type: 'string', required: true },
  targetPlanetName: { type: 'string' },
  targetPosition: PositionSchema,
  targetPlayerId: { type: 'string', required: true },
  resources: {
    metal: { type: 'number', default: 0 },
    crystal: { type: 'number', default: 0 },
    deuterium: { type: 'number', default: 0 },
    darkMatter: { type: 'number', default: 0 },
    energy: { type: 'number', default: 0 }
  },
  fleet: FleetSchema,
  defense: { type: 'object' },
  buildings: { type: 'object' },
  technologies: { type: 'object' }
}

// Attacked by tracking
const AttackedBySchema = {
  count: { type: 'number', default: 0 },
  lastAttackTime: { type: 'number' },
  planetId: { type: 'string' }
}

// Fleet mission for NPC
const NPCFleetMissionSchema = {
  id: { type: 'string', required: true },
  playerId: { type: 'string', required: true },
  npcId: { type: 'string' },
  isHostile: { type: 'boolean' },
  originPlanetId: { type: 'string', required: true },
  targetPosition: PositionSchema,
  targetIsMoon: { type: 'boolean' },
  targetPlanetId: { type: 'string' },
  missionType: { type: 'string', required: true },
  fleet: FleetSchema,
  cargo: {
    metal: { type: 'number', default: 0 },
    crystal: { type: 'number', default: 0 },
    deuterium: { type: 'number', default: 0 },
    darkMatter: { type: 'number', default: 0 },
    energy: { type: 'number', default: 0 }
  },
  departureTime: { type: 'number', required: true },
  arrivalTime: { type: 'number', required: true },
  returnTime: { type: 'number' },
  status: { type: 'string', enum: ['outbound', 'returning', 'arrived'] }
}

export const NPCSchema = defineMongooseModel({
  name: 'NPC',
  schema: {
    npcId: { type: 'string', required: true, unique: true, index: true },
    name: { type: 'string', required: true },
    note: { type: 'string' },
    planets: [PlanetEmbeddedSchema],
    technologies: TechnologiesSchema,
    
    // AI settings
    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], default: 'medium' },
    aiType: { type: 'string', enum: ['aggressive', 'defensive', 'trader', 'expansionist', 'balanced'] },
    difficultyLevel: { type: 'number', default: 1 },
    distanceToHomeworld: { type: 'number' },
    
    // Behavior tracking
    lastSpyTime: { type: 'number' },
    lastAttackTime: { type: 'number' },
    playerSpyReports: { type: 'Map', of: NPCSpyReportSchema },
    fleetMissions: [NPCFleetMissionSchema],
    
    // Attack tracking
    attackedBy: { type: 'Map', of: AttackedBySchema },
    alertUntil: { type: 'number' },
    revengeTarget: { type: 'string' },
    
    // Diplomacy
    relations: { type: 'Map', of: DiplomaticRelationSchema },
    allies: [{ type: 'string' }],
    enemies: [{ type: 'string' }]
  },
  options: {
    timestamps: true
  }
})
