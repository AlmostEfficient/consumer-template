import { useEffect, useState } from 'react';
import { View, Modal, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import { createMoonPaySdkConfig, generateAndSignUrl } from '../config/moonpay';
import { useUser } from '../contexts/UserContext';

export function MoonPayWebView({ isVisible = true, onClose }: { isVisible?: boolean, onClose?: () => void }) {
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
		<Modal
			animationType="slide"
			visible={isVisible}
			presentationStyle="fullScreen"
		>
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<View style={{
					flexDirection: 'row',
					padding: 16,
					borderBottomWidth: 1,
					borderBottomColor: '#E5E5E5',
				}}>
					<TouchableOpacity onPress={onClose}>
						<Text>← Back</Text>
					</TouchableOpacity>
				</View>

				<View style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}>
					<MoonPayWebViewComponent
						style={{
							flex: 1,
							width: '100%',
							height: '100%'
						}}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

