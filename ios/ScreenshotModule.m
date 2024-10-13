//
//  ScreenshotModule.m
//  RakBank
//
//  Created by Vineet Mishra on 12/10/24.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <UIKit/UIKit.h>

@interface ScreenshotModule : RCTEventEmitter <RCTBridgeModule>
@end

@implementation ScreenshotModule {
  UIView *_overlayView;
  BOOL _isEnabled;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScreenshotTaken"];
}

RCT_EXPORT_METHOD(toggleScreenshot:(BOOL)isEnabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    _isEnabled = isEnabled;
    
    if (isEnabled) {
      // Remove the overlay to allow screenshots
      [self removeOverlay];
      
      // Add observer for screenshot detection
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(userDidTakeScreenshot:)
                                                   name:UIApplicationUserDidTakeScreenshotNotification
                                                 object:nil];
      
      resolve(@"Screenshot Enabled");
    } else {
      // Add overlay to block screenshot
      [self addOverlay];
      
      // Remove observer for screenshot detection
      [[NSNotificationCenter defaultCenter] removeObserver:self
                                                      name:UIApplicationUserDidTakeScreenshotNotification
                                                    object:nil];
      
      resolve(@"Screenshot Disabled");
    }
  });
}

- (void)addOverlay {
  if (!_overlayView) {
    // Create an overlay view to cover the entire window
    UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
    _overlayView = [[UIView alloc] initWithFrame:keyWindow.bounds];
    _overlayView.backgroundColor = [UIColor blackColor]; // Set to opaque black to block screenshots
    _overlayView.alpha = 0.7; // Semi-transparent, adjust as needed

    // Add the overlay to the key window
    [keyWindow addSubview:_overlayView];
  }
}

- (void)removeOverlay {
  if (_overlayView) {
    // Remove the overlay view to allow screenshots again
    [_overlayView removeFromSuperview];
    _overlayView = nil;
  }
}

// Screenshot detection method
- (void)userDidTakeScreenshot:(NSNotification *)notification {
  if (_isEnabled) {
    // Send an event to React Native when a screenshot is detected
    [self sendEventWithName:@"onScreenshotTaken" body:@{}];
  }
}

@end
