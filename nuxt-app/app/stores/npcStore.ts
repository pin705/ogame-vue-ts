import { defineStore } from 'pinia'
import type { NPC } from '~/types/game'

interface NPCState {
  npcs: NPC[]
  lastGrowthCheck: Record<string, number>
  isLoading: boolean
  lastSyncTime: number
}

export const useNPCStore = defineStore('npc', {
  state: (): NPCState => ({
    npcs: [],
    lastGrowthCheck: {},
    isLoading: false,
    lastSyncTime: 0
  }),
  
  actions: {
    // Load NPCs from server
    async loadNPCs() {
      this.isLoading = true
      
      try {
        const { data } = await $fetch('/api/npcs')
        
        if (data) {
          this.npcs = data.map((npc: any) => ({
            ...npc,
            id: npc.npcId || npc.id
          }))
        }
        
        this.lastSyncTime = Date.now()
      } catch (error) {
        console.error('Load NPCs error:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // Sync NPCs to server
    async syncNPCs() {
      try {
        await $fetch('/api/npcs/sync', {
          method: 'POST',
          body: {
            action: 'upsert',
            npcs: this.npcs
          }
        })
        
        this.lastSyncTime = Date.now()
      } catch (error) {
        console.error('Sync NPCs error:', error)
      }
    },
    
    // Update single NPC
    async updateNPC(npcId: string, data: Partial<NPC>) {
      // Update local state
      const index = this.npcs.findIndex(n => n.id === npcId)
      if (index !== -1) {
        this.npcs[index] = { ...this.npcs[index], ...data }
      }
      
      // Sync to server
      try {
        await $fetch('/api/npcs/sync', {
          method: 'POST',
          body: {
            action: 'update',
            npcId,
            data
          }
        })
      } catch (error) {
        console.error('Update NPC error:', error)
      }
    },
    
    // Add NPC locally
    addNPC(npc: NPC) {
      this.npcs.push(npc)
    },
    
    // Remove NPC locally
    removeNPC(npcId: string) {
      const index = this.npcs.findIndex(n => n.id === npcId)
      if (index !== -1) {
        this.npcs.splice(index, 1)
      }
    }
  },
  
  getters: {
    getNPCById: (state) => (id: string) => {
      return state.npcs.find(npc => npc.id === id)
    },
    
    hostileNPCs: (state) => {
      return state.npcs.filter(npc => {
        const playerRelation = npc.relations?.['player1']
        return playerRelation?.status === 'hostile'
      })
    },
    
    friendlyNPCs: (state) => {
      return state.npcs.filter(npc => {
        const playerRelation = npc.relations?.['player1']
        return playerRelation?.status === 'friendly'
      })
    }
  }
})
