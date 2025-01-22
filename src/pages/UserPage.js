import React, { useEffect, useState } from 'react';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-page p-8 bg-gray-50 rounded-lg shadow-lg">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">User List</h2>
  <p className="text-lg text-gray-600 mb-8">Manage all users here. You can edit or delete user records easily.</p>

  {loading ? (
    <p className="text-xl text-gray-500">Loading users...</p>
  ) : error ? (
    <p className="text-red-500 text-lg font-semibold">{error}</p>
  ) : (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto text-gray-700">
        <thead className="bg-teal-600 text-white">
          <tr>
            <th className="border-b px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Name</th>
            <th className="border-b px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Email</th>
            <th className="border-b px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-teal-50 transition duration-300 transform"
            >
              <td className="border-b px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
              <td className="border-b px-6 py-4 text-sm font-medium text-gray-600">{user.email}</td>
              <td className="border-b px-6 py-4">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-medium transition duration-300 transform hover:scale-105 mr-3">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition duration-300 transform hover:scale-105">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
};

export default UserPage;
