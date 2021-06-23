import { houseList } from '@/assets/data'

let spareList = JSON.parse(localStorage.getItem('spareList')) || []
let disabledList = JSON.parse(localStorage.getItem('disabledList')) || []

// 获取房源列表
export const getAllHouseList = ({ currentPage, pageSize, house, type, houseType, direction, floor }) => {
    const filterList = houseList.filter(houseItem => {
        let [isDisable, isHouse, isType, isHouseType, isDirection, isFloor] = [false, true, true, true, true, true]
        // 过滤禁用列表
        isDisable = disabledList.some(item => item.id === houseItem.id)
        if (isDisable) return false
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
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
    })
    return {
        list: arr,
        total: filterList.length
    }
}

// // 获取预选列表
export const getSpareList = ({ currentPage, pageSize, house, type, houseType, direction, floor }) => {
    const filterList = spareList.filter(houseItem => {
        let [isDisable, isHouse, isType, isHouseType, isDirection, isFloor] = [false, true, true, true, true, true]
        // 过滤禁用列表
        isDisable = disabledList.some(item => item.id === houseItem.id)
        if (isDisable) return false
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
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

// 移出预选列表
export const removeSpareList = list => {
    spareList = spareList.filter(spareItem => {
        return !list.some(item => spareItem.id === item.id)
    })
    localStorage.setItem('spareList', JSON.stringify(spareList))
}

// 获取被选列表
export const getDisabledList = ({ currentPage, pageSize, house, type, houseType, direction, floor }) => {
    const filterList = disabledList.filter(houseItem => {
        let [isHouse, isType, isHouseType, isDirection, isFloor] = [true, true, true, true, true]
        // 过滤筛选条件
        if (house && house.length) {
            isHouse = house.some(item => houseItem.house === item)
        }
        if (!isHouse) return false
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
