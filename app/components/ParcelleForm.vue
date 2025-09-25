<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <!-- Champ pour le nom de la parcelle -->
    <UFormField label="Nom de la parcelle" name="name" required>
      <UInput 
        v-model="state.name" 
        placeholder="Ex: Bande de maraichage" 
        autofocus 
        autocomplete="off" 
      />
    </UFormField>
    
    <UFormField label="Description de la parcelle" name="description" required>
      <UInput 
        v-model="state.description" 
        placeholder="Ex: Endroit ensoleillé" 
        autocomplete="off" 
      />
    </UFormField>

    <!-- Champ pour la superficie -->
    <UFormField  label="Superficie" name="superficie" required>
      <UInput v-model.number="state.superficie" type="number" step="0.1">
        <!-- Le slot #trailing ajoute du contexte à l'input -->
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">ha</span>
        </template>
      </UInput>
    </UFormField >

    <UFormField label="Type de sol" name="typesol">
        <USelectMenu v-model="state.typeId" :items="parcelleTypes" label-key="name" value-key="id" placeholder="Sélectionner le type de sol" class="w-full" />
    </UFormField>

    <!-- Section des boutons d'action -->
    <div class="flex justify-end space-x-3 pt-4">
      <UButton 
        type="button" 
        color="gray" 
        variant="ghost" 
        @click="emit('close')" 
        :disabled="isLoading"
      >
        Annuler
      </UButton>
      <UButton :loading="loading" @click="onSubmit">Enregistrer</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
    import { z } from 'zod';
    import type { FormSubmitEvent } from '#ui/types';

    const { data: user } = useAuth()
    const { get } = useApi()
    const loading = ref(false)

    const parcelleTypesRes = await get(`/api/exploitation/parcelles/getallparcelletypes`);
    const parcelleTypes = ref(parcelleTypesRes.data)

    const emit = defineEmits<{
    (e: 'submit', payload: FormSubmitEvent<z.output<typeof schema>>): void;
    (e: 'close'): void;
    }>();

    const state = reactive({
        userid: user.value?.data.id,
        name: undefined,
        description: undefined,
        superficie: undefined,
        typeId: undefined,  
    });

    // --- VALIDATION ---
    const schema = z.object({
    nom: z.string({ required_error: 'Le nom est requis.' })
            .min(3, 'Le nom doit faire au moins 3 caractères.'),
    superficie: z.number({ required_error: 'La superficie est requise.', invalid_type_error: 'La superficie doit être un nombre.' })
                .positive('La superficie doit être supérieure à 0.'),
    typeSol: z.string().optional(), // Ce champ est optionnel.
    });

    const isLoading = ref(false);

    async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
    isLoading.value = true;
    emit('submit', state)
    }
</script>
