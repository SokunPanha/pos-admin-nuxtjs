<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  layout: false,
});

const { t } = useI18n();

const schema = computed(() =>
  z.object({
    username: z.string().min(1, t("validation.usernameRequired")),
    password: z.string().min(6, t("validation.passwordMin")),
  })
);

interface Schema {
  username: string;
  password: string;
}

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
          <h1 class="text-2xl font-bold">{{ $t('label.adminLogin') }}</h1>
          <p class="mt-1 text-sm text-(--ui-text-muted)">
            {{ $t('message.signInToAccount') }}
          </p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="$t('label.username')" name="username">
          <UInput
            v-model="state.username"
            :placeholder="$t('placeholder.enterUsername')"
            icon="i-lucide-user"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('label.password')" name="password">
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="$t('placeholder.enterPassword')"
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
          {{ $t('label.signIn') }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
