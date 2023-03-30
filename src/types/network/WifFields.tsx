export default interface WifiFields {
  ssid: string;
  setSsid: (ssid: string) => void;
  password: string;
  setPassword: (passwd: string) => void;
}
