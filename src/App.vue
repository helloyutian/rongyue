<template>
  <el-container>
    <el-header class="header">
        <div class="nav">
          <h1 class="brand">榕悦花园共有房筛选<p>选房快人一步</p></h1>
          <ul class="nav-ul">
            <li><a href="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/index" target="_blank">查询申请进度</a></li>
            <li><a href="http://zfcj.gz.gov.cn/" target="_blank">广州市住房和城乡建设局</a></li>
            <li><a href="http://gz.bendibao.com/life/20201229/284674.shtml" target="_blank">房源信息</a></li>
            <li><a href="http://imgbdb3.bendibao.com/gzbdb/life/20212/22/2021222092410_34172.doc">共有产权住房买卖合同示范文本</a></li>
          </ul>
        </div>
        <div class="banner">
            <a href="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/index" target="_blank">
              <img src="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/static/img/banner-gycq.c7d348ff.jpg" alt="">
              <p class="banner-title">广州市市本级共有产权住房</p>
            </a>
        </div>
    </el-header>
    <el-container>
      <el-aside class="menu" :class="{ collapse: isCollapse }" width="auto">
        <el-menu
            router
            :default-active="$route.path"
            :collapse="isCollapse"
        >
            <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <template #title>全部房源</template>
            </el-menu-item>
            <el-menu-item index="/spare">
                <i class="el-icon-s-management"></i>
                <template #title>我的预选</template>
            </el-menu-item>
            <el-menu-item v-if="type === 1" index="/disabled">
                <i class="el-icon-s-release"></i>
                <template #title>已被选列表</template>
            </el-menu-item>
            <el-menu-item index="/plane">
                <i class="el-icon-camera"></i>
                <template #title>平面图</template>
            </el-menu-item>
            <el-menu-item index="/price">
                <i class="el-icon-view"></i>
                <template #title>7-9栋价格</template>
            </el-menu-item>
        </el-menu>
        <div class="collapse-btn">
          <span v-if="isCollapse" @click="isCollapse=false"><i class="el-icon-s-unfold"></i> 展开</span>
          <span v-else @click="isCollapse=true"><i class="el-icon-s-fold"></i> 收起</span>
          <!-- <el-button v-if="isCollapse" icon="el-icon-s-unfold" size="small" circle @click="isCollapse=false"></el-button> -->
          <!-- <el-button v-else icon="el-icon-s-fold" size="small" @click="isCollapse=true">收起</el-button> -->
        </div>
      </el-aside>
      <el-main>
          <router-view :type="type" />
        </el-main>
    </el-container>
    <el-footer class="footer">
        <p>本站仅供查看筛选房源信息，数据不会同步到正式选房系统</p>
        <p>网站上如有任何问题，请联系直接联系管理员 <a href="mailto:499906898@qq.com" target="_blank">499906898@qq.com</a></p>
    </el-footer>
    <!-- <div class="footer"></div> -->
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  mounted() {
    const wt = document.documentElement.clientWidth
    if (wt < 1100) {
      this.isCollapse = true
    }
  },
  computed: {
    type() {
      let type = this.$route.query.type
      if (type) {
        localStorage.setItem('webType', type)
      } else {
        type = localStorage.getItem('webType')
      }
      return type ? Number(type) : null
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body, h1, h2, h3, h4, ul, li, p {
  margin: 0;
}
a {
  text-decoration: none;
}
.mt-10 {
  margin-top: 10px;
}
.mr-10 {
  margin-right: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
.ml-10 {
  margin-left: 10px;
}
.brand {
  color: #2c3e50;
  line-height: 1.2;
  > p {
    font-size: 12px;
    font-weight: 300;
    color: #888;
    letter-spacing: 0.7em;
    text-align: center;
  }
}
.banner {
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
  > a {
    > img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
    }
    > p {
      color: #fff;
      font-size: 36px;
      line-height: 1.5;
      font-weight: bold;
      position: absolute;
      z-index: 2;
      top: 30px;
      left: 60px;
    }
  }
}
.header {
  height: auto !important;
  padding: 0 !important;
  .nav {
    height: 80px;
    padding: 0 50px;
    line-height: 80px;
    display: flex;
    align-items: center;
    > h1 {
      flex: none;
      margin-right: 50px;
    }
    .nav-ul {
      flex: auto;
      list-style: none;
      padding: 0;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      > li {
        display: inline-block;
        margin-right: 30px;
        > a {
          color: #888;
          text-decoration: none;
          &:visited, &:link {
            color: #888;
            text-decoration: none;
          }
          &:hover, &:active {
            color: #333;
          }
        }
      }
    }
  }
}
.footer {
  background: #eee;
  text-align: center;
  padding: 20px !important;
  line-height: 1.5;
  height: auto !important;
  > p {
    font-size: 13px;
    color: #aaa;
    margin: 6px 0;
    > a {
      color: #888;
    }
  }
}
.menu {
  width: 230px !important;
  transition: all ease-in .2s;
  &.collapse {
    width: 65px !important;
    transition: all ease-in .2s;
  }
}
.collapse-btn {
  align-self: flex-end;
  text-align: center;
  padding-top: 30px;
  font-size: 12px;
  line-height: 30px;
  color: #999;
  border-right: 1px solid #e6e6e6;
  > span {
    cursor: pointer;
  }
}
// 页面样式
// .container {
  // padding: 15px;
// }
.my-table {
  text-align: center;
  .info-row {
    background: #E4E7ED;
  }
  .success-row {
    background: #f0f9eb;
  }
}
.search {
  margin-bottom: 15px;
  .search-item {
    width: 220px;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-btn {
    margin-top: 15px;
  }
}
.previewImg {
    height: 0;
    width: 0;
    overflow: hidden;
}
.taggle-input {
  color: #409EFF;
  cursor: pointer;
}
.dl-link {
  color: #409EFF;
  text-decoration: none;
  &:hover, &:active {
    text-decoration: underline;
  }
}
.text-danger {
  color: #F56C6C;
}
.text-warning {
  color: #E6A23C;
}
.text-success {
  color: #67C23A;
}
</style>
