<template>
  <div class="container">
    <el-row :gutter="30">
      <el-col class="row-item" :span="8">
        <p>7栋</p>
        <el-image class="img-item" fit="cover" :src="urls[0]" :preview-src-list="urls" title="点击查看"></el-image>
      </el-col>
      <el-col class="row-item" :span="8">
        <p>8栋</p>
        <el-image class="img-item" fit="cover" :src="urls[1]" :preview-src-list="urls" title="点击查看"></el-image>
      </el-col>
      <el-col class="row-item" :span="8">
        <p>9栋</p>
        <el-image class="img-item" fit="cover" :src="urls[2]" :preview-src-list="urls" title="点击查看"></el-image>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Price',
  data() {
    return {
      urls: [require('@/assets/img/7.jpg'), require('@/assets/img/8.jpg'), require('@/assets/img/9.jpg')]
    }
  }
}
</script>

<style lang="scss" scoped>
.row-item {
    text-align: center;
    > p {
        height: 30px;
        font-size: 24px;
        line-height: 30px;
        padding: 20px 0;
    }
}
.img-item {
    height: 400px;
}
</style>