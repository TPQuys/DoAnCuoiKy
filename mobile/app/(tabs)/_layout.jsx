import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms } from '@/redux/actions/roomRequest';
import { getBookingByUser } from '@/redux/actions/bookingRequest';
import { getAllDrink, getAllFood, getAllMenus } from '@/redux/actions/menuRequest';
import { getDecorePrice } from '@/redux/actions/decoreRequest';
import { Text, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [isUnmounted, setIsUnmounted] = useState(false);  // Trạng thái để kiểm soát unmount
  const router = useRouter()
  useEffect(() => {
    getAllRooms(dispatch);
    getAllMenus(dispatch);
    getAllFood(dispatch);
    getAllDrink(dispatch);
    getBookingByUser(dispatch, user);
    getDecorePrice(dispatch);
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
          title: 'Phòng',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Đặt ngay',
          tabBarButton: ({ focused, ...props }) => (
            <TouchableOpacity
              {...props}
              style={{
                backgroundColor: '#81695e', 
                width: 60,
                borderRadius:30,
                bottom:14,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TabBarIcon name={focused ? 'book' : 'book-outline'} size={25} color={'white'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Liên hệ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />
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
