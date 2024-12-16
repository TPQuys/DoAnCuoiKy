import React, { useState, useEffect } from 'react';

const AdminChat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Kết nối với Webhook hoặc lấy dữ liệu từ backend
        fetch('/api/chat-messages')
            .then(response => response.json())
            .then(data => setMessages(data));
    }, []);

    const sendMessage = (message) => {
        // Gửi tin nhắn qua backend hoặc Tawk.to API
        fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
    };

    return (
        <div>
            <h2>Quản trị viên Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}</strong>: {msg.text}</p>
                ))}
            </div>
            <input type="text" onKeyDown={(e) => e.key === 'Enter' && sendMessage(e.target.value)} />
        </div>
    );
};

export default AdminChat;
