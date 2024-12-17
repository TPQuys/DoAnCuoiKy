import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, Button, IconButton, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { getAllMessage } from '../../redux/actions/chatRequest';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';

const socket = io('http://localhost:8000');

const Chat = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State để điều khiển việc hiển thị chat
    const messagesEndRef = useRef(null); // Ref để scroll tới cuối tin nhắn

    // Scroll tới tin nhắn cuối cùng
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const getMessage = async () => {
            if (user.email) {
                const res = await getAllMessage(user.email);
                if (res) {
                    setMessages(res?.slice(-30)); // Lấy 30 tin nhắn mới nhất
                }
            }
        };
        getMessage();
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
                return updatedMessages.slice(-30); // Chỉ giữ 30 tin nhắn mới nhất
            });
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [user]);

    // Scroll xuống dưới cùng mỗi khi messages thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const toggleChatWindow = () => {
        setIsOpen((prev) => !prev); // Đảo ngược trạng thái mở/đóng chat
    };

    return (
        <>
            {/* Nút để mở/đóng chat */}
            <Button
            onClick={toggleChatWindow}
            sx={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                backgroundColor: '#00796b',
                color: '#fff',
                borderRadius: '50%',  // Đảm bảo border-radius là 50% để nút tròn
                height: '60px',  // Kích thước chiều cao của nút
                width: '60px',  // Kích thước chiều rộng của nút, để nút có dạng tròn
                boxShadow: 3,
                '&:hover': { backgroundColor: '#004d40' },
            }}
        >
            {isOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
        </Button>

            {/* Giao diện chat */}
            {isOpen && (
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
                        bottom: '80px', // Cách nút một chút để không bị chồng lên
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

                        {/* Thẻ dummy để cuộn tới */}
                        <div ref={messagesEndRef} />
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
                            sx={{
                                marginRight: '8px',
                                '& .MuiInputBase-root': {
                                    height: '40px', // Điều chỉnh chiều cao của input
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '20px', // Để bo tròn góc nếu muốn
                                }
                            }}
                            inputProps={{
                                style: {
                                    height: '40px', // Đảm bảo chiều cao input là 40px
                                },
                            }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            sx={{ backgroundColor: '#0078d4', color: '#fff', width: "40px", height: "40px" }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Chat;
