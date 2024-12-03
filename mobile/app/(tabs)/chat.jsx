import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

const TawkScreen = () => {
    const curentUser = useSelector((state) => state.auth.login.currentUser);

    const [loading, setLoading] = useState(true);

    const userName = 'John Doe'; // Tên người dùng bạn muốn đặt

    const injectedJavaScript = `
        Tawk_API.onLoad = function() {
            Tawk_API.setAttributes({
                name: '${curentUser.user.email}', 
            });
        };
    `;

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200ea" />
                </View>
            )}
            <WebView
                originWhitelist={['*']}
                source={{ uri: 'https://tawk.to/chat/674b27722480f5b4f5a62a5d/1idup45v4' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={injectedJavaScript}  // Inject script để đặt tên người dùng
                onLoadEnd={() => setLoading(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});

export default TawkScreen;
