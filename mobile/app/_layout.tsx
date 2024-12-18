import { Stack, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from '@/redux/store';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Đăng nhập',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Đăng kí',
          }}
        />
        <Stack.Screen
          name="resetPasswordEmail"
          options={{
            title: 'Đặt lại mật khẩu',
          }}
        />
        <Stack.Screen
          name="(tabs)"
        />
        <Stack.Screen
          name="(booking)"
        />
      </Stack>
    </Provider>
  );
}
