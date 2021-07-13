import { houseList } from '@/assets/data'

let spareList = JSON.parse(localStorage.getItem('spareList')) || []
let disabledList = JSON.parse(localStorage.getItem('disabledList')) || []

// 获取房源列表
export const getAllHouseList = ({ currentPage, pageSize, house, roomId, type, houseType, direction, floor, sortBy, sortType }) => {
    houseList.sort((a, b) => {
        if (sortBy === 'unitPrice') {
            return sortType === 'ascending' ? a.totalPrice / a.area - b.totalPrice / b.area : sortType === 'descending' ? b.totalPrice / b.area - a.totalPrice / a.area : a.id - b.id
        }
        return sortType === 'ascending' ? a[sortBy] - b[sortBy] : sortType === 'descending' ? b[sortBy] - a[sortBy] : a.id - b.id
    })
    const filterList = houseList.filter(houseItem => {
        let [isHouse, isRoom, isType, isHouseType, isDirection, isFloor] = [true, true, true, true, true, true]
        // 过滤禁用列表
        // isDisable = disabledList.some(item => item.id === houseItem.id)
        // if (isDisable) return false
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
        if (roomId) {
          isRoom = houseItem.roomId === Number(roomId)
        }
        if (!isRoom) return false
        if (type) {
            isType = houseItem.type === type
        }
        if (!isType) return false
        if (houseType && houseType.length) {
            isHouseType = houseType.some(item => houseItem.houseType.indexOf(item) === 0)
        }
        if (!isHouseType) return false
        if (direction && direction.length) {
            isDirection = direction.some(item => houseItem.direction === item)
        }
        if (!isDirection) return false
        if (floor && floor.length) {
            isFloor = floor.some(item => houseItem.floor === item)
        }
        if (!isFloor) return false
        return true
        // return !isDisable && isHouse && isType && isHouseType && isDirection && isFloor
    })
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const arr = filterList.slice(start, end)
    arr.forEach(item => {
      item.isSpare = spareList.some(spareItem => spareItem.id === item.id)
      item.isDisabled = disabledList.some(disabledItem => disabledItem.id === item.id)
    })
    return {
        list: arr,
        total: filterList.length
    }
}

// 导入预约列表
export const importSpareFile = xlsxJson => {
    const list = houseList.filter(item => {
        return xlsxJson.some(xlsxItem => parseInt(xlsxItem.house) === item.house && Number(xlsxItem.roomId) === item.roomId)
    })
    return list
}

// // 获取预选列表
export const getSpareList = ({ currentPage, pageSize, house, roomId, type, houseType, direction, floor, webType }) => {
    const filterList = spareList.filter(houseItem => {
        let [isDisable, isHouse, isRoom, isType, isHouseType, isDirection, isFloor] = [false, true, true, true, true, true, true]
        // 过滤禁用列表
        if (webType === 1) {
          isDisable = disabledList.some(item => item.id === houseItem.id)
          if (isDisable) return false
        }
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
        if (roomId) {
          isRoom = houseItem.roomId === Number(roomId)
        }
        if (!isRoom) return false
        if (type) {
            isType = houseItem.type === type
        }
        if (!isType) return false
        if (houseType && houseType.length) {
            isHouseType = houseType.some(item => houseItem.houseType.indexOf(item) === 0)
        }
        if (!isHouseType) return false
        if (direction && direction.length) {
            isDirection = direction.some(item => houseItem.direction === item)
        }
        if (!isDirection) return false
        if (floor && floor.length) {
            isFloor = floor.some(item => houseItem.floor === item)
        }
        if (!isFloor) return false
        return true
    })
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const arr = filterList.slice(start, end)
    return {
        list: arr,
        total: filterList.length,
        allTotal: spareList.length
    }
}

// 加入预选列表
export const addSpareList = list => {
    // const spareIds = list.map(item => item.id)
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (!spareList.some(spareItem => spareItem.id === item.id)) {
        spareList.push(item)
      }
    }
    localStorage.setItem('spareList', JSON.stringify(spareList))
}
// 修改预选排序
export const updateSpareSort = ({ id, sort }) => {
    // debugger
    let delIdx = null
    spareList.some((spareItem, idx) => {
        if (spareItem.id === id) {
            delIdx = idx
        }
        return spareItem.id === id
    })
    const sortItem = spareList.splice(delIdx, 1)
    spareList.splice(sort - 1, 0, ...sortItem)
    spareList.forEach((item, idx) => {
        item.sort = idx + 1
    })
    localStorage.setItem('spareList', JSON.stringify(spareList))
}

// 移出预选列表
export const removeSpareList = list => {
    spareList = spareList.filter(spareItem => {
        return !list.some(item => spareItem.id === item.id)
    })
    localStorage.setItem('spareList', JSON.stringify(spareList))
}

// 获取被选列表
export const getDisabledList = ({ currentPage, pageSize, house, roomId, type, houseType, direction, floor }) => {
    const filterList = disabledList.filter(houseItem => {
        let [isHouse, isRoom, isType, isHouseType, isDirection, isFloor] = [true, true, true, true, true, true]
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
        if (roomId) {
            isRoom = houseItem.roomId === Number(roomId)
        }
        if (!isRoom) return false
        if (type) {
            isType = houseItem.type === type
        }
        if (!isType) return false
        if (houseType && houseType.length) {
            isHouseType = houseType.some(item => houseItem.houseType.indexOf(item) === 0)
        }
        if (!isHouseType) return false
        if (direction && direction.length) {
            isDirection = direction.some(item => houseItem.direction === item)
        }
        if (!isDirection) return false
        if (floor && floor.length) {
            isFloor = floor.some(item => houseItem.floor === item)
        }
        if (!isFloor) return false
        return true
    })
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const arr = filterList.slice(start, end)
    return {
        list: arr,
        total: filterList.length
    }
}

// 加入被选列表
export const addDisabledList = list => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (!disabledList.some(spareItem => spareItem.id === item.id)) {
      disabledList.push(item)
    }
  }
  // disabledList = disabledList.concat(list)
  // disabledList = Array.from(new Set(disabledList))
  localStorage.setItem('disabledList', JSON.stringify(disabledList))
}

// 移出预选列表
export const removeDisabledList = list => {
    disabledList = disabledList.filter(disItem => {
        return !list.some(item => disItem.id === item.id)
    })
    localStorage.setItem('disabledList', JSON.stringify(disabledList))
}
