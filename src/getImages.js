import { useImages } from './theme/images';

useImages({
	splashScreen: {
		logo: require('../assets/images/placeholder.png')
	},
	loginAndRegistration: {
		header: require('../assets/images/placeholder.png')
	},
	onboarding: {
    deviceDiscovery: require('../assets/images/placeholder.png'),
    devicesNotFound: require('../assets/images/placeholder.png'),
    wifiSetup: require('../assets/images/placeholder.png'),
    wifiSetupSuccess: require('../assets/images/placeholder.png'),
		wifiSetupError: require('../assets/images/placeholder.png'),
		deviceIcon:{
			'blufi_device': require('../assets/images/placeholder.png')
		},
		wifiSignalIcon: {
			excellent:require('../assets/images/onboarding/wifiSignal/excellent.png'),
			good:require('../assets/images/onboarding/wifiSignal/good.png'),
			fair:require('../assets/images/onboarding/wifiSignal/fair.png'),
			poor:require('../assets/images/onboarding/wifiSignal/poor.png')
		},
		rssiSignalIcon: {
			excellent:require('../assets/images/onboarding/rssiSignal/excellent.png'),
			good:require('../assets/images/onboarding/rssiSignal/good.png'),
			fair:require('../assets/images/onboarding/rssiSignal/fair.png'),
			poor:require('../assets/images/onboarding/rssiSignal/poor.png')
		}
	}
})
