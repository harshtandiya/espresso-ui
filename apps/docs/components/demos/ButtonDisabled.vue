<script setup lang="ts">
import Button from "../Button.vue";
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 p-6">
    <Button variant="solid" disabled>Solid</Button>
    <Button variant="outline" disabled>Outline</Button>
    <Button variant="ghost" disabled>Ghost</Button>
    <Button variant="link" disabled>Link</Button>
  </div>
</template>
