import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Dùng icon từ Expo Vector Icons

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerText}>CÔNG TY CỔ PHẦN EVENTIUH</Text>
        <Text style={styles.footerText}>12 Nguyễn Văn Bảo, Phường 3, Gò Vấp, Hồ Chí Minh</Text>
        <Text style={styles.footerText}>
          <Text onPress={() => Linking.openURL('https://iuh.edu.vn')} style={styles.linkText}>
            https://iuh.edu.vn/
          </Text>
        </Text>
        <Text style={styles.footerText}>09712312322</Text>

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="facebook" 
            size={30} 
            color="blue" 
            onPress={() => Linking.openURL('https://www.facebook.com')} 
          />
          <MaterialCommunityIcons 
            name="email" 
            size={30} 
            color="black" 
            onPress={() => Linking.openURL('mailto:info@eventiuh.com')} 
          />
          <MaterialCommunityIcons 
            name="web" 
            size={30} 
            color="green" 
            onPress={() => Linking.openURL('https://iuh.edu.vn')} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginTop: 20,
  },
  footerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
    marginVertical: 2,
  },
  linkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  }
});

export default Footer;
