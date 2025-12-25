import { defineStore } from 'pinia'
import type { Planet, DebrisField } from '~/types/game'

interface UniverseState {
  planets: Record<string, Planet>
  debrisFields: Record<string, DebrisField>
  isLoading: boolean
  lastSyncTime: number
}

export const useUniverseStore = defineStore('universe', {
  state: (): UniverseState => ({
    planets: {},
    debrisFields: {},
    isLoading: false,
    lastSyncTime: 0
  }),
  
  actions: {
    // Load universe from server
    async loadUniverse() {
      this.isLoading = true
      
      try {
        const { data } = await $fetch('/api/universe')
        
        if (data) {
          // Convert Map-like objects to plain objects
          this.planets = data.planets || {}
          this.debrisFields = data.debrisFields || {}
        }
        
        this.lastSyncTime = Date.now()
      } catch (error) {
        console.error('Load universe error:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // Add or update debris field
    async addDebrisField(position: { galaxy: number; system: number; position: number }, resources: { metal: number; crystal: number }) {
      const key = `${position.galaxy}:${position.system}:${position.position}`
      const debris: DebrisField = {
        id: `debris_${key}_${Date.now()}`,
        position,
        resources,
        createdAt: Date.now()
      }
      
      this.debrisFields[key] = debris
      
      // Sync to server
      try {
        await $fetch('/api/universe/sync', {
          method: 'POST',
          body: {
            updateType: 'addDebris',
            data: debris
          }
        })
      } catch (error) {
        console.error('Add debris error:', error)
      }
    },
    
    // Remove debris field
    async removeDebrisField(position: { galaxy: number; system: number; position: number }) {
      const key = `${position.galaxy}:${position.system}:${position.position}`
      delete this.debrisFields[key]
      
      // Sync to server
      try {
        await $fetch('/api/universe/sync', {
          method: 'POST',
          body: {
            updateType: 'removeDebris',
            data: { position }
          }
        })
      } catch (error) {
        console.error('Remove debris error:', error)
      }
    },
    
    // Update debris field resources
    async updateDebrisField(position: { galaxy: number; system: number; position: number }, resources: { metal: number; crystal: number }) {
      const key = `${position.galaxy}:${position.system}:${position.position}`
      
      if (this.debrisFields[key]) {
        this.debrisFields[key].resources = resources
        
        // Sync to server
        try {
          await $fetch('/api/universe/sync', {
            method: 'POST',
            body: {
              updateType: 'updateDebris',
              data: { position, resources }
            }
          })
        } catch (error) {
          console.error('Update debris error:', error)
        }
      }
    },
    
    // Get debris at position
    getDebrisAt(galaxy: number, system: number, position: number): DebrisField | undefined {
      const key = `${galaxy}:${system}:${position}`
      return this.debrisFields[key]
    },
    
    // Get planet at position  
    getPlanetAt(galaxy: number, system: number, position: number): Planet | undefined {
      const key = `${galaxy}:${system}:${position}`
      return this.planets[key]
    }
  },
  
  getters: {
    allDebrisFields: (state) => Object.values(state.debrisFields),
    allPlanets: (state) => Object.values(state.planets)
  }
})
