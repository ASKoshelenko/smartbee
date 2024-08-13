// src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const { fetchUsers, updateUserRole } = useAuth(); // Используем необходимые функции из AuthContext
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Обновляем состояние после изменения роли
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.role !== 'admin' && (
                  <>
                    <Button onClick={() => handleRoleChange(user._id, 'student')}>Make Student</Button>
                    <Button onClick={() => handleRoleChange(user._id, 'tutor')}>Make Tutor</Button>
                    <Button onClick={() => handleRoleChange(user._id, 'admin')}>Make Admin</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;
