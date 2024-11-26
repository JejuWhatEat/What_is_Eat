import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="Allergic" options={{ title: 'Allergic' }} />
      <Stack.Screen name="PreferedFood" options={{ title: 'PreferedFood' }} />
      <Stack.Screen name="UnPreferedFood" options={{ title: 'UnPreferedFood' }} />
    </Stack>
  );
}
