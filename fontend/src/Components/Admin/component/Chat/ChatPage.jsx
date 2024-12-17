import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, List, ListItem, Divider, Avatar, Card } from '@mui/material';
import io from 'socket.io-client';
import { getAllMessage, getAllRoomChat } from '../../../../redux/actions/chatRequest';

// Tạo kết nối socket với server
const socket = io('http://localhost:8000');

const ChatApp = () => {
    const user = useSelector((state) => state.auth.login.currentUser)?.user;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState('USER');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    
    // Tham chiếu đến Box chứa tin nhắn
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const getAllRoomsChat = async () => {
            const res = await getAllRoomChat();
            if (res) {
                setRooms(res?.rooms);
            }
        };
        getAllRoomsChat();
        setSelectedRoom(user?.email);
    }, [user]);

    useEffect(() => {
        setRole(user?.role);

        socket.emit('setRole', role);
        socket.emit('registerUser', user?.email);

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('roomList', (roomList) => {
            setRooms(roomList);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('roomList');
        };
    }, [role, user]);

    useEffect(() => {
        // Cuộn xuống dưới khi tin nhắn thay đổi
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageToRoom = () => {
        if (message && selectedRoom) {
            const messageData = {
                email: user?.email,
                message: message,
                room: selectedRoom,
            };
            socket.emit('sendMessageToRoom', { room: selectedRoom, message: messageData });
            setMessage('');
        }
    };

    const handleSelectRoom = async (room) => {
        setSelectedRoom(room);
        const res = await getAllMessage(room)
        if (res) {
            setMessages(res)
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '700px', padding: '20px', backgroundColor: '#f4f6f9' }}>
            {/* Cột bên trái: Danh sách phòng */}
            <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', paddingRight: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Phòng chat
                </Typography>
                <Divider sx={{ marginBottom: '10px' }} />

                {role === 'ADMIN' ? (
                    <Card sx={{ height: '600px', overflowY: 'scroll' }}>
                        <List sx={{ padding: '0' }}>
                            {rooms.map((room, index) => (
                                <ListItem
                                    button
                                    key={index}
                                    onClick={() => handleSelectRoom(room)}
                                    selected={selectedRoom === room}
                                    sx={{
                                        backgroundColor: selectedRoom === room ? '#e3f2fd' : 'transparent',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                        '&:hover': {
                                            backgroundColor: '#e0f7fa',
                                        },
                                    }}
                                >
                                    <Typography sx={{ color: '#00796b', fontWeight: '500' }}>
                                        {room}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                ) : (
                    <Typography sx={{ color: '#00796b', fontWeight: '500' }}>Your room: {user?.email}</Typography>
                )}
            </Box>

            {/* Cột bên phải: Tin nhắn */}
            <Box sx={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '8px' }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    {selectedRoom}
                </Typography>
                <Divider sx={{ marginBottom: '10px' }} />

                {/* Danh sách tin nhắn */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '10px',
                        backgroundColor: '#f1f1f1',
                        borderRadius: '8px',
                    }}
                    ref={messagesContainerRef}
                >
                    {messages?.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px',
                                justifyContent: msg.email === user?.email ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    padding: '12px 18px',
                                    borderRadius: '20px',
                                    backgroundColor: msg.email === user?.email ? '#0078d4' : 'white',
                                    color: msg.email === user?.email ? '#fff' : 'black',
                                    maxWidth: '80%',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {msg.message}
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Input gửi tin nhắn */}
                <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Nhập tin nhắn"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ marginRight: '10px', borderRadius: '20px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessageToRoom}
                        sx={{
                            backgroundColor: '#00796b',
                            '&:hover': { backgroundColor: '#004d40' },
                            borderRadius: '20px',
                            padding: '8px 20px',
                        }}
                    >
                        Gửi
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatApp;
