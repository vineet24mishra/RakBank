package com.rakbank;

import android.app.Activity;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.content.ContentResolver;
import android.database.ContentObserver;
import android.database.Cursor;
import android.os.Handler;

import java.util.Objects;

public class ScreenshotModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private ContentObserver contentObserver;
//    private final Activity activity;

    public ScreenshotModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ScreenshotModule";
    }
    @NonNull
    @ReactMethod
    public void toggleScreenshot(boolean isEnabled, Promise promise) {
        final Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("Activity is null", "Current activity is not available");
            return;
        }

        // Run on UI thread to avoid CalledFromWrongThreadException
        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (isEnabled) {
                    System.out.println("isEnabled ====>>>");
                    startListening();
                    currentActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE); // Enable screenshot
                    promise.resolve("Screenshot Enabled");
                } else {
                    System.out.println("isEnabled NOT ====>>>");
                    stopListening();
                    currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE); // Disable screenshot
                    promise.resolve("Screenshot Disabled");
                }
            }
        });
    }

    private void startListening() {
        if (contentObserver == null) {
            contentObserver = new ContentObserver(new Handler()) {
                @Override
                public void onChange(boolean selfChange) {
                    super.onChange(selfChange);
                    detectScreenshot();
                }

                @Override
                public void onChange(boolean selfChange, Uri uri) {
                    super.onChange(selfChange, uri);
                    detectScreenshot();
                }
            };

            ContentResolver resolver = reactContext.getContentResolver();
            resolver.registerContentObserver(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, true, contentObserver);
        }
    }

    private void stopListening() {
        if (contentObserver != null) {
            reactContext.getContentResolver().unregisterContentObserver(contentObserver);
            contentObserver = null;
        }
    }


    private void detectScreenshot() {
        // Check the MediaStore for new images in the screenshots directory
        Uri screenshotsUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        String[] projection = { MediaStore.Images.Media.DATA };

        try (Cursor cursor = reactContext.getContentResolver().query(screenshotsUri, projection, null, null, MediaStore.Images.Media.DATE_ADDED + " DESC")) {
            if (cursor != null && cursor.moveToFirst()) {
                String screenshotPath = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA));
                if (screenshotPath != null && screenshotPath.contains("Screenshots")) {
                    // Emit the screenshot event to React Native
                    emitScreenshotEvent();
                }
            }
        }
    }

    private void emitScreenshotEvent() {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScreenshotTaken", null);
        }
    }

}
