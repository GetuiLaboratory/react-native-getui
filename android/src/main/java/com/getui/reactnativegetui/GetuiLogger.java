package com.getui.reactnativegetui;

import android.util.Log;

/**
 * Created by zhourh on 2017/3/6.
 */

public class GetuiLogger {

    public static boolean ENABLE = true;

    public static final String TAG = "GetuiLogger";

    public static void log(String message){
        if (ENABLE){
            Log.d(TAG, message);
        }
    }
}
