import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { StyleSheet, Image } from 'react-native';
import tabNav from './TabNavigator';
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
// import StackViewStyleInterpolator from "react-navigation-stack/src/views/StackView/StackViewStyleInterpolator";
//  页面动画
const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps;
        const { route } = scene;
        const params = route.params || {};
        const transition = params.transition || 'forFadeFromBottomAndroid';
        return StackViewStyleInterpolator[transition](sceneProps);
    },
});

const headerStyle = {
    backgroundColor: '#fff',
    elevation: 0,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.8
}


//  首页
import OrderDetailesScreen from '../src/page/order-details/orderDetails';           //  订单详情
import CleanWareScreen from '../src/page/cleanWare/cleanWare';                      //  清理餐具
import DeliveryScreen from '../src/page/delivery/delivery';                         //  桌面上菜
import CompleteScreen from '../src/page/complete/complete';                         //  已完成



//  管理页面 ↓
import AddGoodsScreen from '../src/page/managePage/addGoods/index';                 //  添加商品 ↓
import RollImgScreen from '../src/page/managePage/addGoods/rollImage/index';        //  轮播图 ↓
import GoodsTypeScreen from '../src/page/managePage/addGoods/goodsType/index';      //  套餐类型 ↓
import AssociatedScreen from '../src/page/managePage/addGoods/associated/index';    //  双拼 ↓
import ManageGoodsScreen from '../src/page/managePage/goodsList/index';             //  管理信息 ↓
import GoodsItemScreen from '../src/page/managePage/goodsList/goodsInfo/index';     //  商品管理列表 ↓
import ClassifyScreen from '../src/page/managePage/classify/index';                 //  类别管理 ↓ 
import WalletScreen from '../src/page/managePage/wallet/index';                     //  钱包 ↓
import RefundScreen from '../src/page/managePage/refund/index';                     //  退款/售后 ↓
import WorkerScreen from '../src/page/managePage/worker/index';                     //  职工
import WorkerDetailScreen from '../src/page/managePage/worker/workerDetail/index';  //  职工详情
import AddWorkerScreen from '../src/page/managePage/worker/addWorker/index';        //  添加职工
import AdvertisedScreen from '../src/page/managePage/advertised/index';             //  广告


//  设置页面组件
import PrintScreen from '../src/page/setting/print/index';                          //  打印
import SettingScreen from '../src/page/setting/setting/setting';                    //  设置
import ShopScreen from '../src/page/setting/shop/shop';                             //  店铺信息
import AccountScreen from '../src/page/setting/account/account';                    //  账户信息
import FeedbackScreen from '../src/page/setting/feedback/feedback';                 //  反馈
import NoticeScreen from '../src/page/setting/notice/notice';                       //  通知
import NoticeDetailScreen from '../src/page/setting/notice/noticeDetail/index';     //  通知内容详情
import RuleScreen from '../src/page/setting/rule/rule';                             //  规则
import AboutScreen from '../src/page/setting/about/about';                          //  关于
import ModifyPasswordScreen from '../src/page/setting/modifyPassword/modifyPassword';//  修改密码

//  统计页面
import TransactionsScreen from '../src/page/totalPage/transactions/index';          //  订单记录
import CountScreen from '../src/page/totalPage/count/index';                        //  总计

//  公共组件
import TextInputScreen from '../src/global/components/textinput.js';                //  输入框
import PhotoBrowserSceneScreen from '../src/global/components/photoBrowserScene/index';//  查看照片
import SearchScreen from '../src/page/search/search';                               //  搜索

//  登录注册
import LoginScreen from '../src/page/login/login/index';                            //  登录
import LogupScreen from '../src/page/login/logup/index';                            //  注册
import SelectShopScreen from '../src/page/login/selectShop/index';                  //  选择店铺
import ForgetPasswordScreen from '../src/page/login/forgetPassword/index';          //  忘记密码


//  首页启动广告
import AdvertisementScreen from '../src/page/advertisement/index';                  //  启动广告

const LoginPage = createSwitchNavigator({
    Login: LoginScreen
},{
    initialRouteName: 'Login',
    resetOnBlur:true
})


// 初始化StackNavigator
export default MyApp = createStackNavigator({
    // 将TabNavigator包裹在StackNavigator里面可以保证跳转页面的时候隐藏tabbar
    Advertisement: {
        screen: AdvertisementScreen,
        navigationOptions: {
            header: null,
        }
    },
    tabNav: {
        screen: tabNav,
        navigationOptions: {
            header: null,
        }
    },
    OrderDetailes: {
        screen: OrderDetailesScreen,
        navigationOptions: ()=>({
            title: '订单详情',
            headerStyle: headerStyle,
        })
    },
    Search: {
        screen: SearchScreen
    },
    CleanWare: {
        screen: CleanWareScreen,
        navigationOptions: () =>({
            title: '待收餐具',
            headerStyle: headerStyle
        })
    },
    Delivery: {
        screen: DeliveryScreen,
        navigationOptions: ()=>({
            title: '待上菜',
            headerStyle: headerStyle
        })
    },
    Complete: {
        screen: CompleteScreen,
        navigationOptions: () => ({
            title: '今日完成',
            headerStyle: headerStyle
        })
    },

    //  管理
    AddGoods: {
        screen: AddGoodsScreen,
        navigationOptions: () => ({
            title: '添加商品',
            headerStyle: headerStyle
        })
    },
    //  添加商品
    Roll: {
        screen: RollImgScreen,
        navigationOptions: {
            title: '轮播图',
            headerStyle: headerStyle
        }
    },
    GoodsType: {
        screen: GoodsTypeScreen,
        navigationOptions: {
            title: '套餐类型',
            headerStyle: headerStyle
        }
    },
    Associated: {
        screen: AssociatedScreen,
        navigationOptions: {
            title: '双拼',
            headerStyle: headerStyle
        }
    },
    //  管理商品
    ManageGoods: {
        screen: ManageGoodsScreen,
        navigationOptions: {
            title: '商品列表',
            headerStyle: headerStyle
        }
    },
    GoodsItem: {
        screen: GoodsItemScreen,
        navigationOptions: {
            title: '管理商品',
            headerStyle: headerStyle
        }
    },
    Classify: {
        screen: ClassifyScreen,
        navigationOptions: {
            title: '类别管理',
            headerStyle: headerStyle
        }
    },
    Wallet: {
        screen: WalletScreen,
        navigationOptions: {
            title: '钱包',
            headerStyle: headerStyle
        }
    },
    Refund: {
        screen: RefundScreen,
        navigationOptions: {
            title: '售后',
            headerStyle: {
                backgroundColor: '#fff',
                elevation: 0
            }
        }
    },
    Worker: {
        screen: WorkerScreen,
        navigationOptions: {
            title: '职工',
            headerStyle: headerStyle
        }
    },
    WorkerDetail: {
        screen: WorkerDetailScreen,
        navigationOptions: {
            title: '职工详情',
            headerStyle: headerStyle
        }
    },
    AddWorker: {
        screen: AddWorkerScreen,
        navigationOptions: {
            title: '添加职工',
            headerStyle: headerStyle
        }
    },
    Advertised: {
        screen: AdvertisedScreen,
        navigationOptions: {
            headerStyle: headerStyle
        }
    },

    //  设置
    Print: {
        screen: PrintScreen,
        navigationOptions: {
            title: '打印机连接'
        }
    },
    Setting: {
        screen: SettingScreen,
        navigationOptions: {
            title: '设置'
        }
    },
    Account: {
        screen: AccountScreen,
        navigationOptions:{
            title: '账户'
        }
    },
    Shop: {
        screen: ShopScreen,
        navigationOptions: {
            title: '店铺'
        }
    },
    Feedback: {
        screen: FeedbackScreen,
        navigationOptions: {
            title: '反馈'
        }
    },
    Notice: {
        screen: NoticeScreen,
        navigationOptions: {
            title: '通知'
        }
    },
    NoticeDetail: {
        screen: NoticeDetailScreen,
        navigationOptions: {
            title: '通知内容'
        }
    },
    Rule: {
        screen: RuleScreen,
        navigationOptions: {
            title: '规则'
        }
    },
    About: {
        screen: AboutScreen,
        navigationOptions: {
            title: '关于'
        }
    },
    ModifyPassword: {
        screen: ModifyPasswordScreen,
        navigationOptions: {
            title: '修改密码'
        }
    },

    //  交易记录
    Transactions: {
        screen: TransactionsScreen,
        navigationOptions: {
            title: '交易记录',
            headerStyle: headerStyle
        }
    },
    Count: {
        screen: CountScreen,
        navigationOptions: {
            header: null,
            // title: '总计'
        }
    },

    //  登录注册
    Login: {
        screen: LoginPage,
        navigationOptions: {
            header: null
        }
    },
    Logup: {
        screen: LogupScreen,
        navigationOptions: {
            title: '注册',
            headerStyle: headerStyle
            // header: null
        }
    },
    SelectShop : {
        screen: SelectShopScreen,
        navigationOptions: {
            title: '店铺选择',
            headerStyle: headerStyle
        }
    },
    ForgetPassword: {
        screen: ForgetPasswordScreen,
        navigationOptions: {
            title: '忘记密码',
            headerStyle: headerStyle
        }
    },

    //  公共页面
    Textinput: {
        screen: TextInputScreen
    },
    Photo: {
        screen: PhotoBrowserSceneScreen
    },
    Search: {
        screen: SearchScreen
    }
}, {
        // transitionConfig: TransitionConfiguration
        
        //  设置打开应用默认显示的页面
        // initialRouteName: tabNav,
    });