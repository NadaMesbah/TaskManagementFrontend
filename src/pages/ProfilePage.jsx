import React, { useState, useEffect } from 'react';
import { request } from '../apis/axios_helper';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: ''
  });
  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    firstname: false,
    lastname: false
  });
  const [isChanged, setIsChanged] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await request('get', `/employees/${userId}`);
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
  }, [userId]);

  const handleInputChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
    setIsChanged(true);
  };

  const handleEditClick = (field) => () => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleSave = async () => {
    try {
      await request('put', `/employees/${userId}`, user);
      setEditMode({
        username: false,
        email: false,
        firstname: false,
        lastname: false
      });
      setIsChanged(false);
      setSuccessMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };

  const handleChangePasswordClick = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
  };

  const handleSavePassword = async () => {
    try {
      if(passwords.newPassword !== passwords.confirmNewPassword) {
        alert("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
        return;
      }
      await request('put', `/employees/${userId}/changer-mot-de-passe`, passwords);
      handleCloseDialog();
      alert('Mot de passe modifié avec succès');
    } catch (error) {
      alert(error.response?.data || 'Erreur lors du changement de mot de passe');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Mon Profil</h1>

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
              disabled={!editMode[field]}
              onChange={handleInputChange(field)}
              className={`w-full px-4 py-2 border rounded ${editMode[field] ? 'border-blue-500' : 'bg-gray-100'}`}
            />
            <button
              onClick={handleEditClick(field)}
              className="absolute top-7 right-2 text-sm text-blue-600 underline"
            >
              ✏️
            </button>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold ${!isChanged ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Enregistrer
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded border border-gray-400 text-gray-700"
          >
            Annuler
          </button>
        </div>

        <button
          onClick={handleChangePasswordClick}
          className="w-full mt-4 px-4 py-2 rounded bg-red-500 text-white font-semibold"
        >
          Changer le mot de passe
        </button>
      </div>

      {successMessage && (
        <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full space-y-4 relative">
            <h2 className="text-xl font-bold mb-2">Changer le mot de passe</h2>

            {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-700 mb-1">
                  {field === 'currentPassword'
                    ? 'Mot de passe actuel'
                    : field === 'newPassword'
                    ? 'Nouveau mot de passe'
                    : 'Confirmer le nouveau mot de passe'}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded"
                  value={passwords[field]}
                  onChange={handlePasswordChange(field)}
                />
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-300 rounded text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
