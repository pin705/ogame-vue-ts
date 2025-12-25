import { defineMongooseModel } from '#nuxt/mongoose'
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
const OfficerSchema = {
  type: { type: 'string', required: true },
  active: { type: 'boolean', default: false },
  hiredAt: { type: 'number' },
  expiresAt: { type: 'number' }
}

// Fleet mission sub-schema
const FleetMissionSchema = {
  id: { type: 'string', required: true },
  playerId: { type: 'string', required: true },
  npcId: { type: 'string' },
  isHostile: { type: 'boolean' },
  originPlanetId: { type: 'string', required: true },
  targetPosition: PositionSchema,
  targetIsMoon: { type: 'boolean' },
  targetPlanetId: { type: 'string' },
  debrisFieldId: { type: 'string' },
  missionType: { type: 'string', required: true },
  fleet: FleetSchema,
  cargo: ResourcesSchema,
  departureTime: { type: 'number', required: true },
  arrivalTime: { type: 'number', required: true },
  returnTime: { type: 'number' },
  status: { type: 'string', enum: ['outbound', 'returning', 'arrived'] },
  isGift: { type: 'boolean' },
  giftTargetNpcId: { type: 'string' },
  expeditionZone: { type: 'string' }
}

// Missile attack sub-schema
const MissileAttackSchema = {
  id: { type: 'string', required: true },
  playerId: { type: 'string', required: true },
  originPlanetId: { type: 'string', required: true },
  targetPosition: PositionSchema,
  targetPlanetId: { type: 'string' },
  missileCount: { type: 'number', required: true },
  launchTime: { type: 'number', required: true },
  arrivalTime: { type: 'number', required: true },
  status: { type: 'string', enum: ['flying', 'arrived', 'intercepted'] }
}

// Battle report sub-schema
const BattleReportSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  attackerId: { type: 'string', required: true },
  defenderId: { type: 'string', required: true },
  attackerPlanetId: { type: 'string', required: true },
  defenderPlanetId: { type: 'string', required: true },
  attackerFleet: FleetSchema,
  defenderFleet: FleetSchema,
  defenderDefense: DefenseSchema,
  attackerLosses: FleetSchema,
  defenderLosses: {
    fleet: FleetSchema,
    defense: DefenseSchema
  },
  winner: { type: 'string', enum: ['attacker', 'defender', 'draw'] },
  read: { type: 'boolean', default: false },
  plunder: ResourcesSchema,
  debrisField: ResourcesSchema,
  rounds: { type: 'number' },
  attackerRemaining: FleetSchema,
  defenderRemaining: {
    fleet: FleetSchema,
    defense: DefenseSchema
  },
  moonChance: { type: 'number' }
}

// Spy report sub-schema
const SpyReportSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  spyId: { type: 'string', required: true },
  targetPlanetId: { type: 'string', required: true },
  targetPlanetName: { type: 'string' },
  targetPosition: PositionSchema,
  targetPlayerId: { type: 'string', required: true },
  resources: ResourcesSchema,
  fleet: FleetSchema,
  defense: DefenseSchema,
  buildings: BuildingsSchema,
  technologies: TechnologiesSchema,
  detectionChance: { type: 'number' },
  read: { type: 'boolean', default: false }
}

// Spied notification sub-schema
const SpiedNotificationSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  npcId: { type: 'string', required: true },
  npcName: { type: 'string', required: true },
  targetPlanetId: { type: 'string', required: true },
  targetPlanetName: { type: 'string', required: true },
  detectionSuccess: { type: 'boolean' },
  read: { type: 'boolean', default: false }
}

// NPC activity notification sub-schema
const NPCActivityNotificationSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  npcId: { type: 'string', required: true },
  npcName: { type: 'string', required: true },
  activityType: { type: 'string' },
  targetPosition: PositionSchema,
  targetPlanetId: { type: 'string' },
  targetPlanetName: { type: 'string' },
  arrivalTime: { type: 'number' },
  read: { type: 'boolean', default: false }
}

// Incoming fleet alert sub-schema
const IncomingFleetAlertSchema = {
  id: { type: 'string', required: true },
  npcId: { type: 'string', required: true },
  npcName: { type: 'string', required: true },
  missionType: { type: 'string', required: true },
  targetPlanetId: { type: 'string', required: true },
  targetPlanetName: { type: 'string', required: true },
  arrivalTime: { type: 'number', required: true },
  fleetSize: { type: 'number' },
  read: { type: 'boolean', default: false }
}

// Mission report sub-schema
const MissionReportSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  missionType: { type: 'string', required: true },
  originPlanetId: { type: 'string', required: true },
  originPlanetName: { type: 'string' },
  targetPosition: PositionSchema,
  targetPlanetId: { type: 'string' },
  targetPlanetName: { type: 'string' },
  success: { type: 'boolean' },
  message: { type: 'string' },
  details: { type: 'object' },
  read: { type: 'boolean', default: false }
}

// Gift notification sub-schema
const GiftNotificationSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  fromNpcId: { type: 'string', required: true },
  fromNpcName: { type: 'string', required: true },
  resources: ResourcesSchema,
  currentReputation: { type: 'number' },
  expectedReputationGain: { type: 'number' },
  expiresAt: { type: 'number' },
  read: { type: 'boolean', default: false }
}

// Gift rejected notification sub-schema
const GiftRejectedNotificationSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  npcId: { type: 'string', required: true },
  npcName: { type: 'string', required: true },
  rejectedResources: ResourcesSchema,
  currentReputation: { type: 'number' },
  reason: { type: 'string' },
  read: { type: 'boolean', default: false }
}

// Diplomatic report sub-schema
const DiplomaticReportSchema = {
  id: { type: 'string', required: true },
  timestamp: { type: 'number', required: true },
  npcId: { type: 'string', required: true },
  npcName: { type: 'string' },
  eventType: { type: 'string' },
  reputationChange: { type: 'number' },
  newReputation: { type: 'number' },
  oldStatus: { type: 'string' },
  newStatus: { type: 'string' },
  message: { type: 'string' },
  messageKey: { type: 'string' },
  messageParams: { type: 'object' },
  read: { type: 'boolean', default: false }
}

// Fleet preset sub-schema
const FleetPresetSchema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true },
  fleet: FleetSchema,
  targetPosition: PositionSchema,
  missionType: { type: 'string' },
  cargo: ResourcesSchema
}

// Achievement stats sub-schema
const AchievementStatsSchema = {
  totalMetalProduced: { type: 'number', default: 0 },
  totalCrystalProduced: { type: 'number', default: 0 },
  totalDeuteriumProduced: { type: 'number', default: 0 },
  totalDarkMatterProduced: { type: 'number', default: 0 },
  totalMetalConsumed: { type: 'number', default: 0 },
  totalCrystalConsumed: { type: 'number', default: 0 },
  totalDeuteriumConsumed: { type: 'number', default: 0 },
  totalDarkMatterConsumed: { type: 'number', default: 0 },
  buildingsUpgraded: { type: 'number', default: 0 },
  researchCompleted: { type: 'number', default: 0 },
  totalShipsProduced: { type: 'number', default: 0 },
  totalDefensesBuilt: { type: 'number', default: 0 },
  attacksLaunched: { type: 'number', default: 0 },
  attacksWon: { type: 'number', default: 0 },
  attacksLost: { type: 'number', default: 0 },
  defensesSuccessful: { type: 'number', default: 0 },
  defensesFailed: { type: 'number', default: 0 },
  totalFlightMissions: { type: 'number', default: 0 },
  transportMissions: { type: 'number', default: 0 },
  transportedResources: { type: 'number', default: 0 },
  colonizations: { type: 'number', default: 0 },
  spyMissions: { type: 'number', default: 0 },
  deployments: { type: 'number', default: 0 },
  expeditionsTotal: { type: 'number', default: 0 },
  expeditionsSuccessful: { type: 'number', default: 0 },
  recyclingMissions: { type: 'number', default: 0 },
  recycledResources: { type: 'number', default: 0 },
  planetDestructions: { type: 'number', default: 0 },
  fuelConsumed: { type: 'number', default: 0 },
  friendlyNPCCount: { type: 'number', default: 0 },
  hostileNPCCount: { type: 'number', default: 0 },
  giftsSent: { type: 'number', default: 0 },
  giftResourcesTotal: { type: 'number', default: 0 },
  attackedByNPC: { type: 'number', default: 0 },
  spiedByNPC: { type: 'number', default: 0 },
  debrisRecycledByNPC: { type: 'number', default: 0 },
  debrisResourcesLostToNPC: { type: 'number', default: 0 }
}

// Tutorial progress sub-schema
const TutorialProgressSchema = {
  tutorialCompleted: { type: 'boolean', default: false },
  completedStepIds: [{ type: 'string' }],
  currentStep: { type: 'string' },
  skippedAt: { type: 'number' }
}

// Quest progress sub-schema
const QuestProgressSchema = {
  questId: { type: 'string', required: true },
  status: { type: 'string', enum: ['locked', 'available', 'active', 'completed', 'failed'] },
  objectives: { type: 'object' },
  startedAt: { type: 'number' },
  completedAt: { type: 'number' },
  rewardsClaimed: { type: 'boolean' },
  dialoguesRead: [{ type: 'string' }]
}

// Campaign progress sub-schema
const CampaignProgressSchema = {
  campaignId: { type: 'string' },
  currentChapter: { type: 'number', default: 1 },
  currentQuestId: { type: 'string' },
  questProgress: { type: 'object' },
  completedQuests: [{ type: 'string' }],
  unlockedQuests: [{ type: 'string' }],
  branchChoices: { type: 'object' }
}

// Notification settings sub-schema
const NotificationSettingsSchema = {
  browser: { type: 'boolean', default: false },
  inApp: { type: 'boolean', default: true },
  suppressInFocus: { type: 'boolean', default: false },
  types: {
    construction: { type: 'boolean', default: true },
    research: { type: 'boolean', default: true },
    unlock: { type: 'boolean', default: true }
  }
}

export const PlayerSchema = defineMongooseModel({
  name: 'Player',
  schema: {
    // Reference to User
    userId: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    
    // Player data
    name: { type: 'string', required: true },
    planets: [PlanetEmbeddedSchema],
    technologies: TechnologiesSchema,
    officers: {
      commander: OfficerSchema,
      admiral: OfficerSchema,
      engineer: OfficerSchema,
      geologist: OfficerSchema,
      technocrat: OfficerSchema,
      darkMatterSpecialist: OfficerSchema
    },
    researchQueue: [BuildQueueItemSchema],
    waitingResearchQueue: [WaitingQueueItemSchema],
    fleetMissions: [FleetMissionSchema],
    missileAttacks: [MissileAttackSchema],
    battleReports: [BattleReportSchema],
    spyReports: [SpyReportSchema],
    spiedNotifications: [SpiedNotificationSchema],
    npcActivityNotifications: [NPCActivityNotificationSchema],
    missionReports: [MissionReportSchema],
    incomingFleetAlerts: [IncomingFleetAlertSchema],
    giftNotifications: [GiftNotificationSchema],
    giftRejectedNotifications: [GiftRejectedNotificationSchema],
    diplomaticReports: [DiplomaticReportSchema],
    points: { type: 'number', default: 0 },
    
    // Settings
    currentPlanetId: { type: 'string' },
    locale: { type: 'string', default: 'en' },
    isDark: { type: 'string', default: '' },
    isGMEnabled: { type: 'boolean', default: false },
    gameSpeed: { type: 'number', default: 1 },
    isPaused: { type: 'boolean', default: false },
    gameTime: { type: 'number', default: Date.now },
    
    // Tutorial & hints
    tutorialProgress: TutorialProgressSchema,
    privacyAgreed: { type: 'boolean', default: false },
    dismissedHints: [{ type: 'string' }],
    hintsEnabled: { type: 'boolean', default: true },
    backgroundEnabled: { type: 'boolean', default: false },
    
    // Fleet presets
    fleetPresets: [FleetPresetSchema],
    
    // Achievements
    achievementStats: AchievementStatsSchema,
    achievements: { type: 'object' },
    
    // Campaign
    campaignProgress: CampaignProgressSchema,
    questNotifications: [{ type: 'object' }],
    
    // Notifications
    notificationSettings: NotificationSettingsSchema,
    
    // Timestamps
    lastVersionCheckTime: { type: 'number' },
    lastManualUpdateCheck: { type: 'number' }
  },
  options: {
    timestamps: true
  }
})
