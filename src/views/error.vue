<template>
  <div class="error">
    <h1>{{ errCode }}</h1>
    <p v-if="404">页面不存在或者已经删除</p>
    <p v-else>服务器错误，请稍后再试</p>
  </div>
</template>
<script>
export default {
  name: 'Error',
  data() {
    return {
      errCode: 500
    }
  },
  created() {
    this.errCode = this.$route.params.code || 500
  },
}
</script>

<style lang="scss" scoped>
.error {
  padding: 60px 20px 200px;
  text-align: center;
  > h1 {
    font-size: 120px;
    line-height: 1;
  }
  > p {
    color: #aaa;
    font-size: 16px;
  }
}
</style>
