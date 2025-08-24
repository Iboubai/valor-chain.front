
<template>
  <button :class="btnClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})

const btnClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'btn btn-primary'
    case 'secondary':
      return 'btn btn-secondary'
    case 'danger':
      return 'btn btn-danger'
    default:
      return 'btn btn-primary'
  }
})
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>
