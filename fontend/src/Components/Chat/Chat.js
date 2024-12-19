import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, Button, IconButton, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { addMessage, getAllMessage } from '../../redux/actions/chatRequest';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import url from "../../utils/url"
const socket = io(url);
const Chat = ({ user }) => {
    console.log(url)
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false); // State để điều khiển việc hiển thị chat
    const messagesEndRef = useRef(null); // Ref để scroll tới cuối tin nhắn

    // Scroll tới tin nhắn cuối cùng
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await getAllMessage(user.email);
            if (res) {
                // Sắp xếp lại các tin nhắn theo thời gian tạo (createAt)
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

    // Scroll xuống khi mở chat window
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                email: user?.email,
                message: message,
                fromId: user?.id,
            };
            addMessage({ ...messageData, room: user?.email, createAt: new Date() });
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Ngăn hành động mặc định (ví dụ: xuống dòng)
                                    handleSendMessage(); // Gọi hàm gửi tin nhắn
                                }
                            }}
                            sx={{
                                marginRight: '8px',
                                '& .MuiInputBase-root': {
                                    height: '40px',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '20px',
                                },
                            }}
                            inputProps={{
                                style: {
                                    height: '40px',
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
