import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, List, ListItem, Divider, Avatar, Card } from '@mui/material';
import io from 'socket.io-client';
import { addMessage, getAllMessage, getAllRoomChat } from '../../../../redux/actions/chatRequest';
import url from '../../../../utils/url'
// Tạo kết nối socket với server
const socket = io(url);

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
                setSelectedRoom('');
            }
        };
        getAllRoomsChat();
    }, [user]);

    useEffect(() => {
        setRole(user?.role);

        socket.emit('setRole', role);
        socket.emit('registerUser', user?.email);

        socket.on('receiveMessage', (message) => {
            if (message.email === selectedRoom || message.email === user.email) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        socket.on('roomList', (roomList) => {
            // Kiểm tra và thêm các phòng trong roomList nhưng không có trong rooms
            const newRooms = roomList.filter(room => !rooms.includes(room));

            // Nếu có phòng mới, thêm chúng vào rooms
            if (newRooms.length > 0) {
                setRooms(prevRooms => [...prevRooms, ...newRooms]);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('roomList');
        };
    }, [role, user, selectedRoom]);

    useEffect(() => {
        // Cuộn xuống dưới khi tin nhắn thay đổi
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await getAllMessage(selectedRoom);
            if (res) {
                // Sắp xếp lại các tin nhắn theo thời gian tạo (createAt)
                const sortedMessages = res.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
                setMessages(sortedMessages);
            }
        };
        getAllMessages();
    }, [selectedRoom]);


    const sendMessageToRoom = () => {
        if (message && selectedRoom) {
            const messageData = {
                email: user?.email,
                message: message,
                room: selectedRoom,
            };
            addMessage({ ...messageData, room: selectedRoom, createAt: new Date() })
            socket.emit('sendMessageToRoom', { room: selectedRoom, message: messageData });
            setMessage('');
        }
    };

    const handleSelectRoom = async (room) => {
        setSelectedRoom(room);

    };

    return (
        <Box sx={{ display: 'flex', height: '700px', padding: '20px', backgroundColor: '#f4f6f9' }}>
            {/* Cột bên trái: Danh sách phòng */}
            <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', paddingRight: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Phòng chat
                </Typography>
                <Divider sx={{ marginBottom: '10px' }} />

                {(role === 'ADMIN' || role === 'MANAGER') ? (
                    <Card sx={{ height: '600px', overflowY: 'scroll' }}>
                        <List sx={{ padding: '0' }}>
                            {rooms
                                .filter(room => room !== user?.email) // Lọc phòng trùng với user.email
                                .map((room, index) => (
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Ngăn hành động mặc định (ví dụ: xuống dòng)
                                sendMessageToRoom(); // Gọi hàm gửi tin nhắn
                            }
                        }}
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
