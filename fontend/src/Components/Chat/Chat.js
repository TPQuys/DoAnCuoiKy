import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, IconButton, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { getAllMessage } from '../../redux/actions/chatRequest';

// Tạo kết nối socket với server
const socket = io('http://localhost:8000');

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const getMessage = async () => {
            if (user.email) {
                const res = await getAllMessage(user.email)
                console.log(res)
                setMessages(res)
            }
        }
        getMessage()
    }, [user])
    // Xử lý khi component được mount và thay đổi thông tin người dùng
    useEffect(() => {
        console.log(user?.role);

        if (user?.role) {
            socket.emit('setRole', user?.role);
        }

        if (user?.email) {
            socket.emit('registerUser', user?.email);  // Đăng ký người dùng với email
        }

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        console.log(messages)

        return () => {
            socket.off('receiveMessage');
        };
    }, [user]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                email: user?.email,
                message: message,
                fromId: user?.id
            };
            socket.emit('sendMessageToRoom', { FromID: user?.id, room: user?.email, message: messageData });
            setMessage('');
        }
    };

    return (
        <Box
            sx={{
                width: '300px',
                height: '400px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: 1000,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px',
                }}
            >
                <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '10px' }}>
                    Chat
                </Typography>

                {/* Messages */}
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            justifyContent: msg.email === user?.email ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {msg.email !== user?.email && (
                            <Avatar sx={{ width: 24, height: 24, marginRight: '8px' }}>H</Avatar>
                        )}
                        <Box
                            sx={{
                                padding: '8px 12px',
                                borderRadius: '20px',
                                backgroundColor: msg.email === user?.email ? '#0078d4' : '#f0f0f0',
                                color: msg.email === user?.email ? '#fff' : '#000',
                            }}
                        >
                            {msg.message}
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Input Field */}
            <Box
                sx={{
                    display: 'flex',
                    padding: '10px',
                    borderTop: '1px solid #ddd',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ marginRight: '8px' }}
                />
                <IconButton
                    onClick={handleSendMessage}
                    sx={{ backgroundColor: '#0078d4', color: '#fff' }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chat;
