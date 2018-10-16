import { combineReducers } from 'redux';
import data from './data';


//  改变数据
function counter(state = data, action) {
    switch (action.type) {
        case 'IS_LOGIN':
            return { ...state, isLogin: action.text }    
        case 'SET_NEW_ORDER':
            return { ...state, newOrder: action.text }    
        case 'SET_DONE_ORDER':
            return { ...state, doneOrder: action.text }
        case 'SET_CLEAN_WARE':
            return { ...state, cleanWare: action.text }
        case 'SET_TABLE_DELIVERY':
            return { ...state, tableDelivery: action.text }
        case 'SET_SHOP_INFO': 
            return { ...state, shop: action.text }
        case 'SET_ACCOUNT': 
            return { ...state, account: action.text }
        case 'GET_NOTICE':
            return {...state, notice: action.text }
        case 'ROLL_IMG':
            return { ...state, rollImg: action.text }
        case 'GOODS_TYPE':
            return { ...state, goodsType: action.text }
        case 'ASSOCIATED':
            return { ...state, associated: action.text }
        case 'GET_GOODS_LIST':
            return { ...state, getGoodsList: action.text }
        case 'GET_GOODS_ITEM':
            return { ...state, getGoodsItem: action.text }
        case 'GET_CLASSIFY':
            return { ...state, classify: action.text }
        case 'REFUND':
            return { ...state, refund: action.text }
        case 'GET_ALL_REFUND':
            return { ...state, allRefund: action.text }
        case 'WORKER_LIST':
            return { ...state, workerList: action.text }
        case 'GET_WALLET':
            return { ...state, wallet: action.text }
        case 'IS_REFRESHING':
            return { ...state, refreshing: action.text }
        case 'SHOP_GOODS_CATEGORY_LIST':
            return { ...state, shopGoodsCategoryList: action.text }
        case 'SYSTEM_GOODS_CATEGORY_LIST':
            return { ...state, systemGoodsCategoryList: action.text }
        case 'GET_TRANSACTIONS':
            return { ...state, transactions: action.text }
        case 'INITIAL_REFUND_PAGE':
            return { ...state, initialRefundPage: action.text }
        case 'SET_MODAL_VISIBLE':
            return { ...state, modalVisible: action.text }
        case 'AUTHORITY':
            return { ...state, authority: action.text }
        case 'PRINT_LIST':
            return { ...state, printList: action.text }
        case 'TODAY_INCOME':
            return { ...state, todayIncome: action.text }
        case 'TODAY_TOP':
            return { ...state, todayTop: action.text }
        case 'TODAY_DOWN':
            return { ...state, todayDown: action.text }
        case 'APP_VERSION':
            return { ...state, appVersion: action.text }
        case 'PROMOTIONS':
            return { ...state, promotions: action.text }
        case 'UP_GOODS':
            return { ...state, upGoods: action.text }
        case 'DOWN_GOODS':
            return { ...state, downGoods: action.text }
        default:
            return state;
    }
}

export default combineReducers({
    counter
});