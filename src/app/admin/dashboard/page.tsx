
// 'use client';

// import { useUserContext } from "@/lib/store/context/UserContext";

// export default function DashboardPage() {
//   const { users, loading } = useUserContext();
  
//   return (
//     <div>
//    {users.map((user) => (
//      <li key={user._id}>
//      <strong>{user.name}</strong> ({user.email})
//    </li>
//    ))}
//     </div>
//   );
// }

// app/admin/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchUsers } from '@/lib/store/features/user/userSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

