import { Stack, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from '@/redux/store';

export default function BookingLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="bookingPage"
          options={{
            title: 'Đặt phòng',
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            title: 'thanh toán',
          }}
        />
      </Stack>
    </Provider>
  );
}
