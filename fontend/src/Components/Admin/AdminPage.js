import React, { useEffect } from "react";
import Header from '../Header/Header';
import Room from "./component/Room/Room";

const UserPage = () => {
    return (
        <main className='room-container'>
            <Header background="https://espfoizbmzncvmwdmtvy.supabase.co/storage/v1/object/sign/Event/user-header.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJFdmVudC91c2VyLWhlYWRlci53ZWJwIiwiaWF0IjoxNzI5ODY1NDgwLCJleHAiOjE3NjE0MDE0ODB9.skF1ZqXKPkSYiMKxkwb_KaZETbIpPrffb9M8bMj893U&t=2024-10-25T14%3A11%3A18.654Z" title="NGƯỜI DÙNG" />
            <div className="room-body">
                <div className="booking-center">
                <Room/>
                </div>
            </div>
        </main>

    );
};

export default UserPage;
