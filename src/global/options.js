 //图片选择器参数设置
const options = {
    title: '',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    noData: false,
    qulity: 1,
    maxWidth: 600,
    maxHeight: 360,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default options;