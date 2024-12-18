import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { addMessage, getAllMessage } from '@/redux/actions/chatRequest';
import { useSelector } from 'react-redux';

const socket = io('http://192.168.2.144:8000');

const Chat = () => {
    const curentUser = useSelector((state) => state.auth.login.currentUser);
    const user = curentUser?.user;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to the bottom of the chat when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await getAllMessage(user?.email, curentUser);
            if (res) {
                const sortedMessages = res.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
                setMessages(sortedMessages);
            }
        };
        getAllMessages();
    }, [user]);

    useEffect(() => {
        if (user?.role) {
            socket.emit('setRole', user?.role);
        }

        if (user?.email) {
            socket.emit('registerUser', user?.email);
        }

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, message];
                return updatedMessages.slice(-30); // Keep only the latest 30 messages
            });
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                email: user?.email,
                message: message,
                fromId: user?.id,
            };
            addMessage({ ...messageData, room: user?.email, createAt: new Date() }, curentUser);
            socket.emit('sendMessageToRoom', { FromID: user?.id, room: user?.email, message: messageData });
            setMessage('');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Chat Messages */}
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: item.email === user?.email ? 'flex-end' : 'flex-start',
                                marginBottom: 2,
                                paddingHorizontal: 15,
                            }}
                        >
                            {item.email !== user?.email && (
                                <View style={{ marginRight: 8 }}>
                                    <Text style={{ backgroundColor: '#ccc', borderRadius: 50, padding: 4, color: '#fff', height: 40, width: 40, fontSize: 24, textAlign: 'center' }}>
                                        H
                                    </Text>
                                </View>
                            )}
                            <View
                                style={{
                                    padding: 8,
                                    borderRadius: 20,
                                    backgroundColor: item.email === user?.email ? '#0078d4' : '#f0f0f0',
                                    color: item.email === user?.email ? '#fff' : '#000',
                                    maxWidth: '80%',
                                }}
                            >
                                <Text style={{ color: item.email === user?.email ? '#fff' : '#000' }}>
                                    {item.message}
                                </Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ref={messagesEndRef}
                    onContentSizeChange={() => scrollToBottom()}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 10,
                            borderTopWidth: 1,
                            borderTopColor: '#ddd',
                            paddingBottom: 20
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                height: 40,
                                padding: 10,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                marginRight: 8,
                            }}
                            placeholder="Type a message"
                            value={message}
                            onChangeText={setMessage}
                            onSubmitEditing={handleSendMessage}
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            style={{
                                backgroundColor: '#0078d4',
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
        </View>
    );
};

export default Chat;
