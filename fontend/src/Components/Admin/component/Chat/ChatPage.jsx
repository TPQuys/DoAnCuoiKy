import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, List, ListItem, Divider, Avatar } from '@mui/material';
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

    useEffect(() => {
        const getAllRoomsChat = async () => {
            const res = await getAllRoomChat();
            setRooms(res.rooms);
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
        if(res){
            setMessages(res)
        }
        console.log(`Selected room: ${room}`);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', padding: '10px' }}>
            {/* Cột bên trái: Danh sách phòng */}
            <Box sx={{ width: '25%', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Rooms
                </Typography>
                <Divider />
                {role === 'ADMIN' ? (
                    <List>
                        {rooms.map((room, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => handleSelectRoom(room)}
                                selected={selectedRoom === room}
                                sx={{
                                    backgroundColor: selectedRoom === room ? '#f0f0f0' : 'transparent',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                }}
                            >
                                {room}
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>Your room: {user?.email}</Typography>
                )}
            </Box>

            {/* Cột bên phải: Tin nhắn */}
            <Box sx={{ flex: 1, paddingLeft: '10px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Chat in: {selectedRoom}
                </Typography>
                <Divider />

                {/* Danh sách tin nhắn */}
                <Box sx={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f9f9f9' }}>
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

                {/* Input gửi tin nhắn */}
                <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ marginRight: '10px' }}
                    />
                    <Button variant="contained" color="primary" onClick={sendMessageToRoom}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatApp;
