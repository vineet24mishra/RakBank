#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTEventEmitter.h> // Import RCTEventEmitter for sending events to JS

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"RakBank";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Add observer for screenshot detection
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(userDidTakeScreenshot:)
                                               name:UIApplicationUserDidTakeScreenshotNotification
                                             object:nil];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Screenshot detection method
- (void)userDidTakeScreenshot:(NSNotification *)notification {
  // Send an event to React Native when a screenshot is detected
  [self sendEventWithName:@"onScreenshotTaken" body:@{}];
}

// Required for emitting events to React Native
- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScreenshotTaken"];
}

@end
