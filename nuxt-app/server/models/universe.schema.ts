import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'
import { PositionSchema, PlanetEmbeddedSchema, ResourcesSchema } from './schemas'

// Debris field schema
const DebrisFieldEmbeddedSchema = new Schema({
  id: { type: String, required: true },
  position: PositionSchema,
  resources: {
    metal: { type: Number, default: 0 },
    crystal: { type: Number, default: 0 }
  },
  createdAt: { type: Number, default: Date.now },
  expiresAt: { type: Number }
}, { _id: false })

export const UniverseSchema = defineMongooseModel({
  name: 'Universe',
  schema: {
    // Universe configuration
    galaxies: { type: Number, default: 5 },
    systems: { type: Number, default: 499 },
    positions: { type: Number, default: 15 },
    
    // NPC planets stored here (not owned by players)
    // Key format: "galaxy:system:position"
    planets: {
      type: Map,
      of: PlanetEmbeddedSchema
    },
    
    // Debris fields
    // Key format: "galaxy:system:position"
    debrisFields: {
      type: Map,
      of: DebrisFieldEmbeddedSchema
    }
  },
  options: {
    timestamps: true
  }
})
