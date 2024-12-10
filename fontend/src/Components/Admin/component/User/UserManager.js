import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel } from '@mui/material';
import { getAllUsers, updateUser, deleteUser } from "../../../../redux/actions/userRequest";
import EditUserModal from "./component/EditUserModal";
import { toast } from "react-toastify";

const UsersManagement = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);

    useEffect(() => {
        if (users.length < 1) getAllUsers(dispatch);
    }, [users.length, dispatch]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    const handleDelete = async (userID) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            await deleteUser(dispatch, userID);
            getAllUsers(dispatch);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = React.useMemo(() => {
        if (sortConfig.key) {
            return [...users].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                return (aValue > bValue ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
            });
        }
        return users;
    }, [users, sortConfig]);

    return (
        <TableContainer component={Paper}>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                            <TableSortLabel
                                active={sortConfig.key === 'createdAt'}
                                direction={sortConfig.direction}
                                onClick={() => requestSort('createdAt')}
                            >
                                Ngày tạo
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {sortedUsers.map((user) => {
                        if (!user.admin) {
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.fullname || "Không có"}</TableCell>
                                    <TableCell>{user.phone || "Không có"}</TableCell>
                                    <TableCell>{new Date(user.dayofbirth).toLocaleDateString() || "Không có"}</TableCell>
                                    <TableCell>{user.role || "Không có"}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="text" onClick={() => handleEdit(user)}>
                                            Sửa
                                        </Button>
                                        <Button variant="text" color="error" onClick={() => handleDelete(user.id)}>
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    })
                    }
                </TableBody>
            </Table>

            {selectedUser && (
                <EditUserModal
                    initialValues={selectedUser}
                    open={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={(updatedUser) => {
                        updateUser(dispatch, updatedUser);
                        setIsEditOpen(false);
                        toast.success("Cập nhật thông tin người dùng thành công!");
                    }}
                />
            )}
        </TableContainer>
    );
};

export default UsersManagement;
