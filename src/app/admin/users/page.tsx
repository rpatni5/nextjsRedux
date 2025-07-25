'use client';

import { useRouter } from 'next/navigation';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '@/lib/store/context/UserContext';
import { useCallback, useEffect, useState } from 'react';
import { FcDeleteDatabase, FcDeleteRow } from 'react-icons/fc';
import { FaDeleteLeft } from 'react-icons/fa6';
import { RiDeleteBack2Fill, RiDeleteBin2Fill, RiDeleteBin5Line } from 'react-icons/ri';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import Callbacks from '@/components/Callback';

export default function UsersPage() {
  console.log('UsersPage rendered');
  const router = useRouter();
  const { users, loading, refreshUsers, deleteUser } = useUserContext();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (userToDelete) {
      deleteUser(userToDelete);
      closeDeleteModal();
    }
  }, [userToDelete, deleteUser, closeDeleteModal]);

  // const handleDelete = (id: string) => deleteUser(id)
  const handleEdit = (id: string) => router.push(`/admin/users/edit/${id}`);

  useEffect(() => {
    refreshUsers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <button
        onClick={() => router.push('/admin/users/edit/add')}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add User
      </button>

      <div className="overflow-x-auto bg-white rounded-lg shadow">

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">DOB</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {`${user.name} ${user.lastName || ''}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.designation || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.role || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <button
                      title="Delete"
                      onClick={() => handleDelete(user._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <RiDeleteBin2Fill className="w-5 h-5" />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleEdit(user._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callbacks/>
        <DeleteConfirmation
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this user?"
        />
    </div>
  );
}
