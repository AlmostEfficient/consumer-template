import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import { useEffect, useState } from 'react';
import { createMoonPaySdkConfig, generateAndSignUrl } from '@/config/moonpay';
import { useUser } from '@/contexts/UserContext';

export default function MoonPay() {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MoonPayWebViewComponent style={styles.webview} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});