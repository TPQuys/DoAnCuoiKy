import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms } from '@/redux/actions/roomRequest';
import { getBookingByUser } from '@/redux/actions/bookingRequest';
import { getAllMenus } from '@/redux/actions/menuRequest';

export default function TabLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [isUnmounted, setIsUnmounted] = useState(false);  // Trạng thái để kiểm soát unmount
  const router = useRouter()
  useEffect(() => {
    getAllRooms(dispatch);
    getAllMenus(dispatch);
    getBookingByUser(dispatch, user);
  }, [dispatch, user]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#81695e',
        headerShown: false,
        unmountOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="room"
        options={{
          title: 'Đặt phòng',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
          
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // e.preventDefault();  // Ngừng hành động mặc định (chuyển tab)
            if (isUnmounted) {
              router.push(route.name);
            } else {
              setIsUnmounted(true);
            }
          },
        })}
      />
    </Tabs>
  );
}
