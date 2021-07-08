<template>
  <div class="container">
    <div class="search">
    <!-- <el-form class="search" :inline="true" size="small"> -->
      <!-- <el-input></el-input> -->
      <el-select class="search-item" v-model="queryParams.house" multiple placeholder="选择楼栋，可多选" size="small" collapse-tags clearable>
        <el-option v-for="item in 6" :key="item" :value="item" :label="item + '栋'"></el-option>
      </el-select>
      <el-input class="search-item" v-model.number="queryParams.roomId" placeholder="请填写房号" size="small"></el-input>
      <el-select class="search-item" v-model="queryParams.type" placeholder="选择房型" size="small" clearable>
        <el-option v-for="item in typeList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.houseType" multiple placeholder="选择户型，可多选" size="small" collapse-tags clearable>
        <el-option v-for="item in houseTypeList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.direction" multiple placeholder="选择朝向，可多选" size="small" collapse-tags clearable>
        <el-option v-for="item in directuionList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.floor" multiple placeholder="选择楼层，可多选" size="small" collapse-tags clearable>
        <el-option v-for="item in 33" :key="item" :value="item" :label="item + '层'"></el-option>
      </el-select>
      <el-button class="search-btn" type="success" size="small" @click="queryTableList">查询</el-button>
      <el-button class="search-btn" type="danger" size="small" @click="removeDisabled">移除已被选</el-button>
    </div>
    <p class="el-upload__tip mb-10" style="color: #888">* 系统只会在您现在这台电脑上保存列表数据，其他设备上打开时要重新选择</p>
    <el-table class="my-table" ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
      <el-table-column prop="house" label="楼栋" align="center">
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouHousePic(scope.row.house)" title="查看平面图">{{ scope.row.house }}栋</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="roomId" label="房号" align="center"></el-table-column>
      <el-table-column prop="type" label="房型" align="center" min-width="100"></el-table-column>
      <el-table-column prop="houseType" label="户型" align="center">
        <template #header>
          <el-tooltip class="item" effect="dark" content="户型1、户型2表示同户型的镜像户型，如A1、A2" placement="top-start">
          <span>户型 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouRoomPic(scope.row.houseType)" title="查看户型图">{{ scope.row.houseType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="面积(m²)" align="center" min-width="100"></el-table-column>
      <el-table-column prop="floor" label="楼层" align="center">
        <template #default="scope">
          {{ scope.row.floor }} 层
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="朝向" align="center">
          <template #default="scope">
            {{ scope.row.direction }}（{{ scope.row.face || getHouseFace(scope.row.house, scope.row.roomId) }}）
          </template>
      </el-table-column>
      <!-- <el-table-column prop="voice" label="噪音" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" min-width="150">
        <template #default="scope">
          <el-button type="danger" plain size="mini" @click="removeDisabled([scope.row])">移除已被选</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- // 分页 -->
    <el-pagination
      class="mt-10"
      background
      :current-page="queryParams.currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="queryParams.pageSize"
      layout="->, total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- // 图片预览 -->
    <!-- <el-image-viewer v-show="isShowView" :on-close="isShowView=false" :url-list="previewList"></el-image-viewer> -->
    <el-image v-show="false" class="previewImg" ref="previewElem" src='' width="0" height="0" :preview-src-list="previewList"></el-image>
    <float-box />
  </div>
</template>

<script>
import FloatBox from '@/components/floatBox.vue'
import { getDisabledList, removeDisabledList } from '@/apis'
import { houseTypeList } from '@/assets/data'
export default {
  name: 'DisabledList',
  beforeRouteEnter(to, from, next) {
    const type = to.query.type || localStorage.getItem('webType')
    if (type) {
      next()
    } else {
      next('/404')
    }
  },
  components: {
    FloatBox
  },
  data() {
    this.typeList = ['两房一厅', '三房一厅']
    this.houseTypeList = ['A', 'B', 'C', 'D', 'E', 'F']
    this.directuionList = ['东', '南', '西', '北', '东南', '东北', '西南', '西北']
    return {
      tableData: [],
      total: 0,
      queryParams: {
          currentPage: 1,
          pageSize: 20
      },
      isShowView: false,
      previewList: [],
      selectHouseList: []
    }
  },
  watch: {
    isShowView(val) {
      if(val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  mounted() {
    this.queryTableList()
  },
  methods: {
    getHouseFace(house, roomId) {
      const key = 'H' + String(roomId).substr(1)
      return houseTypeList[house - 1][key].cx
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.queryTableList()
    },
    handleCurrentChange(val) {
      this.queryParams.currentPage = val
      this.queryList()
    },
    queryTableList() {
      this.queryParams.currentPage = 1
      this.queryList()
    },
    queryList() {
      const res = getDisabledList(this.queryParams)
      this.tableData = res.list
      this.total = res.total
    },
    shouHousePic(i) {
      if (i === 2 || i === 5) {
        this.previewList = [require('@/assets/img/h2.jpg')]
      } else {
        this.previewList = [require('@/assets/img/h1.jpg')]
      }
      this.isShowView = true
      this.$refs.previewElem.showViewer = true
      // this.isShowView = true
    },
    shouRoomPic(type) {
      const imgSrc = require(`@/assets/img/${ type.substr(0, 1).toLocaleLowerCase() }.jpg`)
      this.previewList = [imgSrc]
      this.isShowView = true
      this.$refs.previewElem.showViewer = true
    },
    handleSelectionChange(rows) {
      this.selectHouseList = rows
    },
    removeDisabled(list) {
      if (Array.isArray(list)) {
        removeDisabledList(list)
      } else {
        removeDisabledList(this.selectHouseList)
      }
      this.$message.success('移除成功')
      this.$refs.multipleTable.clearSelection()
      this.queryList()
    }
  }
}
</script>
