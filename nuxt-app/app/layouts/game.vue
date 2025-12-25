<template>
  <SidebarProvider :open="sidebarOpen" @update:open="handleSidebarOpenChange">
    <Sidebar collapsible="icon">
      <!-- Logo -->
      <SidebarHeader class="border-b">
        <div class="flex items-center justify-center p-4 group-data-[collapsible=icon]:p-2">
          <img src="/logo.svg" class="w-10 group-data-[collapsible=icon]:w-8" />
          <h1 class="text-xl font-bold ml-2 group-data-[collapsible=icon]:hidden">OGame</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <!-- Planet Info -->
        <SidebarGroup v-if="planet" class="border-b group-data-[collapsible=icon]:hidden">
          <div class="px-4 py-3 space-y-2 text-sm">
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-between h-auto px-3 py-2.5 border-2 hover:bg-accent hover:border-primary transition-colors"
                >
                  <div class="flex items-start gap-2.5 flex-1 min-w-0">
                    <Globe class="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                    <div class="flex-1 min-w-0 text-left">
                      <div class="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        {{ t('planet.currentPlanet') }}
                      </div>
                      <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="truncate font-semibold text-sm">
                          {{ planet.name }}
                          [{{ planet.position.galaxy }}:{{ planet.position.system }}:{{ planet.position.position }}]
                        </span>
                        <Badge v-if="planet.isMoon" variant="secondary" class="text-[10px] px-1 py-0 h-4">
                          {{ t('planet.moon') }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronsUpDown class="h-4 w-4 shrink-0 text-muted-foreground ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-72 p-0" side="bottom" align="start">
                <div class="p-2">
                  <div class="px-2 py-1.5 mb-1 text-xs font-semibold text-muted-foreground">
                    {{ t('planet.switchPlanet') }}
                  </div>
                  <div class="space-y-0.5 max-h-80 overflow-y-auto">
                    <Button
                      v-for="p in gameStore.player.planets"
                      :key="p.id"
                      @click="switchToPlanet(p.id)"
                      :variant="p.id === planet.id ? 'secondary' : 'ghost'"
                      class="w-full justify-start h-auto py-2 px-2"
                      size="sm"
                    >
                      <Globe class="h-4 w-4 mr-2" :class="p.id === planet.id ? 'text-primary' : ''" />
                      <span class="truncate">{{ p.name }}</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <!-- Player Points -->
            <div class="bg-muted/50 rounded-lg p-2">
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">{{ t('player.points') }}</span>
                <span class="text-sm font-bold text-primary">{{ formatNumber(gameStore.player.points) }}</span>
              </div>
            </div>
          </div>
        </SidebarGroup>

        <!-- Navigation -->
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.path">
              <SidebarMenuButton
                :is-active="route.path === item.path"
                :tooltip="item.name"
                @click="navigateTo(item.path)"
              >
                <component :is="item.icon" />
                <span>{{ item.name }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <!-- Footer -->
      <SidebarFooter class="border-t">
        <SidebarMenu>
          <!-- Language -->
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger as-child>
                <SidebarMenuButton :tooltip="localeNames[gameStore.locale]">
                  <Languages />
                  <span>{{ localeNames[gameStore.locale] }}</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent class="w-48 p-2" side="top" align="start">
                <div class="space-y-1">
                  <Button
                    v-for="(name, locale) in localeNames"
                    :key="locale"
                    @click="gameStore.locale = locale"
                    :variant="gameStore.locale === locale ? 'secondary' : 'ghost'"
                    class="w-full justify-start"
                    size="sm"
                  >
                    {{ name }}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>

          <!-- Dark Mode -->
          <SidebarMenuItem>
            <SidebarMenuButton @click="toggleDark()" :tooltip="isDark ? t('sidebar.lightMode') : t('sidebar.darkMode')">
              <Sun v-if="isDark" />
              <Moon v-else />
              <span>{{ isDark ? t('sidebar.lightMode') : t('sidebar.darkMode') }}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <!-- Logout -->
          <SidebarMenuItem>
            <SidebarMenuButton @click="logout" tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <!-- Main Content -->
    <SidebarInset>
      <div class="flex flex-col h-full pt-[60px]">
        <!-- Resource Bar -->
        <header
          v-if="planet"
          class="fixed top-0 right-0 left-0 z-40 bg-card border-b px-4 sm:px-6 py-3 shadow-md"
          :class="sidebarOpen ? 'lg:left-[var(--sidebar-width)]' : 'lg:left-[var(--sidebar-width-icon)]'"
        >
          <div class="flex items-center justify-between gap-4">
            <!-- Mobile Menu -->
            <SidebarTrigger class="lg:hidden" />

            <!-- Resources -->
            <div class="flex items-center gap-4 sm:gap-6 overflow-x-auto">
              <div v-for="res in resourceTypes" :key="res.key" class="flex items-center gap-2 shrink-0">
                <ResourceIcon :type="res.key" size="md" />
                <div>
                  <p class="text-sm font-medium">{{ formatNumber(planet.resources[res.key]) }}</p>
                  <p class="text-xs text-muted-foreground">{{ res.label }}</p>
                </div>
              </div>
            </div>

            <!-- Queue -->
            <div class="shrink-0">
              <QueueNotifications />
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-4 sm:p-6">
          <slot />
        </main>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
  Globe,
  ChevronsUpDown,
  Languages,
  Sun,
  Moon,
  LogOut,
  Home,
  Building2,
  FlaskConical,
  Rocket,
  Shield,
  Navigation,
  Users,
  Trophy,
  Mail,
  Settings,
  Swords
} from 'lucide-vue-next'
import { localeNames } from '~/locales'
import type { Locale } from '~/locales'

const route = useRoute()
const gameStore = useGameStore()
const { clear: logout } = useUserSession()

// Theme
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Sidebar state
const sidebarOpen = ref(true)
const handleSidebarOpenChange = (open: boolean) => {
  sidebarOpen.value = open
}

// Current planet
const planet = computed(() => gameStore.currentPlanet)

// Switch planet
const switchToPlanet = (planetId: string) => {
  gameStore.currentPlanetId = planetId
}

// i18n
const { t } = useI18n()

// Navigation items
const navItems = computed(() => [
  { path: '/overview', name: t('nav.overview'), icon: Home },
  { path: '/buildings', name: t('nav.buildings'), icon: Building2 },
  { path: '/research', name: t('nav.research'), icon: FlaskConical },
  { path: '/shipyard', name: t('nav.shipyard'), icon: Rocket },
  { path: '/defense', name: t('nav.defense'), icon: Shield },
  { path: '/fleet', name: t('nav.fleet'), icon: Navigation },
  { path: '/galaxy', name: t('nav.galaxy'), icon: Globe },
  { path: '/diplomacy', name: t('nav.diplomacy'), icon: Users },
  { path: '/achievements', name: t('nav.achievements'), icon: Trophy },
  { path: '/messages', name: t('nav.messages'), icon: Mail },
  { path: '/battlesimulator', name: t('nav.simulator'), icon: Swords },
  { path: '/settings', name: t('nav.settings'), icon: Settings }
])

// Resource types for display
const resourceTypes = [
  { key: 'metal' as const, label: t('resources.metal') },
  { key: 'crystal' as const, label: t('resources.crystal') },
  { key: 'deuterium' as const, label: t('resources.deuterium') },
  { key: 'darkMatter' as const, label: t('resources.darkMatter') },
  { key: 'energy' as const, label: t('resources.energy') }
]

// Format number helper
const formatNumber = (num: number) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(0)
}
</script>
