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
      <el-button class="search-btn" type="success" size="small" :disabled="!selectHouseList.length" @click="addSpare">添加预选</el-button>
      <el-button v-if="type === 1" class="search-btn" type="danger" size="small" :disabled="!selectHouseList.length" @click="addDisabled">设为已被选</el-button>
      <!-- <el-upload
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
      >
        <el-button type="primary" size="small">上传</el-button>
      </el-upload> -->
    <!-- </el-form> -->
    </div>
    <p class="el-upload__tip mb-10" style="color: #888">* <span v-if="type === 1">添加到 已被选 的房源将不在下面的列表显示；</span>VR实景为3栋16楼或19楼同户型房子的实景，仅供参考</p>
     <!--  -->
    <el-table class="my-table" ref="multipleTable" :row-class-name="tableRowClassName" :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="getSelectableStatus" width="50" align="center"></el-table-column>
      <el-table-column prop="house" label="楼栋" align="center">
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouHousePic(scope.row.house)" title="查看平面图">{{ scope.row.house }}栋</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="roomId" label="房号" align="center"></el-table-column>
      <el-table-column prop="type" label="房型" align="center" min-width="100"></el-table-column>
      <el-table-column prop="houseType" label="户型" align="center" sortable  min-width="100">
        <template #header>
          <el-tooltip class="item" effect="dark" content="户型1、户型2表示同户型的镜像户型，如A1、A2" placement="top-start">
          <span>户型 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouRoomPic(scope.row.houseType)" title="查看户型图">{{ scope.row.houseType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="面积(m²)" align="center" sortable min-width="100"></el-table-column>
      <el-table-column prop="floor" label="楼层" align="center" sortable>
        <template #default="scope">
          {{ scope.row.floor }} 层
        </template>
      </el-table-column>
      <el-table-column prop="isSpare" label="状态" align="center">
        <template #default="scope">
          <span v-if="type === 1 && scope.row.isDisabled" class="text-danger">已被选</span>
          <span v-else-if="scope.row.isSpare" class="text-warning">已预选</span>
          <span v-else class="text-success">可选</span>
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="朝向" align="center">
          <template #default="scope">
              {{ scope.row.direction }}（{{ scope.row.face }}）
          </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价(元)" align="center" sortable>
          <template #default="scope">
              {{ (scope.row.totalPrice / scope.row.area).toFixed(2) }}
          </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价(元)" align="center" sortable>
          <template #default="scope">
            <span class="text-danger">{{ (scope.row.totalPrice).toFixed(2) }}</span>
          </template>
      </el-table-column>
      <!-- <el-table-column prop="voice" label="噪音" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" min-width="320">
        <template #default="scope">
          <template v-if="type === 1">
            <template v-if="!scope.row.isDisabled">
              <el-button v-if="!scope.row.isSpare" type="success" plain size="mini" @click="addSpare([scope.row])">加入预选</el-button>
              <el-button v-else type="success" plain size="mini" disabled>已加入预选</el-button>
              <el-button type="danger" plain size="mini" @click="addDisabled([scope.row])">设为已被选</el-button>
            </template>
          </template>
          <template v-else>
            <el-button v-if="!scope.row.isSpare" type="success" plain size="mini" @click="addSpare([scope.row])">加入预选</el-button>
            <el-button v-else type="success" plain size="mini" disabled>已加入预选</el-button>
          </template>
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
    <el-image v-show="false" class="previewImg" ref="previewElem" src='' width="0" height="0" :preview-src-list="previewList"></el-image>
    <float-box />
  </div>
</template>

<script>
// @ is an alias to /src
import FloatBox from '@/components/floatBox.vue'
import { getAllHouseList, addSpareList, addDisabledList } from '@/apis'
import { vrList } from '@/assets/data'
// import XLSX from 'xlsx'
export default {
  name: 'Home',
  components: {
    FloatBox
  },
  props: {
    type: Number
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
  // setup() {
  //   console.log('xxxxx')
  // },
  mounted() {
    this.queryTableList()
  },
  methods: {
    // handleChange(file) {
    //   const reader = new FileReader()
    //   reader.onload = (e) => {
    //     const data = new Uint8Array(e.target.result)
    //     const wb = XLSX.read(data, { type: 'array' })
    //     console.log(wb)
    //     const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    //     console.log(JSON.stringify(jsonData))
    //   }
    //   reader.readAsArrayBuffer(file.raw)
    // },
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
      // console.log(this.queryParams)
      if (this.queryParams.roomId && !/^[1-9][0-9]{2,3}$/.test(this.queryParams.roomId)) {
        return this.$message.error('请填写正确的房号')
      }
      const res = getAllHouseList(this.queryParams)
      // console.log(res.list)
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
    addSpare(list) {
      if (Array.isArray(list)) {
        addSpareList(list)
      } else {
        addSpareList(this.selectHouseList)
      }
      this.$message.success('添加预选成功')
      this.$refs.multipleTable.clearSelection()
      this.queryList()
    },
    addDisabled(list) {
       if (Array.isArray(list)) {
        addDisabledList(list)
      } else {
        addDisabledList(this.selectHouseList)
      }
      this.$message.success('添加已被选成功')
      this.$refs.multipleTable.clearSelection()
      this.queryList()
    },
    // hasVR(type) {
    //   return Boolean(vrList[type])
    // },
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
    },
    getSelectableStatus (row) {
      if (this.type === 1) {
        return !row.isDisabled
      } else {
        return !row.isSpare
      }
    },
    tableRowClassName({ row }) {
      const className = this.type === 1 && row.isDisabled ? 'info-row' : ''
      return className
    }
  }
}
</script>
