'use client';

import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchUsers } from '@/lib/store/features/user/userSlice';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';



export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  const chartData = useMemo(()=>{
   return  [
      { name: 'Jan', users: 30 },
      { name: 'Feb', users: 45 },
      { name: 'Mar', users: 60 },
      { name: 'Apr', users: 40 },
      { name: 'May', users: 80 },
    ];
  },[])

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title"> Dashboard</h1>

      <div className="dashboard-card">
        <h2>User Growth (Dummy Data)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#4f46e5"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-card">
        <h2> Users</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> <span>({user.email})</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          background: #f9fafb;
          font-family: sans-serif;
        }

        .dashboard-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #111827;
        }

        .dashboard-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .dashboard-card h2 {
          margin-bottom: 1rem;
          color: #374151;
        }

        .user-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .user-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-list li strong {
          color: #111827;
        }

        .user-list li span {
          color: #6b7280;
        }

        .dashboard-loading {
          padding: 2rem;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
}


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

