package com.creuto.rnappsplash

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class RNAppSplashModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private enum class Status {
        VISIBLE,
        TRANSITIONING,
        HIDDEN
    }

    private var status: Status = Status.VISIBLE
    private var splashView: View? = null

    override fun getName(): String {
        return "RNAppSplash"
    }

    @ReactMethod
    fun hide(promise: Promise) {
        val currentActivity: Activity? = currentActivity

        if (currentActivity == null) {
            // Activity is not currently attached, set status to HIDDEN safely
            status = Status.HIDDEN
            promise.resolve(true)
            return
        }

        if (status == Status.HIDDEN) {
            promise.resolve(true)
            return
        }

        UiThreadUtil.runOnUiThread {
            try {
                status = Status.TRANSITIONING

                // If a splash view overlay was attached, remove it smoothly
                val decorView = currentActivity.window?.decorView as? ViewGroup
                if (splashView != null && decorView != null) {
                    splashView?.animate()
                        ?.alpha(0f)
                        ?.setDuration(250)
                        ?.withEndAction {
                            decorView.removeView(splashView)
                            splashView = null
                            status = Status.HIDDEN
                            promise.resolve(true)
                        }
                        ?.start()
                } else {
                    status = Status.HIDDEN
                    promise.resolve(true)
                }
            } catch (e: Exception) {
                status = Status.HIDDEN
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun show(promise: Promise) {
        val currentActivity: Activity? = currentActivity

        if (currentActivity == null) {
            promise.resolve(false)
            return
        }

        if (status == Status.VISIBLE) {
            promise.resolve(true)
            return
        }

        UiThreadUtil.runOnUiThread {
            try {
                status = Status.VISIBLE
                promise.resolve(true)
            } catch (e: Exception) {
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun isVisible(promise: Promise) {
        promise.resolve(status == Status.VISIBLE || status == Status.TRANSITIONING)
    }

    @ReactMethod
    fun getVisibilityStatus(promise: Promise) {
        when (status) {
            Status.VISIBLE -> promise.resolve("visible")
            Status.TRANSITIONING -> promise.resolve("transitioning")
            Status.HIDDEN -> promise.resolve("hidden")
        }
    }
}
