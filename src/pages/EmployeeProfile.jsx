import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../apis/axios_helper';

const EmployeeProfile = () => {
  const { id } = useParams(); 

  const [user, setUser] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await request('get', `/employees/${id}`);
        const data = response.data;
        setUser({
          username: data.username || '',
          email: data.email || '',
          firstname: data.firstname || data.firstName || '',
          lastname: data.lastname || data.lastName || '',
        });
      } catch (error) {
        console.error('Erreur lors du chargement du profil :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Profil de l'employé</h1>

      <div className="w-24 h-24 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-3xl font-bold mb-6">
        {user.username?.[0]?.toUpperCase() || '?'}
      </div>

      <div className="bg-white w-full max-w-lg shadow-md rounded-lg p-6 space-y-4">
        {['username', 'email', 'firstname', 'lastname'].map((field) => (
          <div className="relative" key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {{
                username: "Nom d'utilisateur",
                email: 'Email',
                firstname: 'Prénom',
                lastname: 'Nom'
              }[field]}
            </label>
            <input
              type="text"
              value={user[field]}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
        ))}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded border border-gray-400 text-gray-700"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
