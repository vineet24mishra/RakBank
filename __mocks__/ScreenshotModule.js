export default {
    toggleScreenshot: jest.fn((isEnabled) => {
      return new Promise((resolve) => {
        resolve(isEnabled ? "Screenshot Enabled" : "Screenshot Disabled");
      });
    }),
    addScreenshotListener: jest.fn(),
    removeScreenshotListener: jest.fn(),
  };