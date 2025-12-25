import { PlayerSchema } from '../../models/player.schema'

// Partial update for specific game state changes (resources, queues, etc.)
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)
  
  const { updateType, data } = body
  
  if (!updateType || !data) {
    throw createError({
      statusCode: 400,
      message: 'updateType and data are required'
    })
  }
  
  let updateQuery: Record<string, any> = {}
  
  switch (updateType) {
    case 'resources':
      // Update planet resources
      if (!data.planetId) {
        throw createError({ statusCode: 400, message: 'planetId required' })
      }
      updateQuery = {
        $set: {
          'planets.$[planet].resources': data.resources,
          'planets.$[planet].lastUpdate': Date.now()
        }
      }
      break
      
    case 'building':
      // Update building level
      if (!data.planetId || !data.buildingType || data.level === undefined) {
        throw createError({ statusCode: 400, message: 'planetId, buildingType, level required' })
      }
      updateQuery = {
        $set: {
          [`planets.$[planet].buildings.${data.buildingType}`]: data.level
        }
      }
      break
      
    case 'technology':
      // Update technology level
      if (!data.technologyType || data.level === undefined) {
        throw createError({ statusCode: 400, message: 'technologyType, level required' })
      }
      updateQuery = {
        $set: {
          [`technologies.${data.technologyType}`]: data.level
        }
      }
      break
      
    case 'fleet':
      // Update fleet on a planet
      if (!data.planetId) {
        throw createError({ statusCode: 400, message: 'planetId required' })
      }
      updateQuery = {
        $set: {
          'planets.$[planet].fleet': data.fleet
        }
      }
      break
      
    case 'defense':
      // Update defense on a planet
      if (!data.planetId) {
        throw createError({ statusCode: 400, message: 'planetId required' })
      }
      updateQuery = {
        $set: {
          'planets.$[planet].defense': data.defense
        }
      }
      break
      
    case 'buildQueue':
      // Update build queue
      if (!data.planetId) {
        throw createError({ statusCode: 400, message: 'planetId required' })
      }
      updateQuery = {
        $set: {
          'planets.$[planet].buildQueue': data.buildQueue
        }
      }
      break
      
    case 'researchQueue':
      // Update research queue
      updateQuery = {
        $set: {
          researchQueue: data.researchQueue
        }
      }
      break
      
    case 'fleetMission':
      // Add or update fleet mission
      if (data.action === 'add') {
        updateQuery = {
          $push: { fleetMissions: data.mission }
        }
      } else if (data.action === 'remove') {
        updateQuery = {
          $pull: { fleetMissions: { id: data.missionId } }
        }
      } else if (data.action === 'update') {
        updateQuery = {
          $set: {
            'fleetMissions.$[mission]': data.mission
          }
        }
      }
      break
      
    case 'points':
      updateQuery = {
        $set: { points: data.points }
      }
      break
      
    case 'gameTime':
      updateQuery = {
        $set: {
          gameTime: data.gameTime,
          isPaused: data.isPaused ?? false
        }
      }
      break
      
    default:
      throw createError({
        statusCode: 400,
        message: `Unknown updateType: ${updateType}`
      })
  }
  
  // Build array filters for planet updates
  const arrayFilters: any[] = []
  if (data.planetId) {
    arrayFilters.push({ 'planet.id': data.planetId })
  }
  if (updateType === 'fleetMission' && data.action === 'update') {
    arrayFilters.push({ 'mission.id': data.mission.id })
  }
  
  const player = await PlayerSchema.findOneAndUpdate(
    { userId: session.user.id },
    updateQuery,
    {
      new: true,
      arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined
    }
  )
  
  if (!player) {
    throw createError({
      statusCode: 404,
      message: 'Player data not found'
    })
  }
  
  return {
    success: true,
    updateType
  }
})
