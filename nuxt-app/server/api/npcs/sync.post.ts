import { NPCSchema } from '../../models/npc.schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  
  const { npcs, action } = body
  
  if (action === 'upsert' && npcs) {
    // Bulk upsert NPCs
    const bulkOps = npcs.map((npc: any) => ({
      updateOne: {
        filter: { npcId: npc.id || npc.npcId },
        update: { $set: { ...npc, npcId: npc.id || npc.npcId } },
        upsert: true
      }
    }))
    
    await NPCSchema.bulkWrite(bulkOps)
    
    return { success: true, count: npcs.length }
  }
  
  if (action === 'update' && body.npcId) {
    // Update single NPC
    const updated = await NPCSchema.findOneAndUpdate(
      { npcId: body.npcId },
      { $set: body.data },
      { new: true }
    )
    
    return { success: true, data: updated }
  }
  
  throw createError({
    statusCode: 400,
    message: 'Invalid action or missing data'
  })
})
