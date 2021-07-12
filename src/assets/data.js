import HouseList from './houseList.json'
import PriceList from './priceList.json'

const getPriceItem = (house, roomId) => {
    let priceItem = {}
    for (let i = 0; i < PriceList.length; i++) {
        const pItem = PriceList[i]
        if (house === pItem.house && roomId === pItem.roomId) {
            priceItem = pItem
            break
        }
    }
    return priceItem
}

// 处理localStorage
const doLocalStoragePrice = () => {
    let spareList = localStorage.getItem('spareList')
    let disabledList = localStorage.getItem('disabledList')
    if (spareList) {
        spareList = JSON.parse(spareList)
        if (!spareList[0].totalPrice) {
            spareList.forEach(item => {
                const priceItem = PriceList[item.id - 1]
                if (priceItem.house === item.house && priceItem.roomId === item.roomId) {
                    item.totalPrice = priceItem.totalPrice
                } else {
                    const pItem = getPriceItem(item.house, item.roomId)
                    item.totalPrice = pItem.totalPrice
                }
            })
            localStorage.setItem('spareList', JSON.stringify(spareList))
        }
    }
    if (disabledList) {
        disabledList = JSON.parse(disabledList)
        if (!disabledList[0].totalPrice) {
            disabledList.forEach(item => {
                const priceItem = PriceList[item.id - 1]
                if (priceItem.house === item.house && priceItem.roomId === item.roomId) {
                    item.totalPrice = priceItem.totalPrice
                } else {
                    const pItem = getPriceItem(item.house, item.roomId)
                    item.totalPrice = pItem.totalPrice
                }
            })
            localStorage.setItem('disabledList', JSON.stringify(disabledList))
        }
    }
}
doLocalStoragePrice()

// A1 A2 B1 B2 C1 C2 D1 D2 E1 E2 F1 F2
export const houseTypeList = [
    { H01: { hx: 'C1', cx: '变电站' }, H02: { hx: 'A2', cx: '小区北' }, H03: { hx: 'A1', cx: '小区北' }, H04: { hx: 'D2', cx: '小区北' }, H05: {hx: 'C1', cx: '2栋' }, H06: { hx: 'A2', cx: '幼儿园' }, H07: { hx: 'A1', cx: '幼儿园' }, H08: { hx: 'C2', cx: '变电站' }},
    { H01: { hx: 'D1', cx: '小区北' }, H02: { hx: 'A2', cx: '小区北' }, H03: { hx: 'A1', cx: '小区北' }, H04: { hx: 'D2', cx: '小区北' }, H05: {hx: 'E1', cx: '幼儿园' }, H06: { hx: 'F2', cx: '幼儿园' }, H07: { hx: 'B2', cx: '幼儿园' }},
    { H01: { hx: 'D1', cx: '小区北' }, H02: { hx: 'A2', cx: '小区北' }, H03: { hx: 'A1', cx: '小区北' }, H04: { hx: 'C1', cx: '售楼部' }, H05: {hx: 'C2', cx: '售楼部' }, H06: { hx: 'A2', cx: '幼儿园' }, H07: { hx: 'A1', cx: '幼儿园' }, H08: { hx: 'C1', cx: '2栋' }},
    { H01: { hx: 'C1', cx: '售楼部' }, H02: { hx: 'A2', cx: '花园' }, H03: { hx: 'A1', cx: '花园' }, H04: { hx: 'C2', cx: '售楼部' }, H05: {hx: 'C1', cx: '售楼部' }, H06: { hx: 'A2', cx: '马路' }, H07: { hx: 'A1', cx: '马路' }, H08: { hx: 'D1', cx: '马路' }},
    { H01: { hx: 'B1', cx: '幼儿园' }, H02: { hx: 'F2', cx: '幼儿园' }, H03: { hx: 'E2', cx: '幼儿园' }, H04: { hx: 'D2', cx: '马路' }, H05: {hx: 'A2', cx: '马路' }, H06: { hx: 'A1', cx: '马路' }, H07: { hx: 'D1', cx: '马路' }},
    { H01: { hx: 'C1', cx: '7栋' }, H02: { hx: 'A2', cx: '幼儿园' }, H03: { hx: 'A1', cx: '幼儿园' }, H04: { hx: 'C2', cx: '5栋' }, H05: {hx: 'D2', cx: '马路' }, H06: { hx: 'A2', cx: '马路' }, H07: { hx: 'A1', cx: '马路' }, H08: { hx: 'C2', cx: '7栋' }}
]

export const imgList = {
    a: require('@/assets/img/a.jpg'),
    b: require('@/assets/img/b.jpg'),
    c: require('@/assets/img/c.jpg'),
    d: require('@/assets/img/d.jpg'),
    e: require('@/assets/img/e.jpg'),
    f: require('@/assets/img/f.jpg')
}

// export let spareList = JSON.parse(localStorage.getItem('spareList')) || []

// export let disabledList = JSON.parse(localStorage.getItem('disabledList')) || []

export const houseList = HouseList.map(houseItem => {
    const res = String(houseItem.roomId).match(/^([1-9]\d?)(\d\d)$/)
    const key = 'H' + res[2]
    houseItem.houseType = houseTypeList[houseItem.house - 1][key].hx
    houseItem.floor = Number(res[1])
    houseItem.face = houseTypeList[houseItem.house - 1][key].cx
    houseItem.voice = '--'
    const priceItem = PriceList[houseItem.id - 1]
      if (priceItem.house === houseItem.house && priceItem.roomId === houseItem.roomId) {
        houseItem.totalPrice = priceItem.totalPrice
      } else {
        const pItem = getPriceItem(houseItem.house, houseItem.roomId)
        houseItem.totalPrice = pItem.totalPrice
      }
    return houseItem
})

/** 3栋 { H01: 'D1', H02: 'A2', H03: 'A1', H04: 'C1', H05: 'C2', H06: 'A2', H07: 'A1', H08: 'C1' }
 * 1601 两房 D1 https://720yun.com/t/d7vkcyq9dr9?scene_id=62180065
 * 1602 三房 A2 https://720yun.com/t/c1vkcyq9zil?scene_id=62184998
 * 1605 两房 C2 https://720yun.com/t/43vkcyq9Opb?scene_id=62186195
 * 1607 三房 A1 https://720yun.com/t/83vkcyq97dq?scene_id=62187863
 * 1608 两房 C1 https://720yun.com/t/1dvkcyqyrf9?scene_id=62188549
 * 
 * 1901 两房 D1 https://720yun.com/t/8avkcw87r1l?scene_id=62761749
 * 1905 两房 C2 https://720yun.com/t/59vkcw870qb?scene_id=62764666
 * 1906 三房 A2 https://720yun.com/t/21vkcw87gr7?scene_id=62766696
 * 1908 两房 C1 https://720yun.com/t/b3vkcw8q58y?scene_id=62769893
*/
export const vrList = {
  A1: 'https://720yun.com/t/83vkcyq97dq?scene_id=62187863',
  A2: ['https://720yun.com/t/c1vkcyq9zil?scene_id=62184998', 'https://720yun.com/t/21vkcw87gr7?scene_id=62766696'],
  B1: '',
  B2: '',
  C1: ['https://720yun.com/t/1dvkcyqyrf9?scene_id=62188549', 'https://720yun.com/t/b3vkcw8q58y?scene_id=62769893'],
  C2: ['https://720yun.com/t/43vkcyq9Opb?scene_id=62186195', 'https://720yun.com/t/59vkcw870qb?scene_id=62764666'],
  D1: ['https://720yun.com/t/d7vkcyq9dr9?scene_id=62180065', 'https://720yun.com/t/8avkcw87r1l?scene_id=62761749'],
  D2: '',
  E1: '',
  E2: '',
  F1: '',
  F2: ''
}
