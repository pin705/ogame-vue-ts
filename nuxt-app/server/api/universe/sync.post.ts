import { UniverseSchema } from '../../models/universe.schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  
  const { updateType, data } = body
  
  let updateQuery: Record<string, any> = {}
  
  switch (updateType) {
    case 'addDebris':
      // Add or update debris field
      if (!data.position || !data.resources) {
        throw createError({ statusCode: 400, message: 'position and resources required' })
      }
      const debrisKey = `${data.position.galaxy}:${data.position.system}:${data.position.position}`
      updateQuery = {
        $set: {
          [`debrisFields.${debrisKey}`]: {
            id: data.id || `debris_${debrisKey}_${Date.now()}`,
            position: data.position,
            resources: data.resources,
            createdAt: data.createdAt || Date.now(),
            expiresAt: data.expiresAt
          }
        }
      }
      break
      
    case 'removeDebris':
      if (!data.position) {
        throw createError({ statusCode: 400, message: 'position required' })
      }
      const removeKey = `${data.position.galaxy}:${data.position.system}:${data.position.position}`
      updateQuery = {
        $unset: {
          [`debrisFields.${removeKey}`]: ''
        }
      }
      break
      
    case 'updateDebris':
      if (!data.position || !data.resources) {
        throw createError({ statusCode: 400, message: 'position and resources required' })
      }
      const updateKey = `${data.position.galaxy}:${data.position.system}:${data.position.position}`
      updateQuery = {
        $set: {
          [`debrisFields.${updateKey}.resources`]: data.resources
        }
      }
      break
      
    case 'addPlanet':
      // Add NPC planet to universe
      if (!data.position || !data.planet) {
        throw createError({ statusCode: 400, message: 'position and planet required' })
      }
      const planetKey = `${data.position.galaxy}:${data.position.system}:${data.position.position}`
      updateQuery = {
        $set: {
          [`planets.${planetKey}`]: data.planet
        }
      }
      break
      
    case 'removePlanet':
      if (!data.position) {
        throw createError({ statusCode: 400, message: 'position required' })
      }
      const removePlanetKey = `${data.position.galaxy}:${data.position.system}:${data.position.position}`
      updateQuery = {
        $unset: {
          [`planets.${removePlanetKey}`]: ''
        }
      }
      break
      
    default:
      throw createError({
        statusCode: 400,
        message: `Unknown updateType: ${updateType}`
      })
  }
  
  const universe = await UniverseSchema.findOneAndUpdate(
    {},
    updateQuery,
    { new: true, upsert: true }
  )
  
  return {
    success: true,
    data: universe
  }
})
