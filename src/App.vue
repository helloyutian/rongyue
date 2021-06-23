<template>
  <el-container>
    <el-header class="header">
        <div class="nav">
          <h1 class="brand">共有房筛选</h1>
          <ul class="nav-ul">
            <li><a href="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/index" target="_blank">共有房进度</a></li>
            <li><a href="http://gz.bendibao.com/life/2021131/286998.shtml" target="_blank">房源及交通信息</a></li>
          </ul>
        </div>
        <!-- <el-menu mode="horizontal">
            <el-menu-item index="0"><h1 class="brand">共有产权住房预选</h1></el-menu-item>
            <el-menu-item index="1"><a href="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/index" target="_blank">共有房进度</a></el-menu-item>
            <el-menu-item index="4"><a href="http://gz.bendibao.com/life/2021131/286998.shtml" target="_blank">房源及交通信息</a></el-menu-item>
        </el-menu> -->
        <div class="banner">
            <a href="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/index" target="_blank"><img src="http://zwfw.gzonline.gov.cn/gzf-gycqsq/gzf/static/img/banner-gycq.c7d348ff.jpg" alt=""></a>
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
                <template #title>全部</template>
            </el-menu-item>
            <el-menu-item index="/spare">
                <i class="el-icon-s-management"></i>
                <template #title>我的预选</template>
            </el-menu-item>
            <el-menu-item index="/disabled">
                <i class="el-icon-s-release"></i>
                <template #title>已被选列表</template>
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
          <router-view />
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
}
.banner {
  width: 100%;
  height: 150px;
  overflow: hidden;
  > a > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
}
.header {
  height: auto !important;
  padding: 0 !important;
  .nav {
    height: 80px;
    padding: 0 50px;
    line-height: 80px;
    > h1 {
      float: left;
      margin-right: 50px;
    }
    .nav-ul {
      list-style: none;
      padding: 0;
      display: inline-block;
      font-size: 13px;
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
}
.search {
  margin-bottom: 15px;
  .search-item {
    margin-top: 15px;
    margin-right: 10px;
  }
}
.previewImg {
    height: 0;
    width: 0;
    overflow: hidden;
}
</style>
