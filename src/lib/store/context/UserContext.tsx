'use client';

import React, { createContext, useContext, useState } from 'react';
import { User } from '@/interfaces/user';
import { apiClient } from '@/lib/api/apiClient';

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
  deleteUser: (id: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiClient<User[]>('/api/users');
      setUsers(Array.isArray(data) ? data : []);
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
      return await apiClient<User>(`/api/users/${id}`);
    } catch {
      return null;
    }
  };

  const updateUser = async (
    id: string,
    data: {
      name: string;
      lastName: string;
      email: string;
      dob?: string;
      designation?: string;
    }
  ): Promise<boolean> => {
    try {
      await apiClient(`/api/users/${id}`, {
        method: 'PUT',
        body: data,
      });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Update failed:', err);
      return false;
    }
  };

  const addUser = async (userData: { name: string; email: string }) => {
    try {
      await apiClient('/api/users', {
        method: 'POST',
        body: userData,
      });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Failed to add user:', err);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await apiClient(`/api/users/${id}`, {
        method: 'DELETE',
      });
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        getUserById,
        updateUser,
        refreshUsers: fetchUsers,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be inside <UserProvider>');
  return ctx;
};
