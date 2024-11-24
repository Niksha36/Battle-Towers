<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>