import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const UserSchema = defineMongooseModel({
  name: 'User',
  schema: {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lastLoginAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  options: {
    timestamps: true
  }
})
