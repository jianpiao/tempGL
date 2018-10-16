package com.glsyj;

import android.annotation.TargetApi;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

import com.BluetoothPrinter.BluetoothUtil;
import com.BluetoothPrinter.PrintUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Hashtable;
import java.util.List;


public class BluetoothPrinterModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    int mSelectedPosition = -1;

    final static int TASK_TYPE_CONNECT = 1;
    final static int TASK_TYPE_PRINT = 2;
    DeviceListAdapter mAdapter;
    List<BluetoothDevice> printerDevices;

    //String tag = getClass().getSimpleName();
    private BluetoothSocket mSocket;
    private BluetoothStateReceiver mBluetoothStateReceiver;
    private AsyncTask mConnectTask;
    private ProgressDialog mProgressDialog;
    JSONArray data = new JSONArray();
    String shop_name;
    String paymentQR;
    int OK = 0;
    int Print_OK = 0;

    public BluetoothPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BluetoothPrinterModule";
    }

    //调出蓝牙配对界面
    @ReactMethod
    public void PairingBluetooth()
    {
        Log.i("配对蓝牙", "调用成功");

        getReactApplicationContext().getCurrentActivity().startActivity(new Intent(Settings.ACTION_BLUETOOTH_SETTINGS));

    }

    //设置蓝牙设备科
    @ReactMethod
    public void SetBluetooth(String Address)
    {
        Log.i("设置蓝牙",Address);
        for(int i=0;i<printerDevices.size();i++){
            Log.i("ll",Address+","+printerDevices.get(i).getAddress());
            if(Address.equals( printerDevices.get(i).getAddress())){
                OK = 0;
                mSelectedPosition = i;
                showProgressDialog("请稍候...");
                connectDevice(TASK_TYPE_CONNECT);
            }
        }
    }

    //是否已连接
    @ReactMethod
    public void IsOk(Callback Callback)
    {
        WritableMap ReadableMap = new WritableNativeMap();
        if(OK == 1){
            ReadableMap.putInt("error", 0);
            ReadableMap.putString("data", "已配对成功");
        }else {
            ReadableMap.putInt("error", 1);
            ReadableMap.putString("data", "还没配对");
        }
        Callback.invoke(ReadableMap);
    }

    //测试蓝牙打印机
    @ReactMethod
    public void Test()
    {
        OK = 0;
        showProgressDialog("请稍候...");
        connectDevice(TASK_TYPE_CONNECT);
    }

    //打印
    @ReactMethod
    public void Print(String order_data, String shop_name, String payment)
    {
        JSONObject ls_data;
        paymentQR = payment;
        try {
            Log.i("打印", order_data);

            ls_data = new JSONObject(order_data);
            ls_data.put("orderID",ls_data.getString("order_number"));
            ls_data.put("shop_name" , shop_name);

            data.put(ls_data);

            Log.i("打印", data.get(0).toString());

            if(mSocket.isConnected()){
                connectDevice(TASK_TYPE_PRINT);
            }else {
                connectDevice(TASK_TYPE_CONNECT);
                connectDevice(TASK_TYPE_PRINT);
            }


        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    //获取已配对的蓝牙列表
    @ReactMethod
    public void ReturnBluetoothDevice(Callback Callback)
    {
        WritableArray DevicesList = new WritableNativeArray();
        //推荐使用 BluetoothUtil.getPairedPrinterDevices()

        //mAdapter.notifyDataSetChanged();
        printerDevices = BluetoothUtil.getPairedDevices();
        mAdapter = new DeviceListAdapter(getReactApplicationContext());
        mAdapter.clear();
        mAdapter.addAll(printerDevices);

        for(int i=0;i<printerDevices.size();i++){
            WritableMap Devices = new WritableNativeMap();

            Devices.putString("name",printerDevices.get(i).getName());
            Devices.putString("address",printerDevices.get(i).getAddress());
            DevicesList.pushMap(Devices);

        }
        Callback.invoke(DevicesList);
    }




    class DeviceListAdapter extends ArrayAdapter<BluetoothDevice> {

        public DeviceListAdapter(Context context) {
            super(context, 0);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            BluetoothDevice device = getItem(position);
            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.item_bluetooth_device, parent, false);
            }

            TextView tvDeviceName = (TextView) convertView.findViewById(R.id.tv_device_name);
            CheckBox cbDevice = (CheckBox) convertView.findViewById(R.id.cb_device);

            tvDeviceName.setText(device.getName());

            cbDevice.setChecked(position == mSelectedPosition);

            return convertView;
        }
    }

    private void connectDevice(int taskType){
        if(mSelectedPosition >= 0){
            BluetoothDevice device = mAdapter.getItem(mSelectedPosition);

            //Log.i("测试",device.getName());
            if(device!= null){
                Log.i("测试",device.getName());
                this.connectDevice(device, taskType);
            }

        }else{
            Toast.makeText(getReactApplicationContext(), "还未选择打印设备", Toast.LENGTH_SHORT).show();
        }
    }


    @TargetApi(Build.VERSION_CODES.KITKAT)
    public void onConnected(BluetoothSocket socket, int taskType) {
        Log.i("打印状态", Integer.toString(taskType));
        switch (taskType){
            case TASK_TYPE_PRINT:
                if(Print_OK == 1){
                    Print_OK = 0;
                    //Bitmap bitmap = BitmapFactory.decodeResource(getApplicationContext().getResources(), R.drawable.qr);
                    //Bitmap bitmap = toConformBitmap(encodeAsBitmap("ftdgrthyjhtyuuyjyuhkmyumkyukmuykmyukyuyumyumk"),encodeAsBitmap("unmyhjm ikiukiu,liumiu,iu,iu,iu,iu,iu,iui,yujh,mium,"));
                    Log.i("提醒","要打印啦");

                    //读入静态图片（LOGO）
                    Drawable drawable = getCurrentActivity().getResources().getDrawable(R.drawable.src_static_img_glsyj);
                    BitmapDrawable bd = (BitmapDrawable) drawable;
                    Bitmap logo = bd.getBitmap();

                    //产生Bitmap
                    Bitmap paymentQR_img = Bitmap.createBitmap(200,200, Bitmap.Config.ARGB_8888);
                    //画笔
                    Paint paint = new Paint();
                    paint.setColor(0xff000000);
                    //产生Canvas
                    Canvas cv = new Canvas(paymentQR_img);
                    cv.drawRGB(255,255,255);
                    cv.drawBitmap(paymentQR_img, 0, 0, paint);
                    cv.drawBitmap(logo, 25, 25, null);//画入LOGO
                    cv.save(Canvas.ALL_SAVE_FLAG);//保存
                    cv.restore();//存储

                    while (data.length()>0){
                        try {
                            JSONObject ls_data = data.getJSONObject(0);
                            Bitmap order_number_img = createQRImage(ls_data.getString("order_number"), 200, 200);
                            Bitmap bitmap = toConformBitmap(order_number_img, paymentQR_img);
                            PrintUtil.printTest(socket, bitmap, ls_data.getString("shop_name"), ls_data);
                            //data.remove(0);
                            JSONArray ls_JSONArray = new JSONArray();
                            for (int i=1;i<data.length();i++){
                                ls_JSONArray.put(data.getJSONObject(i));
                            }
                            data = ls_JSONArray;
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }

                    Print_OK = 1;
                    break;
                }
        }
    }




    /**
     * 蓝牙状态发生变化时回调
     */
    public void onBluetoothStateChanged(Intent intent) {

    }


    protected void onCreate(Bundle savedInstanceState) {
        this.onCreate(savedInstanceState);
        initReceiver();
    }


    public void onStop() {
        cancelConnectTask();
        closeSocket();
    }

    protected void closeSocket() {
        if (mSocket != null) {
            try {
                mSocket.close();
            } catch (IOException e) {
                mSocket = null;
                e.printStackTrace();
            }
        }
    }

    protected void cancelConnectTask() {
        if (mConnectTask != null) {
            mConnectTask.cancel(true);
            mConnectTask = null;
        }
    }

    protected void onDestroy() {
        getReactApplicationContext().getCurrentActivity().unregisterReceiver(mBluetoothStateReceiver);
        this.onDestroy();
    }

    private void initReceiver() {
        mBluetoothStateReceiver = new BluetoothStateReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
        getReactApplicationContext().getCurrentActivity().registerReceiver(mBluetoothStateReceiver, filter);
    }

    /**
     * 检查蓝牙状态，如果已打开，则查找已绑定设备
     *
     * @return
     */
    public boolean checkBluetoothState() {
        if (BluetoothUtil.isBluetoothOn()) {
            return true;
        } else {
            BluetoothUtil.openBluetooth(getReactApplicationContext().getCurrentActivity());
            return false;
        }
    }

    public void connectDevice(BluetoothDevice device, int taskType) {
        if (checkBluetoothState() && device != null) {
            mConnectTask = new ConnectBluetoothTask(taskType).execute(device);
        }
    }


    class ConnectBluetoothTask extends AsyncTask<BluetoothDevice, Integer, BluetoothSocket> {

        int mTaskType;

        public ConnectBluetoothTask(int taskType) {
            this.mTaskType = taskType;
        }

        @Override
        protected void onPreExecute() {
            showProgressDialog("请稍候...");
            super.onPreExecute();
        }

        @Override
        protected BluetoothSocket doInBackground(BluetoothDevice... params) {
            if(mSocket != null){
                try {
                    mSocket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            mSocket = BluetoothUtil.connectDevice(params[0]);
            onConnected(mSocket, mTaskType);
            return mSocket;
        }

        @Override
        protected void onPostExecute(BluetoothSocket socket) {
            if (socket == null || !socket.isConnected()) {
                toast("连接打印机失败");
            } else {
                OK = 1;
                Print_OK = 1;
                toast("连接打印机成功");
            }

            super.onPostExecute(socket);
        }
    }


    protected void showProgressDialog(String message) {
        toast(message);
    }

    protected void toast(String message) {
        Toast.makeText(getReactApplicationContext().getBaseContext(), message, Toast.LENGTH_SHORT).show();
    }

    /**
     * 监听蓝牙状态变化的系统广播
     */
    class BluetoothStateReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1);
            switch (state) {
                case BluetoothAdapter.STATE_TURNING_ON:
                    toast("蓝牙已开启");
                    break;

                case BluetoothAdapter.STATE_TURNING_OFF:
                    toast("蓝牙已关闭");
                    break;
            }
            onBluetoothStateChanged(intent);
        }
    }


    /**
     * 生成二维码 要转换的地址或字符串,可以是中文
     *
     * @param url
     * @param width
     * @param height
     * @return
     */
    public static Bitmap createQRImage(String url, final int width, final int height) {
        try {
            // 判断URL合法性
            if (url == null || "".equals(url) || url.length() < 1) {
                return null;
            }
            Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            // 图像数据转换，使用了矩阵转换
            BitMatrix bitMatrix = new QRCodeWriter().encode(url,
                    BarcodeFormat.QR_CODE, width, height, hints);
            int[] pixels = new int[width * height];
            // 下面这里按照二维码的算法，逐个生成二维码的图片，
            // 两个for循环是图片横列扫描的结果
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (bitMatrix.get(x, y)) {
                        pixels[y * width + x] = 0xff000000;
                    } else {
                        pixels[y * width + x] = 0xffffffff;
                    }
                }
            }
            // 生成二维码图片的格式，使用ARGB_8888
            Bitmap bitmap = Bitmap.createBitmap(width, height,
                    Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static  Bitmap toConformBitmap(Bitmap background, Bitmap foreground) {
        if( background == null ) {
            return null;
        }

        int bgWidth = background.getWidth();
        int bgHeight = background.getHeight();
        int fgWidth = foreground.getWidth();
        int fgHeight = foreground.getHeight();

        Paint paint = new Paint();
        paint.setColor(0xff000000);

        //create the new blank bitmap 创建一个新的和SRC长度宽度一样的位图
        Bitmap newbmp = Bitmap.createBitmap(bgWidth+fgWidth, bgHeight, Bitmap.Config.ARGB_8888);

        Canvas cv = new Canvas(newbmp);
        cv.drawRGB(255,255,255);
        cv.drawBitmap(newbmp, 0, 0, paint);
        //draw bg into
        cv.drawBitmap(background, -16, 0, null);//在 0，0坐标开始画入bg
        //draw fg into
        cv.drawBitmap(foreground, bgWidth-16, 0, null);//在 0，0坐标开始画入fg ，可以从任意位置画入
        //save all clip
        cv.save(Canvas.ALL_SAVE_FLAG);//保存
        //store
        cv.restore();//存储
        return newbmp;
    }
}

