import { PlayerSchema } from '../../models/player.schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)
  
  // Find and update player data
  const player = await PlayerSchema.findOneAndUpdate(
    { userId: session.user.id },
    { $set: body },
    { new: true, upsert: false }
  )
  
  if (!player) {
    throw createError({
      statusCode: 404,
      message: 'Player data not found'
    })
  }
  
  return {
    success: true,
    data: player
  }
})
