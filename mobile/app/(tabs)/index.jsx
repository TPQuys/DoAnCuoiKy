import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper'; // Sử dụng react-native-paper cho nút
// import Header from '../Header/Header'; // Giả định Header vẫn còn được sử dụng

const HomePage = () => {
 
  return (
      <ScrollView contentContainerStyle={styles.homeBody}>
        {renderContentBox(
          "Sảnh sự kiện diễn ra",
          "Nhà hàng cung cấp gói sự kiện như tiệc cưới, hội nghị, tiệc cá nhân đa dạng về loại hình cho mọi người thoải mái lựa chọn",
          "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_lobby.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2xvYmJ5LmpwZWciLCJpYXQiOjE3Mjc4OTE0NTYsImV4cCI6MTc1OTQyNzQ1Nn0.k-RnOmYq9JeJSMToDeYN-ztbswvpWrf__GYNe35hDA0&t=2024-10-02T17%3A50%3A55.704Z",
          { email: "quy097255@gmail.com" }
        )}
        {renderContentBox(
          "Thực đơn tiếp đãi",
          "Tùy thuộc vào loại hình sự kiện mà thực đơn sẽ phù hợp theo khẩu vị của khách hàng",
          "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_menu.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX21lbnUuanBlZyIsImlhdCI6MTcyNzg5MTU4MywiZXhwIjoxNzU5NDI3NTgzfQ.XjBLtDi_lLPgFYXSN6MGNRF8jOUL6pZQ3pe3AOvzhgU&t=2024-10-02T17%3A53%3A03.097Z"
        )}
        {renderContentBox(
          "Trang trí sự kiện",
          "Đội ngũ trang trí sự kiện luôn tỷ mĩ và chuyên cần để phục vụ tận tâm nhu cầu của khách hàng",
          "https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/home_decor.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC9ob21lX2RlY29yLmpwZyIsImlhdCI6MTcyNzg5MTYwNiwiZXhwIjoxNzU5NDI3NjA2fQ.vq7vUyhpKjumPL2FH86q-mZiRoBVXKa_Q6B2hEHLpWM&t=2024-10-02T17%3A53%3A26.577Z"
        )}
      </ScrollView>
  );
};

const renderContentBox = (title, text, imageUrl) => {
  return (
      <View style={styles.contentCenter}>
        <View style={styles.textBox}>
          <Text style={styles.contentTitle}>{title}</Text>
          <Text style={styles.contentText}>{text}</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.contentImg} />
        <Button
            mode="contained"
            style={styles.button}
          >
            Chi tiết
          </Button>
      </View>
  );
};

const styles = StyleSheet.create({
  homeBody: {
    padding: 30,
    backgroundColor: '#fff3d1',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap:10,
    marginTop:10,
    borderBottomWidth:2,
    borderBottomColor:"lightgrey",
    borderRadius:10,
    paddingBottom:10
  },
  textBox: {
    flex: 1,
  },
  contentTitle: {
    alignSelf:"center",
    fontSize: 30,
    color: '#e5cc5f',
    fontWeight: '600',
  },
  contentText: {
    fontSize: 14,
    color: '#81695e',
    textAlign: 'justify',
    margin:10
  },
  contentImg: {
    width: "100%",
    height: 240,
    resizeMode:'cover',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#64463c',
  },
});

export default HomePage;
