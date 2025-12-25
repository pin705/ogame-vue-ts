import { defineMongooseModel } from '#nuxt/mongoose'
import { PositionSchema, PlanetEmbeddedSchema } from './schemas'

// Debris field schema
const DebrisFieldEmbeddedSchema = {
  id: { type: 'string', required: true },
  position: PositionSchema,
  resources: {
    metal: { type: 'number', default: 0 },
    crystal: { type: 'number', default: 0 }
  },
  createdAt: { type: 'number', default: Date.now },
  expiresAt: { type: 'number' }
}

export const UniverseSchema = defineMongooseModel({
  name: 'Universe',
  schema: {
    // Universe configuration
    galaxies: { type: 'number', default: 5 },
    systems: { type: 'number', default: 499 },
    positions: { type: 'number', default: 15 },
    
    // NPC planets stored here (not owned by players)
    // Key format: "galaxy:system:position"
    planets: {
      type: 'Map',
      of: PlanetEmbeddedSchema
    },
    
    // Debris fields
    // Key format: "galaxy:system:position"
    debrisFields: {
      type: 'Map',
      of: DebrisFieldEmbeddedSchema
    }
  },
  options: {
    timestamps: true
  }
})
