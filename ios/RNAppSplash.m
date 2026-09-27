#import "RNAppSplash.h"
#import <React/RCTUtils.h>

typedef NSString *RNAppSplashStatus;
static RNAppSplashStatus const StatusVisible = @"visible";
static RNAppSplashStatus const StatusTransitioning = @"transitioning";
static RNAppSplashStatus const StatusHidden = @"hidden";

@implementation RNAppSplash {
    RNAppSplashStatus _currentStatus;
    UIView *_splashOverlayView;
}

RCT_EXPORT_MODULE(RNAppSplash);

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (instancetype)init {
    if (self = [super init]) {
        _currentStatus = StatusVisible;
        _splashOverlayView = nil;
    }
    return self;
}

RCT_EXPORT_METHOD(hide:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if ([_currentStatus isEqualToString:StatusHidden]) {
        resolve(@YES);
        return;
    }

    _currentStatus = StatusTransitioning;

    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *keyWindow = nil;
        if (@available(iOS 13.0, *)) {
            for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
                if (scene.activationState == UISceneActivationStateForegroundActive) {
                    for (UIWindow *window in scene.windows) {
                        if (window.isKeyWindow) {
                            keyWindow = window;
                            break;
                        }
                    }
                }
            }
        }
        if (!keyWindow) {
            keyWindow = [UIApplication sharedApplication].keyWindow;
        }

        if (self->_splashOverlayView != nil) {
            [UIView animateWithDuration:0.25
                             animations:^{
                self->_splashOverlayView.alpha = 0.0;
            } completion:^(BOOL finished) {
                [self->_splashOverlayView removeFromSuperview];
                self->_splashOverlayView = nil;
                self->_currentStatus = StatusHidden;
                resolve(@YES);
            }];
        } else {
            self->_currentStatus = StatusHidden;
            resolve(@YES);
        }
    });
}

RCT_EXPORT_METHOD(show:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if ([_currentStatus isEqualToString:StatusVisible]) {
        resolve(@YES);
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        self->_currentStatus = StatusVisible;
        resolve(@YES);
    });
}

RCT_EXPORT_METHOD(isVisible:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL visible = [_currentStatus isEqualToString:StatusVisible] || [_currentStatus isEqualToString:StatusTransitioning];
    resolve(@(visible));
}

RCT_EXPORT_METHOD(getVisibilityStatus:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve(_currentStatus);
}

@end
