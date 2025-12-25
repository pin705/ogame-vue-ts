import { UserSchema } from '../../models/user.schema'
import { PlayerSchema } from '../../models/player.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, username, password } = body
  
  // Validation
  if (!email || !username || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email, username and password are required'
    })
  }
  
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }
  
  if (username.length < 3 || username.length > 20) {
    throw createError({
      statusCode: 400,
      message: 'Username must be between 3 and 20 characters'
    })
  }
  
  // Check if user exists
  const existingUser = await UserSchema.findOne({
    $or: [{ email }, { username }]
  })
  
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: existingUser.email === email 
        ? 'Email already registered' 
        : 'Username already taken'
    })
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password)
  
  // Create user
  const user = await UserSchema.create({
    email,
    username,
    password: hashedPassword
  })
  
  // Create initial player data
  const initialPlanet = createInitialPlanet(user._id.toString(), username)
  
  await PlayerSchema.create({
    userId: user._id,
    name: username,
    planets: [initialPlanet],
    currentPlanetId: initialPlanet.id,
    technologies: createInitialTechnologies(),
    officers: createInitialOfficers(),
    achievementStats: createInitialAchievementStats()
  })
  
  // Set session
  await setUserSession(event, {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username
    }
  })
  
  return {
    success: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username
    }
  }
})

// Helper functions
function createInitialPlanet(userId: string, playerName: string) {
  const planetId = `planet_${userId}_${Date.now()}`
  const galaxy = Math.floor(Math.random() * 5) + 1
  const system = Math.floor(Math.random() * 499) + 1
  const position = Math.floor(Math.random() * 10) + 3 // 3-12 for better temperature
  
  // Calculate temperature based on position
  const baseTemp = 30 - (position - 1) * 5
  const tempVariation = Math.floor(Math.random() * 20) - 10
  
  return {
    id: planetId,
    name: `${playerName}'s Homeworld`,
    ownerId: userId,
    position: { galaxy, system, position },
    resources: {
      metal: 500,
      crystal: 500,
      deuterium: 0,
      darkMatter: 0,
      energy: 0
    },
    buildings: createInitialBuildings(),
    fleet: createInitialFleet(),
    defense: createInitialDefense(),
    buildQueue: [],
    waitingBuildQueue: [],
    lastUpdate: Date.now(),
    maxSpace: 163,
    maxFleetStorage: 1000,
    isMoon: false,
    oreDeposits: {
      metal: 1000000,
      crystal: 500000,
      deuterium: 250000,
      initialMetal: 1000000,
      initialCrystal: 500000,
      initialDeuterium: 250000
    },
    temperature: {
      min: baseTemp + tempVariation - 20,
      max: baseTemp + tempVariation + 20
    }
  }
}

function createInitialBuildings() {
  return {
    metalMine: 0,
    crystalMine: 0,
    deuteriumSynthesizer: 0,
    solarPlant: 0,
    fusionReactor: 0,
    roboticsFactory: 0,
    naniteFactory: 0,
    shipyard: 0,
    hangar: 0,
    researchLab: 0,
    metalStorage: 0,
    crystalStorage: 0,
    deuteriumTank: 0,
    darkMatterCollector: 0,
    darkMatterTank: 0,
    missileSilo: 0,
    terraformer: 0,
    lunarBase: 0,
    sensorPhalanx: 0,
    jumpGate: 0,
    planetDestroyerFactory: 0
  }
}

function createInitialFleet() {
  return {
    lightFighter: 0,
    heavyFighter: 0,
    cruiser: 0,
    battleship: 0,
    battlecruiser: 0,
    bomber: 0,
    destroyer: 0,
    smallCargo: 0,
    largeCargo: 0,
    colonyShip: 0,
    recycler: 0,
    espionageProbe: 0,
    solarSatellite: 0,
    darkMatterHarvester: 0,
    deathstar: 0
  }
}

function createInitialDefense() {
  return {
    rocketLauncher: 0,
    lightLaser: 0,
    heavyLaser: 0,
    gaussCannon: 0,
    ionCannon: 0,
    plasmaTurret: 0,
    smallShieldDome: 0,
    largeShieldDome: 0,
    antiBallisticMissile: 0,
    interplanetaryMissile: 0,
    planetaryShield: 0
  }
}

function createInitialTechnologies() {
  return {
    energyTechnology: 0,
    laserTechnology: 0,
    ionTechnology: 0,
    hyperspaceTechnology: 0,
    plasmaTechnology: 0,
    computerTechnology: 0,
    espionageTechnology: 0,
    combustionDrive: 0,
    impulseDrive: 0,
    hyperspaceDrive: 0,
    weaponsTechnology: 0,
    shieldingTechnology: 0,
    armourTechnology: 0,
    astrophysics: 0,
    gravitonTechnology: 0,
    darkMatterTechnology: 0,
    terraformingTechnology: 0,
    planetDestructionTech: 0
  }
}

function createInitialOfficers() {
  const officers = ['commander', 'admiral', 'engineer', 'geologist', 'technocrat', 'darkMatterSpecialist']
  const result: Record<string, any> = {}
  
  for (const officer of officers) {
    result[officer] = {
      type: officer,
      active: false
    }
  }
  
  return result
}

function createInitialAchievementStats() {
  return {
    totalMetalProduced: 0,
    totalCrystalProduced: 0,
    totalDeuteriumProduced: 0,
    totalDarkMatterProduced: 0,
    totalMetalConsumed: 0,
    totalCrystalConsumed: 0,
    totalDeuteriumConsumed: 0,
    totalDarkMatterConsumed: 0,
    buildingsUpgraded: 0,
    researchCompleted: 0,
    totalShipsProduced: 0,
    totalDefensesBuilt: 0,
    attacksLaunched: 0,
    attacksWon: 0,
    attacksLost: 0,
    defensesSuccessful: 0,
    defensesFailed: 0,
    totalFlightMissions: 0,
    transportMissions: 0,
    transportedResources: 0,
    colonizations: 0,
    spyMissions: 0,
    deployments: 0,
    expeditionsTotal: 0,
    expeditionsSuccessful: 0,
    recyclingMissions: 0,
    recycledResources: 0,
    planetDestructions: 0,
    fuelConsumed: 0,
    friendlyNPCCount: 0,
    hostileNPCCount: 0,
    giftsSent: 0,
    giftResourcesTotal: 0,
    attackedByNPC: 0,
    spiedByNPC: 0,
    debrisRecycledByNPC: 0,
    debrisResourcesLostToNPC: 0
  }
}
