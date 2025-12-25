<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
    <div class="w-full max-w-md px-4">
      <div class="text-center mb-8">
        <img src="/logo.svg" class="w-24 h-24 mx-auto mb-4" />
        <h1 class="text-4xl font-bold mb-2">OGame Vue TS</h1>
        <p class="text-muted-foreground">{{ t('home.subtitle') }}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{{ isLogin ? 'Login' : 'Register' }}</CardTitle>
          <CardDescription>
            {{ isLogin ? 'Welcome back, Commander!' : 'Create your account to start conquering the stars' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="!isLogin" class="space-y-2">
              <Label for="username">Username</Label>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="Commander"
                required
                minlength="3"
                maxlength="20"
              />
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="commander@galaxy.com"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                required
                minlength="6"
              />
            </div>

            <div v-if="error" class="text-sm text-destructive">
              {{ error }}
            </div>

            <Button type="submit" class="w-full" :disabled="loading">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ isLogin ? 'Login' : 'Register' }}
            </Button>
          </form>
        </CardContent>
        <CardFooter class="flex justify-center">
          <Button variant="link" @click="isLogin = !isLogin">
            {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const { fetch: refreshSession } = useUserSession()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin.value
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password }

    await $fetch(endpoint, {
      method: 'POST',
      body
    })

    // Refresh session and redirect
    await refreshSession()
    navigateTo('/overview')
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
