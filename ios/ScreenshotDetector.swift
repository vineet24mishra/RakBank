//
//  ScreenshotDetector.swift
//  RakBank
//
//  Created by Vineet Mishra on 13/10/24.
//

#import "ScreenshotDetector.h"
#import <UIKit/UIKit.h>

@implementation ScreenshotDetector

RCT_EXPORT_MODULE(); // This macro exposes the module to React Native

// Required method to list all the events you want to send to JavaScript
- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScreenshotTaken"];
}

- (void)startObserving {
  // Add observer for screenshot detection
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(userDidTakeScreenshot:)
                                               name:UIApplicationUserDidTakeScreenshotNotification
                                             object:nil];
}

- (void)stopObserving {
  // Remove observer for screenshot detection when no longer observing
  [[NSNotificationCenter, defaultCenter] removeObserver:self
                                                  name:UIApplicationUserDidTakeScreenshotNotification
                                                object:nil];
}

// Method called when a screenshot is taken
- (void)userDidTakeScreenshot:(NSNotification *)notification {
  // Send event to React Native
  [self sendEventWithName:@"onScreenshotTaken" body:@{}];
}

@end
