export const isLogin = data => {    //  登录状态
    return {
        type: 'IS_LOGIN',
        text: data
    }
}

export const setNewOrder = data => {    //  最新订单
    return {
        type:'SET_NEW_ORDER',
        text: data
    }
}

export const setDoneOrder = data => {   // 首页已完成订单 
    return {
        type: 'SET_DONE_ORDER',
        text: data
    }
}

export const setCleanWare = data => {   //  首页清理餐具
    return {
        type: 'SET_CLEAN_WARE',
        text: data
    }
}

export const setTableDelivery = data => {   //  首页桌面上菜
    return {
        type: 'SET_TABLE_DELIVERY',
        text: data
    }
}

export const setShopInfo = data => {    //  获取店铺信息
    data.reserve_order = data.reserve_order == 1 ? true : false
    data.online_order = data.online_order == 1 ? true : false
    data.reception_order = data.reception_order == 1 ? true : false
    data.tabletop_order = data.tabletop_order == 1 ? true : false
    return {
        type: 'SET_SHOP_INFO',
        text: data
    }
}

export const setAccount = data => { //  获取账户信息
    return {
        type: 'SET_ACCOUNT',
        text: data
    }
}

export const getNotice = data => {  //  通知
    return {
        type: 'GET_NOTICE',
        text: data
    }
}

export const rollImg = data => {  //  轮播图
    return {
        type: 'ROLL_IMG',
        text: data
    }
}

export const goodsType = data => {  //  商品类型
    return {
        type: 'GOODS_TYPE',
        text: data
    }
}

export const associated = data => {  //  双拼
    return {
        type: 'ASSOCIATED',
        text: data
    }
}

export const getGoodsList = data => {  //  获取商品列表
    return {
        type: 'GET_GOODS_LIST',
        text: data
    }
}

export const getGoodsItem = data => {  //  获取单个商品详情信息
    return {
        type: 'GET_GOODS_ITEM',
        text: data
    }
}

export const refund = data => {  //  退款/售后
    return {
        type: 'REFUND',
        text: data
    }
}

export const getAllRefund = data => {  //  所有售后
    return {
        type: 'GET_ALL_REFUND',
        text: data
    }
}

export const workerList = data => {  //  职工
    return {
        type: 'WORKER_LIST',
        text: data
    }
}

export const getWallet = data => {  //  钱包
    return {
        type: 'GET_WALLET',
        text: data
    }
}

export const getClassify = data => {  //  商品分类列表
    return {
        type: 'GET_CLASSIFY',
        text: data
    }
}

export const isRefreshing = data => {  //  下拉刷新状态
    return {
        type: 'IS_REFRESHING',
        text: data
    }
}

export const shopGoodsCategoryList = data => {  //  店铺分类列表
    return {
        type: 'SHOP_GOODS_CATEGORY_LIST',
        text: data
    }
}

export const systemGoodsCategoryList = data => {  //  系统分类列表
    return {
        type: 'SYSTEM_GOODS_CATEGORY_LIST',
        text: data
    }
}

export const getTransactions = data => {  //  交易记录
    return {
        type: 'GET_TRANSACTIONS',
        text: data
    }
}

export const initialRefundPage = data => {  //  默认售后页面值
    return {
        type: 'INITIAL_REFUND_PAGE',
        text: data
    }
}

export const setModalVisible = data => {  //  设置弹出框状态
    return {
        type: 'SET_MODAL_VISIBLE',
        text: data
    }
}

export const authority = data => {  //  权限状态列表
    return {
        type: 'AUTHORITY',
        text: data
    }
}

export const printList = data => {  //  打印机
    return {
        type: 'PRINT_LIST',
        text: data
    }
}

export const todayIncome = data => {  //  今日收入
    return {
        type: 'TODAY_INCOME',
        text: data
    }
}

export const todayTop = data => {  //  十佳热销
    return {
        type: 'TODAY_TOP',
        text: data
    }
}

export const todayDown = data => {  //  十份低消
    return {
        type: 'TODAY_DOWN',
        text: data
    }
}

export const appVersion = data => {  //  软件版本
    return {
        type: 'APP_VERSION',
        text: data
    }
}

export const promotions = data => {  //  广告
    return {
        type: 'PROMOTIONS',
        text: data
    }
}
 
export const upGoods = data => {  //  上架
    return {
        type: 'UP_GOODS',
        text: data
    }
}

export const downGoods = data => {  //  下架
    return {
        type: 'DOWN_GOODS',
        text: data
    }
}