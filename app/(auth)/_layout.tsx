import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name='welcome'/>
      <Stack.Screen name='signin'/>
      <Stack.Screen name='signup'/>
    </Stack>
  );
}