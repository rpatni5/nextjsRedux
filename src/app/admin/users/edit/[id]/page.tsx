'use client';

import { useRouter, useParams } from 'next/navigation';
import { useUserContext } from '@/lib/store/context/UserContext';
import { useEffect, useState } from 'react';

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        {isAddMode ? 'Add New User' : 'Edit User'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** First Name */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="firstName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="firstName"
              className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              First Name
            </label>
          </div>

          {/** Last Name */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=" "
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="lastName"
              className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Last Name
            </label>
          </div>
        </div>

        {/* Email */}
        <div className="relative z-0 w-full group">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="email"
            className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
          >
            Email
          </label>
        </div>

        {/* Password & Confirm Password (only in add mode) */}
        {isAddMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div className="relative z-0 w-full group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="password"
                className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative z-0 w-full group">
              <input
                type="password"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Confirm Password
              </label>
            </div>
          </div>
        )}

        {/* DOB & Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DOB */}
          <div className="relative z-0 w-full group">
            <input
              type="date"
              id="dob"
              placeholder=" "
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent pt-4 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="dob"
              className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Date of Birth
            </label>
          </div>

          {/* Designation */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="designation"
              placeholder=" "
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="designation"
              className="absolute top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Designation
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 rounded transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition"
          >
            {isAddMode ? 'Create User' : 'Update User'}
          </button>
        </div>
        `


      </form>
    </div>
  );
}
