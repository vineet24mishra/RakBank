import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  NativeEventEmitter,
  Platform,
  StyleSheet,
  NativeModules
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import BtnWithIcon from './src/component/BtnWithIcon';
import Locale from './src/utils/Locale';
import Colors from './src/utils/Colors';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Constants from './src/utils/Constants';
import {fetchPublicIpAddress, PublicIPAddress, sendDeviceDetails, DeviceDetails} from './src/network/ApiCall';


const { ScreenshotModule } = NativeModules;
 

const App = () => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [screenshotFeatureDetails, setScreenshotFeatureDetails] = useState<string>('');
  const [isScreenshotTaken, setIsScreenshotTaken] = useState<boolean>(false);

  // useEffect(() => {
  //   if (isActivated) {
  //     // Listen for screenshot events and alert user
  //     const screenshotListener = () => {
  //       Alert.alert('Screenshot Taken', 'You took a screenshot');
  //     };

  //     // Placeholder for setting up screenshot detection.
  //     // Set up your listener based on platform.
  //   }
  // }, [isActivated]);


  

  useEffect(() => {
    
    const eventEmitter = new NativeEventEmitter(ScreenshotModule);
    // console.log('NativeEventEmitter ---->>>', eventEmitter);


    // Listen for the screenshot event
    const subscription = eventEmitter.addListener('onScreenshotTaken', () => {
      Alert.alert('Screenshot detected!', 'A screenshot was taken.');

      // Call the API when a screenshot is taken
    });

    // Clean up the listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    getPublicIpAddressApiCall();
  }, []);


  const getPublicIpAddressApiCall = () => {
    fetchPublicIpAddress((err, data) => {
      if (err) {
        console.log(`Fetch Post Error ---- ${err.message}`);
      } else {
        console.log('data --->>>', data);
        
        setIpAddress(data?.ip);
      }
    });
  }



  const requestLocationPermission = async () => {
    try {
      let permission;
  
      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }
  
      const result = await check(permission);
  
      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          // Permission granted
          return true;
        } else {
          // Permission denied
          Alert.alert(Locale.locationPersmissonDeniedTitle, Locale.locationPersmissonDeniedMsg);
          return false;
        }
      } else if (result === RESULTS.GRANTED) {
        // Permission already granted
        return true;
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(Locale.locationPersmissonBlockedTitle, Locale.locationPersmissonBlockedMsg);
        return false;
      }
    } catch (error) {
      console.warn(error);
      return false;
    }
  };


  const networkCall = async(screenshotResponse: string) => {
    await submitDeviceDetails(screenshotResponse)
  }

  const toggleScreenshot = async () => {

    const hasPermission = await requestLocationPermission();



  if (hasPermission) {
      try {
        const response =  await ScreenshotModule.toggleScreenshot(isActivated);
        console.log('response ----->>>>', response);
        
        setIsActivated(!isActivated);
        if (response === Constants.SCREENSHOT_ENABLED) {
            setScreenshotFeatureDetails(response)
        }else{
          setScreenshotFeatureDetails(response)
          networkCall(response)
        }
      } catch (error) {
        console.log('error after permission --->>', error)
        // Alert.alert('Error', error.message);
      }
  }
  };

  const submitDeviceDetails = async (screenshotStatus: string) => {
    setIsLoading(true);
    const deviceDetails: DeviceDetails = {
      os: Platform.OS,
      deviceName: await DeviceInfo.getDeviceName(),
      macAddress: await DeviceInfo.getMacAddress(),
      imei: await DeviceInfo.getUniqueId(),
      location: await getLocation(),
      ipAddress: ipAddress,
      screenshotStatus,
    };

    sendDeviceDetails(deviceDetails, (err, data) => {
      setIsLoading(false);
      if (err) {
        console.log(`Fetch Post Error ---- ${err.message}`);
      } else {
        console.log('data --->>>', data);
      }
    });

    console.log('deviceDetails -->>>', deviceDetails);
  };

  const getLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  return (
    <View style={style.container}>
      <Image source={require('./src/assets/img/demo.png')} style={style.logo} />
      <BtnWithIcon title={!isActivated ? Locale.activated : Locale.activate}
        condition={isActivated}
        onPress={toggleScreenshot}/>
      {isLoading && <ActivityIndicator size="large" color={Colors.ActivityIndicatorColor} />}
    </View>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: { 
    width: 100, 
    height: 100 
  },
})
