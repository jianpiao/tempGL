/*   
    自定义变量和方法   全局都可以直接调用
*/

//  获取订单类型颜色
export const getOrderTypeColor = (v) => {
    switch (v) {
        case 1:
            return '#55A532'
            break;
        case 2:
            return '#6641E2'
            break;
        case 3:
            return '#41c6c7'
            break;
        case 4:
            return '#ad32c5'
            break;
        default:
            return '#55A532'
            break;
    }
}


export const empty = (refreshing,data,content) => {
    let empty = ''
    if (refreshing) {
        empty = ''
    } else {
        empty = data.length > 0 ? '' : content
    }
    return empty
} 


