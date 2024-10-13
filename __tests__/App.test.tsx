/**
 * @format
 */

// import 'react-native';
// import React from 'react';
// import App from '../App';

// // Note: import explicitly to use the types shipped with jest.
// import {it} from '@jest/globals';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App'; // Import the main component
//import ScreenshotModule from '../__mocks__/ScreenshotModule'; // Mocked ScreenshotModule

import moduleName from '../__mocks__/ScreenshotModule';



// Mocking the ScreenshotModule in Jest
jest.mock('react-native', () => {
  return {
    NativeModules: {
      ScreenshotModule: ScreenshotModule,
    },
  };
});

describe('App Component', () => {
  test('should render the app logo and button', () => {
    const { getByText, getByRole } = render(<App />);
    const activateButton = getByRole('button');
    expect(getByText('Screenshot is Disabled')).toBeTruthy();
    expect(activateButton).toBeTruthy();
    expect(activateButton.props.title).toBe('Activate');
  });

  test('should enable screenshot on button press', async () => {
    const { getByRole, getByText } = render(<App />);
    const activateButton = getByRole('button');

    // Trigger button press
    fireEvent.press(activateButton);

    // Wait for promise resolution
    await waitFor(() => {
      expect(ScreenshotModule.toggleScreenshot).toHaveBeenCalledWith(true);
      expect(getByText('Screenshot is Enabled')).toBeTruthy();
      expect(activateButton.props.title).toBe('Activated');
    });
  });

  test('should disable screenshot on second button press', async () => {
    const { getByRole, getByText } = render(<App />);
    const activateButton = getByRole('button');

    // First press (enable screenshot)
    fireEvent.press(activateButton);
    await waitFor(() => {
      expect(ScreenshotModule.toggleScreenshot).toHaveBeenCalledWith(true);
    });

    // Second press (disable screenshot)
    fireEvent.press(activateButton);
    await waitFor(() => {
      expect(ScreenshotModule.toggleScreenshot).toHaveBeenCalledWith(false);
      expect(getByText('Screenshot is Disabled')).toBeTruthy();
      expect(activateButton.props.title).toBe('Activate');
    });
  });

  test('should show alert when screenshot is enabled', async () => {
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByRole } = render(<App />);
    const activateButton = getByRole('button');

    // Trigger button press to enable screenshot
    fireEvent.press(activateButton);

    // Wait for promise resolution
    await waitFor(() => {
      expect(ScreenshotModule.toggleScreenshot).toHaveBeenCalledWith(true);
      expect(alertSpy).toHaveBeenCalledWith('Screenshot Enabled');
    });

    alertSpy.mockRestore();
  });
});

