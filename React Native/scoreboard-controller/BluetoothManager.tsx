/* eslint-disable no-bitwise */

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

import { Buffer } from "buffer";

const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";


interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    setCommand(command : string): Promise<void>;
    setCommandEncoded(command : string): Promise<void>;
    connectedDevice: Device | null;
    allDevices: Device[];
  }

  function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  
    const requestAndroid31Permissions = async () => {
      const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Permissão de localização",
          message: "Conexão Bluetooth necessita de localização",
          buttonPositive: "OK",
        }
      );
      const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Permissão de localização",
          message: "Conexão Bluetooth necessita de localização",
          buttonPositive: "OK",
        }
      );
      const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permissão de localização",
          message: "Conexão Bluetooth necessita de localização",
          buttonPositive: "OK",
        }
      );
  
      return (
        bluetoothScanPermission === "granted" &&
        bluetoothConnectPermission === "granted" &&
        fineLocationPermission === "granted"
      );
    };
  
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Permissão de localização",
                message: "Conexão Bluetooth necessita de localização",
                buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const isAndroid31PermissionsGranted =
            await requestAndroid31Permissions();
  
          return isAndroid31PermissionsGranted;
        }
      } else {
        return true;
      }
    };
  
    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
      devices.findIndex((device) => nextDevice.id === device.id) > -1;
  
    const scanForPeripherals = () =>
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
        }
        if (device && device.name?.includes("SCOREBOARD")) {
          //if (device ) {
          setAllDevices((prevState: Device[]) => {
            if (!isDuplicteDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      });
  
    const connectToDevice = async (device: Device) => {
      try {
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        bleManager.stopDeviceScan();
      } catch (e) {
        console.log("FAILED TO CONNECT", e);
      }
    };
  
    const disconnectFromDevice = () => {
      if (connectedDevice) {
        bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
      }
    };

    const encodeStringToBase64 = (value: string) => {
      console.log(Buffer.from(value).toString("base64"));
      return Buffer.from(value).toString("base64");
    };

    const setCommandEncoded = async (command : string) => { 

      if (connectedDevice){

          await bleManager

          .writeCharacteristicWithResponseForDevice( 
      
              connectedDevice.id,
              SERVICE_UUID,
              CHARACTERISTIC_UUID,
              encodeStringToBase64(command)
                ).then (command =>{ 
             
             console.log('Write success: ', command); 
             
             }).catch(error=>{ 
             
             console.log('Write Failed: ', error); 
             
             }) 
      } 
  };
    
    const setCommand = async (command : string) => { 

        if (connectedDevice){

            await bleManager

            .writeCharacteristicWithResponseForDevice( 
        
                connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, command).then (command =>{ 
               
               console.log('Write success: ', command); 
               
               }).catch(error=>{ 
               
               console.log('Write Failed: ', error); 
               
               }) 
        } 
    };
  
    return {
      scanForPeripherals,
      requestPermissions,
      connectToDevice,
      allDevices,
      connectedDevice,
      disconnectFromDevice,
      setCommand,
      setCommandEncoded,
    };
  }
  
  export default useBLE;