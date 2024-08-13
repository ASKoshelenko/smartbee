import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    // TODO: Implement real authentication with API
    const fakeUser = { email, name: 'Test User', role: 'admin' };
    setUser(fakeUser);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (name, email, password) => {
    // TODO: Implement real registration with API
    const newUser = { email, name, role: 'student' };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const fetchUsers = async () => {
    // TODO: Fetch user list from the server
    return [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
      { _id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'tutor' },
    ];
  };

  const updateUserRole = async (userId, newRole) => {
    // TODO: Update user role on the server
    console.log(`Updating user ${userId} role to ${newRole}`);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, fetchUsers, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
