<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <h1>Welcome to the homepage</h1>
      <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{
      inset: true
    }"
  />
      <p>
        <AppButton variant="primary">
          <Icon name="uil:accumulate" style="color: black" />
          Primary Action
        </AppButton>
        <AppButton variant="secondary">Click Me</AppButton>
        <AppButton variant="danger">Delete</AppButton> 
      </p>
    </NuxtLayout>
  </div>
</template>
<!-- <template>
  <div>
    <h1>Welcome to the homepage</h1>
  </div>
</template> -->
<style scoped>
  h1 {
    color: #1f5b97;
    text-align: center;
  }
</style>