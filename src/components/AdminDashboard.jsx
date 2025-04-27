const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
            <p className="text-gray-600">Check and manage your daily tasks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Update your personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
