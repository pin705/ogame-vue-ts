import { defineStore } from 'pinia'
import type {
  Planet,
  Player,
  BuildQueueItem,
  FleetMission,
  BattleResult,
  SpyReport,
  Officer,
  SpiedNotification,
  NPCActivityNotification,
  IncomingFleetAlert,
  MissileAttack,
  AchievementStats,
  AchievementProgress
} from '~/types/game'
import { TechnologyType, OfficerType } from '~/types/game'
import type { Locale } from '~/locales'

interface GameState {
  gameTime: number
  isPaused: boolean
  gameSpeed: number
  player: Player
  currentPlanetId: string
  isDark: string
  locale: Locale
  notificationSettings: {
    browser: boolean
    inApp: boolean
    suppressInFocus: boolean
    types: {
      construction: boolean
      research: boolean
      unlock: boolean
      [key: string]: boolean
    }
  }
  // Sync state
  isLoading: boolean
  isSyncing: boolean
  lastSyncTime: number
  syncError: string | null
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    gameTime: Date.now(),
    isPaused: false,
    gameSpeed: 1,
    player: {
      id: 'player1',
      name: '',
      planets: [] as Planet[],
      technologies: {} as Record<TechnologyType, number>,
      officers: {} as Record<OfficerType, Officer>,
      researchQueue: [] as BuildQueueItem[],
      waitingResearchQueue: [],
      fleetMissions: [] as FleetMission[],
      missileAttacks: [] as MissileAttack[],
      battleReports: [] as BattleResult[],
      spyReports: [] as SpyReport[],
      spiedNotifications: [] as SpiedNotification[],
      npcActivityNotifications: [] as NPCActivityNotification[],
      missionReports: [],
      incomingFleetAlerts: [] as IncomingFleetAlert[],
      giftNotifications: [],
      giftRejectedNotifications: [],
      points: 0,
      isGMEnabled: false,
      lastVersionCheckTime: 0,
      achievementStats: {} as AchievementStats,
      achievements: {} as Record<string, AchievementProgress>
    } as Player,
    currentPlanetId: '',
    isDark: '',
    locale: 'en' as Locale,
    notificationSettings: {
      browser: false,
      inApp: true,
      suppressInFocus: false,
      types: {
        construction: true,
        research: true,
        unlock: true
      }
    },
    isLoading: false,
    isSyncing: false,
    lastSyncTime: 0,
    syncError: null
  }),
  
  actions: {
    // Load game data from server
    async loadGame() {
      this.isLoading = true
      this.syncError = null
      
      try {
        const { data } = await $fetch('/api/game/load')
        
        if (data) {
          // Update state with server data
          this.player = {
            ...this.player,
            ...data,
            id: data.userId || data._id
          }
          this.currentPlanetId = data.currentPlanetId || this.player.planets[0]?.id || ''
          this.locale = data.locale || 'en'
          this.isDark = data.isDark || ''
          this.gameSpeed = data.gameSpeed || 1
          this.isPaused = data.isPaused || false
          this.gameTime = data.gameTime || Date.now()
          
          if (data.notificationSettings) {
            this.notificationSettings = data.notificationSettings
          }
        }
        
        this.lastSyncTime = Date.now()
      } catch (error: any) {
        this.syncError = error.message || 'Failed to load game'
        console.error('Load game error:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // Save full game state to server
    async saveGame() {
      this.isSyncing = true
      this.syncError = null
      
      try {
        await $fetch('/api/game/save', {
          method: 'POST',
          body: {
            name: this.player.name,
            planets: this.player.planets,
            technologies: this.player.technologies,
            officers: this.player.officers,
            researchQueue: this.player.researchQueue,
            waitingResearchQueue: this.player.waitingResearchQueue,
            fleetMissions: this.player.fleetMissions,
            missileAttacks: this.player.missileAttacks,
            battleReports: this.player.battleReports,
            spyReports: this.player.spyReports,
            spiedNotifications: this.player.spiedNotifications,
            npcActivityNotifications: this.player.npcActivityNotifications,
            missionReports: this.player.missionReports,
            incomingFleetAlerts: this.player.incomingFleetAlerts,
            giftNotifications: this.player.giftNotifications,
            giftRejectedNotifications: this.player.giftRejectedNotifications,
            diplomaticReports: this.player.diplomaticReports,
            points: this.player.points,
            currentPlanetId: this.currentPlanetId,
            locale: this.locale,
            isDark: this.isDark,
            isGMEnabled: this.player.isGMEnabled,
            gameSpeed: this.gameSpeed,
            isPaused: this.isPaused,
            gameTime: this.gameTime,
            tutorialProgress: this.player.tutorialProgress,
            privacyAgreed: this.player.privacyAgreed,
            dismissedHints: this.player.dismissedHints,
            hintsEnabled: this.player.hintsEnabled,
            backgroundEnabled: this.player.backgroundEnabled,
            fleetPresets: this.player.fleetPresets,
            achievementStats: this.player.achievementStats,
            achievements: this.player.achievements,
            campaignProgress: this.player.campaignProgress,
            questNotifications: this.player.questNotifications,
            notificationSettings: this.notificationSettings
          }
        })
        
        this.lastSyncTime = Date.now()
      } catch (error: any) {
        this.syncError = error.message || 'Failed to save game'
        console.error('Save game error:', error)
      } finally {
        this.isSyncing = false
      }
    },
    
    // Sync specific update to server
    async syncUpdate(updateType: string, data: any) {
      try {
        await $fetch('/api/game/sync', {
          method: 'POST',
          body: { updateType, data }
        })
      } catch (error) {
        console.error('Sync error:', error)
        // Queue for retry or handle offline
      }
    },
    
    async requestBrowserPermission(): Promise<boolean> {
      if (!('Notification' in window)) return false
      if (Notification.permission === 'granted') return true
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
  },
  
  getters: {
    currentPlanet(): Planet | undefined {
      return this.player.planets.find(p => p.id === this.currentPlanetId)
    },
    getMoonForPlanet(): (planetId: string) => Planet | undefined {
      return (planetId: string) => {
        return this.player.planets.find(p => p.parentPlanetId === planetId && p.isMoon)
      }
    }
  }
})
