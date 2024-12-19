import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, TextField, IconButton, Card } from '@mui/material';
import { getAllUsers, updateUser, deleteUser } from "../../../../redux/actions/userRequest";
import EditUserModal from "./component/EditUserModal";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const UsersManagement = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState("");

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


    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const sortedUsers = React.useMemo(() => {
        if (sortConfig.key) {
            return [...filteredUsers].sort((a, b) => {
                let aValue = a[sortConfig.key]?.toLowerCase?.() || ""; // Đảm bảo không lỗi với null/undefined
                let bValue = b[sortConfig.key]?.toLowerCase?.() || ""; // Đảm bảo không lỗi với null/undefined
                return (aValue > bValue ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
            });
        }
        return filteredUsers;
    }, [filteredUsers, sortConfig]);

    return (
        <Card sx={{ p: 3, gap: 3 }}>
            <TextField
                label="Tìm kiếm người dùng"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
                sx={{ marginBottom: 2 }}
            />
            <TableContainer component={Paper} sx={{ maxHeight: '700px', overflowY: 'auto' }}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'email'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={sortConfig.key === 'role'}
                                    direction={sortConfig.direction}
                                    onClick={() => requestSort('role')}
                                >
                                    Role
                                </TableSortLabel>
                            </TableCell>
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
                                            <IconButton onClick={() => handleEdit(user)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(user.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </Card>
    );
};

export default UsersManagement;
