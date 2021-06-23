<template>
  <div class="con">
    <div class="float" @click="isShowDialog = true">
      <b>￥</b>
      <span>打赏</span>
      <!-- <el-button type="warning" round><b>￥</b></el-button> -->
    </div>
    <el-dialog v-model="isShowDialog" title="打赏" width="400px" center>
      <div class="code">
        <img width="300" height="300" src="@/assets/img/code.jpg" alt="二维码">
        <p class="msg">{{ getMsg() }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FloatBox',
  data() {
    return {
      isShowDialog: false,
      
    }
  },
  methods: {
    getMsg() {
      const msgList = ['觉得不错的话请作者喝杯茶', '你的鼓励是作者创造的最大的动力']
      const i = Math.round(Math.random())
      return msgList[i]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.float {
  position: fixed;
  z-index: 99;
  right: -30px;
  bottom: 100px;
  border: 1px solid #ccc;
  border-right: none;
  width: 50px;
  height: 30px;
  padding: 4px 6px 4px 12px;
  line-height: 30px;
  cursor: pointer;
  border-radius: 19px 0 0 19px;
  background: #fff;
  transition: all ease-out .2s;
  color: #fff;
  > span {
    font-size: 14px;
  }
  > b {
    color: #888;
    font-size: 16px;
  }
  &:hover {
    right: 0;
    transition: all ease-in .2s;
    color: #888;
  }
}
.code {
  text-align: center;
  .msg {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}

</style>
