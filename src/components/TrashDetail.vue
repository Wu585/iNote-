<template>
  <div>
    <h1>{{msg}}:{{$route.params.noteId}}</h1>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return{
      msg:'回收站详情页'
    }
  }
}
</script>