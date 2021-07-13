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
      <el-button v-if="type === 1" class="search-btn" type="success" size="small" @click="importTable">导入预选数据</el-button>
      <el-button class="search-btn" type="warning" size="small" @click="exportTable">导出Excel</el-button>
    </div>
    
    <p class="el-upload__tip mb-10" style="color: #888">* <span v-if="type === 1">添加到 已被选 的房源将不在下面的列表显示；</span>VR实景为3栋16楼或19楼同户型房子的实景，仅供参考</p>
    <p class="el-upload__tip mb-10" style="color: #888">* 系统只会在您现在这台电脑上保存列表数据，其他设备上打开时需要重新选择，建议选好后导出Excel文件</p>
    <el-table class="my-table" ref="spareTable" :data="tableData" border>
      <!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
      
      <el-table-column prop="house" label="楼栋" align="center">
        <template #default="scope">
          <el-button type="text" :preview-src-list="previewList" @click="shouHousePic(scope.row.house)" title="查看平面图">{{ scope.row.house }}栋</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="roomId" label="房号" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center">
        <template #default="scope">
          <span>{{ scope.row.sort }} <i class="el-icon-edit taggle-input" @click="updateSort(scope.row)" title="修改排序"></i></span>
        </template>
      </el-table-column>
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
      <el-table-column prop="unitPrice" label="单价(元)" align="center">
          <template #default="scope">
              {{ (scope.row.totalPrice / scope.row.area).toFixed(2) }}
          </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价(元)" align="center">
          <template #default="scope">
            <span class="text-danger">{{ (scope.row.totalPrice).toFixed(2) }}</span>
          </template>
      </el-table-column>
      <el-table-column label="3成首付(元)" align="center" >
          <template #default="scope">
            <span>{{ (scope.row.totalPrice * 0.3).toFixed(2) }}</span>
          </template>
      </el-table-column>
      <!-- <el-table-column prop="voice" label="噪音" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" min-width="320">
        <template #default="scope">
          <el-button type="danger" plain size="mini" @click="removeSpare([scope.row])">移除预选</el-button>
          <el-button v-if="type === 1" type="danger" plain size="mini" @click="addDisabled([scope.row])">设为已被选</el-button>
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
    <el-dialog v-if="isShowImport" v-model="isShowImport" title="导入预选房源列表" :close-on-click-modal="false">
      <el-upload
        action="#"
        accept=".xlsx"
        :auto-upload="false"
        :limit="1"
        :on-change="handleChange"
        :on-exceed="handleExceed"
      >
        <el-button type="success" size="small">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">仅支持.xlsx文件上传，导入的房源排序默认在当前预选列表的后面， <a class="dl-link" href="./template.xlsx" download="榕悦花园预选房源模板.xlsx">下载模板</a></div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowImport = false">取 消</el-button>
          <el-button type="primary" @click="addSpare">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- // 修改排序 -->
    <!-- <el-dialog v-if="isShowSort" v-model="isShowSort" title="修改排序" :close-on-click-modal="false">
      <el-input ></el-input>
    </el-dialog> -->
  </div>
</template>

<script>
import FloatBox from '@/components/floatBox.vue'
import { getSpareList, addSpareList, importSpareFile, removeSpareList, addDisabledList, updateSpareSort } from '@/apis'
import { vrList, houseTypeList } from '@/assets/data'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default {
  name: 'SpareList',
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
      allTotal: 0,
      queryParams: {
          currentPage: 1,
          pageSize: 20
      },
      isShowView: false,
      previewList: [],
      isShowImport: false,
      importSpareList: [],
      isShowSort: false
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
      const key = 'H' + String(roomId).substr(-2)
      return houseTypeList[house - 1][key] ? houseTypeList[house - 1][key].cx : ''
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
      if (this.queryParams.roomId && !/^[1-9][0-9]{2,3}$/.test(this.queryParams.roomId)) {
        return this.$message.error('请填写正确的房号')
      }
      this.queryParams.webType = this.type
      const res = getSpareList(this.queryParams)
      this.tableData = res.list
      this.total = res.total
      this.allTotal = res.allTotal
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
    importTable() {
      this.isShowImport = true
      this.importSpareList = []
    },
    handleChange(file) {
      if (!/.+\.xlsx$/i.test(file.name)) {
        this.$message.error('上传文件的格式不对')
        this.$refs.uploadElem.clearFiles()
        return false
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        // e.target.result = ArrayBuffer
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })

        // header: ['id', 'house', 'roomId', 'houseType', 'type', 'area', 'floor', 'direction']
        const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames], { range: 1, header: ['house', 'roomId'] })
        // json.forEach(item => {
        //   item.house = parseInt(item.house)
        //   item.roomId = Number(item.roomId)
        // })
        this.importSpareList = importSpareFile(json)
        // this.queryParams.uids = String(json).split(',')
        // this.isUploadSuccess = true
        
      }
      reader.readAsArrayBuffer(file.raw)
    },
    // 文件数校验
    handleExceed () {
      this.$message.error('一次最多只能上传一个文件')
    },
    addSpare() {
      if (!this.importSpareList || !this.importSpareList.length) {
        return this.$message.error('上传的文件没有内容')
      }
      addSpareList(this.importSpareList)
      this.queryTableList()
      this.isShowImport = false
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
    },
    updateSort (row) {
      this.$prompt('', '您想要把该房子排到第几', {
          inputPattern: /^[1-9][0-9]*$/,
          inputValue: row.sort,
          inputPlaceholder: '您想要把该房子排到第几',
          inputErrorMessage: '格式不正确，只能输入大于0整数'
        }).then(({ value }) => {
          if (value > this.allTotal) {
            return this.$message.error('修改失败，填写序号不能超过最大预选数量(' + this.allTotal + ')')
          }
          // 更新排序的接口
          updateSpareSort ({
            id: row.id,
            sort: value
          })
          this.$message.success('修改成功')
          this.queryList()
        }).catch(() => { })
    }
  }
}
</script>
