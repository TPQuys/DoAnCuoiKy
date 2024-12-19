import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';

// Tạo kết nối socket với server
const socket = io('http://localhost:8000');

const UserPage = () => {
    const user = useSelector((state) => state.auth.login.currentUser)?.user;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState('USER');

    useEffect(() => {
        setRole(user?.role);
        console.log(user?.role);

        socket.emit('setRole', role);
        socket.emit('registerUser', user?.email);  // Đăng ký người dùng với email

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [role, user]);

    // Gửi tin nhắn tới admin
    const sendMessageToAdmin = () => {
        if (message) {
            const messageData = {
                email: user?.email,
                message: message,
            };
            socket.emit('sendMessageToRoom', messageData);
            setMessage('');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: '20px' }}>
                User Chat
            </Typography>

            <Box sx={{ marginBottom: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                    Chat with Admin
                </Typography>

                {/* List messages */}
                <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', padding: 2 }}>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            {msg.email !== user?.email && (
                                <Avatar sx={{ width: 30, height: 30, marginRight: 2 }}>A</Avatar>
                            )}
                            <ListItemText
                                primary={<strong>{msg.email}</strong>}
                                secondary={msg.message}
                                sx={{
                                    backgroundColor: msg.email === user?.email ? '#0078d4' : '#f0f0f0',
                                    borderRadius: '10px',
                                    padding: '8px 12px',
                                    color: msg.email === user?.email ? '#fff' : '#000',
                                    width: '100%',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ marginRight: '10px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessageToAdmin}
                    sx={{ padding: '10px 20px' }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default UserPage;
