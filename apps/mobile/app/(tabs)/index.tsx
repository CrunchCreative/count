import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950">
      <Text className="text-2xl font-medium text-amber-400">Count</Text>
      <Text className="mt-2 text-sm text-neutral-400">
        NativeWind smoke test
      </Text>
    </View>
  );
}