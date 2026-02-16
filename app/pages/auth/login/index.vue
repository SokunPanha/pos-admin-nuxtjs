<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  layout: false,
});

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
});

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    console.log("Login submitted:", event.data);
    // TODO: implement actual login logic
    await navigateTo("/");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-(--ui-bg)">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Admin Login</h1>
          <p class="mt-1 text-sm text-(--ui-text-muted)">
            Sign in to your account
          </p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput
            v-model="state.username"
            placeholder="Enter your username"
            icon="i-lucide-user"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
        >
          Sign In
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
