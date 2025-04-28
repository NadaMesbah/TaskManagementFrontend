import React from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from './KanbanBoard'; 

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Top Navbar */}
      <header className="bg-blue-800 text-white p-6 flex items-center gap-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav className="flex gap-6">
          <Link to="/tasks" className="hover:text-blue-300 font-medium">Tasks</Link>
          <Link to="/logout" className="hover:text-blue-300 font-medium">Logout</Link>
          {/* You can add more links here */}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <KanbanBoard />
      </main>

    </div>
  );
};

export default AdminDashboard;
