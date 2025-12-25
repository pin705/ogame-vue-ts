import { NPCSchema } from '../../models/npc.schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const npcs = await NPCSchema.find({})
  
  return {
    success: true,
    data: npcs
  }
})
