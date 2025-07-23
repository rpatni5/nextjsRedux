'use client';

import { useRouter, useParams } from 'next/navigation';
import { useUserContext } from '@/lib/store/context/UserContext';
import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getUserById, updateUser, addUser } = useUserContext();

  const isAddMode = id === 'add';

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [designation, setDesignation] = useState('');
  const [loading, setLoading] = useState(!isAddMode);

  useEffect(() => {
    if (!isAddMode) {
      const loadUser = async () => {
        const user = await getUserById(id as string);
        if (user) {
          setName(user.name || '');
          setLastName(user.lastName || '');
          setEmail(user.email || '');
          setDob(user.dob ? new Date(user.dob).toISOString().split('T')[0] : '');
          setDesignation(user.designation || '');
        } else {
          alert('User not found');
          router.push('/admin/users');
        }
        setLoading(false);
      };
      loadUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddMode && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name,
      lastName,
      email,
      dob,
      designation,
      ...(password && isAddMode && { password }),
    };

    const success = isAddMode
      ? await addUser(userData)
      : await updateUser(id as string, userData);

    if (success) router.push('/admin/users');
    else alert(isAddMode ? 'Failed to add user' : 'Update failed');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" mb={3}>
        {isAddMode ? 'Add New User' : 'Edit User'}
      </Typography>

      {/* First & Last Name */}
      <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
        <TextField
          fullWidth
          required
          label="First Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Box>

      {/* Email */}
      <Box mt={3}>
        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      {/* Passwords (Add Mode Only) */}
      {isAddMode && (
        <Box display="flex" gap={2} mt={3} flexDirection={{ xs: 'column', md: 'row' }}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
      )}

      {/* DOB and Designation */}
      <Box display="flex" gap={2} mt={3} flexDirection={{ xs: 'column', md: 'row' }}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <TextField
          fullWidth
          label="Designation"
          variant="outlined"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </Box>

      {/* Buttons */}
      <Box display="flex" gap={2} mt={4}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push('/admin/users')}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          fullWidth
          type="submit"
        >
          {isAddMode ? 'Create User' : 'Update User'}
        </Button>
      </Box>
    </form>
  );
}
