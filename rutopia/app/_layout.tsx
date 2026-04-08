import { Slot, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppProvider, useApp } from '../context/AppContext';

function RootNav() {
  const { usuario } = useApp();
  const [listo, setListo] = useState(false);

  useEffect(() => { setListo(true); }, []);

  useEffect(() => {
    if (!listo) return;
    if (!usuario) router.replace('/login');
    else router.replace('/(tabs)');
  }, [usuario, listo]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNav />
    </AppProvider>
  );
}