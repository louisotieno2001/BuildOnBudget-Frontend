import appJson from './app.json';

const apiUrl =
  process.env.EXPO_PUBLIC_BOB_API_URL ||
  process.env.BOB_API_URL;

const googleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  '';

export default ({ config }: { config: Record<string, any> }) => {
  const base = (appJson as any).expo || {};

  return {
    expo: {
      ...base,
      ios: {
        ...base.ios,
        googleMapsApiKey,
      },
      android: {
        ...base.android,
        config: {
          ...(base.android && base.android.config ? base.android.config : {}),
          googleMaps: {
            ...((base.android && base.android.config && base.android.config.googleMaps)
              ? base.android.config.googleMaps
              : {}),
            apiKey: googleMapsApiKey,
          },
        },
      },
      extra: {
        ...base.extra,
        googleMapsApiKey,
        apiUrl,
      },
    },
  };
};