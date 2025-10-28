import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack
    screenOptions={{ 
      // headerShown:false,
      title:"Beli Pulsa"
     }}
    >
      <Stack.Screen name="pulsa" options={{ title: 'Beli Pulsa' }} />
      <Stack.Screen name="pln" options={{ title: 'Bayar Listrik' }} />
      <Stack.Screen name="game" options={{ title: 'Beli Voucher Game' }} />
    </Stack>
  );
}