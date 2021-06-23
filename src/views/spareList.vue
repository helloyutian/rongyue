<template>
  <div class="container">
    <div class="search">
    <!-- <el-form class="search" :inline="true" size="small"> -->
      <!-- <el-input></el-input> -->
      <el-select class="search-item" v-model="queryParams.house" multiple placeholder="选择楼栋" size="small" collapse-tags clearable>
        <el-option v-for="item in 6" :key="item" :value="item" :label="item + '栋'"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.type" placeholder="选择房型" size="small" clearable>
        <el-option v-for="item in typeList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.houseType" multiple placeholder="选择户型" size="small" collapse-tags clearable>
        <el-option v-for="item in houseTypeList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.direction" multiple placeholder="选择朝向" size="small" collapse-tags clearable>
        <el-option v-for="item in directuionList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select class="search-item" v-model="queryParams.floor" multiple placeholder="选择楼层" size="small" collapse-tags clearable>
        <el-option v-for="item in 33" :key="item" :value="item" :label="item + '层'"></el-option>
      </el-select>
      <el-button type="success" size="small" @click="queryTableList">查询</el-button>
      <el-button type="warning" size="small" @click="exportTable">导出本页数据</el-button>
    </div>
    <p class="el-upload__tip mb-10" style="color: #888">* 添加到 已被选 的房源将不在下面的列表显示；VR实景为3栋16楼或19楼同户型房子的实景，仅供参考</p>
     <el-table class="my-table" ref="spareTable" :data="tableData" border>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="house" label="楼栋" align="center">
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouHousePic(scope.row.house)">{{ scope.row.house }}栋</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="roomId" label="房号" align="center"></el-table-column>
      <el-table-column prop="houseType" label="户型" align="center" sortable>
        <template #header>
          <el-tooltip class="item" effect="dark" content="户型1、户型2表示同户型的镜像，如A1、A2" placement="top-start">
          <span>户型 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouRoomPic(scope.row.houseType)">{{ scope.row.houseType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="房型" align="center"></el-table-column>
      <el-table-column prop="area" label="面积(m²)" align="center" sortable></el-table-column>
      <el-table-column prop="floor" label="楼层" align="center" sortable>
        <template #default="scope">
          {{ scope.row.floor }} 层
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="朝向" align="center"></el-table-column>
      <!-- <el-table-column prop="voice" label="噪音" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" min-width="200">
        <template #default="scope">
          <el-button type="danger" plain size="mini" @click="removeSpare([scope.row])">移除预选</el-button>
          <el-button type="danger" plain size="mini" @click="addDisabled([scope.row])">设置为已被选</el-button>
          <el-button type="warning" plain size="mini" @click="toHouseVR(scope.row.houseType)">VR看房</el-button>
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
import { getSpareList, removeSpareList, addDisabledList } from '@/apis'
import { vrList } from '@/assets/data'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default {
  name: 'SpareList',
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
      previewList: []
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
      const res = getSpareList(this.queryParams)
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
    removeSpare(list) {
      removeSpareList(list)
      this.$message.success('移除成功')
      this.queryList()
    },
    addDisabled(list) {
      addDisabledList(list)
      this.$message.success('添加已被选成功')
      this.queryList()
    },
    exportTable() {
      const wb = XLSX.utils.table_to_book(this.$refs.spareTable.$el)
      const wopts = { bookType:'xlsx', bookSST:false, type:'array' }
      const wbout = XLSX.write(wb, wopts)
      saveAs(new Blob([wbout], { type:"application/octet-stream" }), "榕悦花园共有房预选房源.xlsx")
    },
    toHouseVR(type) {
      let vrUrl = vrList[type]
      if (typeof vrUrl !== 'string') {
        vrUrl = vrUrl[0]
      }
      if (vrUrl) {
        window.open(vrUrl)
      } else if (type === 'D2') {
        this.$alert('没有D2户型的VR，可参考D1户型的VR')
      } else {
        this.$alert('没有找到该户型VR')
      }
    }
  }
}
</script>
