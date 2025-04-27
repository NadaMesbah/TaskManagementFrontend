import React from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from './KanbanBoard'; 

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">Admin Dashboard</h1>
        <nav className="flex flex-col gap-6">
          <Link to="/tasks" className="hover:text-blue-300">Tasks</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <KanbanBoard /> {/* Render KanbanBoard here */}
      </main>
    </div>
  );
};

export default AdminDashboard;
