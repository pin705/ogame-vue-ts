import { PlayerSchema } from '../../models/player.schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  
  const player = await PlayerSchema.findOne({ userId: session.user.id })
  
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
