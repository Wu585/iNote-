<template>
  <div>
    <h1>{{ msg }}:{{ $route.params.noteId }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      msg: '笔记本详情页'
    }
  },
  methods: {
    open() {
      this.$message({
        message: '提示',
        type: 'success'
      })
    }
  }
}
</script>