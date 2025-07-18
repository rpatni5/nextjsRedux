'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  designation: string;
  dob: string;
  lastName: string;
  _id: string;
  name: string;
  email: string;
  role:string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, data: {
    name: string;
    lastName: string;
    email: string;
    dob?: string;
    designation?: string;
  }) => Promise<boolean>;
  addUser: (data: { name: string; email: string }) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<boolean>

}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Expected array but got:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: string): Promise<User | null> => {
    const existing = users.find((u) => u._id === id);
    if (existing) return existing;

    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const updateUser = async (id: string, data: {
    name: string;
    lastName: string;
    email: string;
    dob?: string;
    designation?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return false;
      await fetchUsers();
      return true;
    } catch {
      return false;
    }
  };


  const addUser = async (userData: { name: string; email: string }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to add user:', err);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) return false;
  
      await fetchUsers(); 
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };
  
  
  return (
    <UserContext.Provider value={{ users, loading, getUserById, updateUser, refreshUsers: fetchUsers, addUser,deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be inside <UserProvider>');
  return ctx;
};
