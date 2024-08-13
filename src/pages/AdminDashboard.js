// src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const { user, fetchUsers, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
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
          {users.map((u) => (
            <TableRow key={u._id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                {u.role !== 'admin' && (
                  <>
                    <Button onClick={() => handleRoleChange(u._id, 'student')}>Make Student</Button>
                    <Button onClick={() => handleRoleChange(u._id, 'tutor')}>Make Tutor</Button>
                    <Button onClick={() => handleRoleChange(u._id, 'admin')}>Make Admin</Button>
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
