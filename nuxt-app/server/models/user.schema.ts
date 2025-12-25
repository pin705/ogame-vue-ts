import { defineMongooseModel } from '#nuxt/mongoose'

export const UserSchema = defineMongooseModel({
  name: 'User',
  schema: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true
    },
    password: {
      type: 'string',
      required: true,
      select: false // Don't include password in queries by default
    },
    createdAt: {
      type: 'date',
      default: Date.now
    },
    updatedAt: {
      type: 'date',
      default: Date.now
    },
    lastLoginAt: {
      type: 'date'
    },
    isActive: {
      type: 'boolean',
      default: true
    }
  },
  options: {
    timestamps: true
  }
})
