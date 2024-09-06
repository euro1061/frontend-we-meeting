<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

import LoginButton from '~/components/ui/LoginButton.vue';
import { useLogin } from '~/composables/useLogin';

const { schema, state, handleLogin } = useLogin();
</script>

<template>
  <div class="flex min-h-screen bg-cover bg-center" style="background-image: url('/backgroupLogin.jpg');">
    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 bg-blue-600 p-6 md:p-8 flex flex-col justify-center relative z-10 ml-auto md:rounded-l-3xl">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-8 text-center">WE-MEETING</h1>
      <UDivider label="ระบบจองห้องประชุมออนไลน์" :ui="{ label: 'text-white text-sm md:text-base' }" class="mb-6" />

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleLogin">
        <UFormGroup name="username">
          <template #label>
            <span class="text-white text-sm md:text-base">ชื่อผู้ใช้:</span>
          </template>
          <UInput color="white" v-model="state.username" placeholder="กรอกชื่อผู้ใช้" class="mt-1" />
        </UFormGroup>

        <UFormGroup name="password">
          <template #label>
            <span class="text-white text-sm md:text-base">รหัสผ่าน:</span>
          </template>
          <UInput color="white" v-model="state.password" type="password" placeholder="กรอกรหัสผ่าน" class="mt-1" />
        </UFormGroup>
        <div class="mt-3"></div>
        <LoginButton variant="primary" size="lg" class="w-full mt-4">
          เข้าสู่ระบบ
        </LoginButton>
      </UForm>

      <p class="text-white text-xs md:text-sm mt-6 md:mt-8 text-right">Version 1.0.0</p>
    </div>
  </div>
</template>

<style scoped>
@screen md {
  .bg-blue-600 {
    background-color: rgba(37, 99, 235, 0.9);
  }
}
</style>