import Endpoints  from "./UrlEndPoints";

export interface PublicIPAddress {
    ipAddress: string;
  }

  export interface DeviceDetails {
    os: string;
    deviceName: string;
    macAddress: string;
    imei: string;
    location: string;
    ipAddress: string;
    screenshotStatus: boolean;
  }
  
  type ApiCallback<T> = (error: Error | null, data: T | null) => void;
  
  export const fetchPublicIpAddress = (callback: ApiCallback<PublicIPAddress>) => {
    fetch(Endpoints.PUBLIC_IP_ADDRESS)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((jsonData: PublicIPAddress) => {
        console.log('PublicIPAddress ---->>>', jsonData);
        
        callback(null, jsonData);
      })
      .catch(error => {
        callback(error, null);
      });
  };

  export const sendDeviceDetails = async (deviceDetails: DeviceDetails, callback: ApiCallback<DeviceDetails>
  ) => {
    fetch(Endpoints.DEVICE_DETAILS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceDetails),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send device details');
        }
        return response.json();
      })
      .then((jsonData: DeviceDetails) => {
        callback(null, jsonData);
      })
      .catch(error => {
        callback(error, null);
      });
  };