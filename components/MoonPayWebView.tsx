import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import { createMoonPaySdkConfig, generateAndSignUrl } from '../config/moonpay';
import { useUser } from '../contexts/UserContext';

type WidgetVariant = 'inapp-browser' | 'webview';

export function MoonPayWebView() {
  const { userMetadata } = useUser();
  const [signature, setSignature] = useState<string | null>(null);

  const sdkConfig = createMoonPaySdkConfig(userMetadata?.publicAddress || '');

  const { ready, generateUrlForSigning, updateSignature, MoonPayWebViewComponent } = useMoonPaySdk({
    sdkConfig,
  });

  useEffect(() => {
    if (ready && !signature) {
      generateAndSignUrl(generateUrlForSigning).then((newSignature) => {
        if (newSignature) {
          setSignature(newSignature);
          updateSignature(newSignature);
        }
      });
    }
  }, [ready, generateUrlForSigning, signature, updateSignature]);

  if (!ready) return null;

  return (
    <View>
      <MoonPayWebViewComponent />
    </View>
  );
}

