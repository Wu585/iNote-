<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      msg: 'login.vue'
    }
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>