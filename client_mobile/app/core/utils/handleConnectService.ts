const GOOGLE_SERVICE_NAMES = ['calendar', 'drive', 'gmail', 'youtube'];

export const getGoogleServiceName = (serviceName: string) => {
  const isGoogleService = serviceName.toLowerCase().startsWith('google');
  if (isGoogleService) {
    return serviceName.split(' ')[1];
  }
  return serviceName.toLowerCase();
};

export const handleConnectService = (
  serviceName: string,
  authorizeService: (serviceType: string, serviceName: string) => void,
) => {
  const googleServiceName = getGoogleServiceName(serviceName);
  if (GOOGLE_SERVICE_NAMES.includes(googleServiceName)) {
    authorizeService('google', googleServiceName);
  } else if (serviceName === 'spotify') {
    authorizeService('spotify', 'spotify');
  } else if (serviceName === 'github') {
    authorizeService('github', 'github');
  } else if (serviceName === 'teams') {
    authorizeService('microsoft', 'teams');
  }
};
