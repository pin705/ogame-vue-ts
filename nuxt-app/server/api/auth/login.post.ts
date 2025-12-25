import { UserSchema } from '../../models/user.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password } = body
  
  // Validation
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }
  
  // Find user with password
  const user = await UserSchema.findOne({ email }).select('+password')
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }
  
  // Verify password
  const isValid = await verifyPassword(user.password, password)
  
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }
  
  // Update last login
  user.lastLoginAt = new Date()
  await user.save()
  
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
