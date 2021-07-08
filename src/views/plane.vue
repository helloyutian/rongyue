<template>
  <div class="container">
    <el-image
      class="plane"
      :src="url" 
      :preview-src-list="[url]"
      title="点击放大查看"
    ></el-image>
  </div>
</template>
<script>
export default {
  name: 'Plane',
  data() {
    return {
      url: require('@/assets/img/plane.jpg')
    }
  }
}
</script>

<style scoped>
.plane {
    width: 800px;
    height: auto;
}
</style>
