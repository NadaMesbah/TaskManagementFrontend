import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    email: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    // Fetch the current logged-in user's details
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/me');
        setUser(response.data);
        setForm({
          username: response.data.username,
          email: response.data.email
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8080/users/update', form);
      setUser(response.data); // Update user data in state after success
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {editMode ? (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg">Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl mb-4">Profile Details</h2>
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-yellow-500 text-white p-3 rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
