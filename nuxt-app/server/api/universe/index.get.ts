import { UniverseSchema } from '../../models/universe.schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  // Get or create universe
  let universe = await UniverseSchema.findOne({})
  
  if (!universe) {
    universe = await UniverseSchema.create({
      galaxies: 5,
      systems: 499,
      positions: 15,
      planets: new Map(),
      debrisFields: new Map()
    })
  }
  
  return {
    success: true,
    data: universe
  }
})
