import React from 'react';
import KanbanBoard from './KanbanBoard'; 

const EmployeeDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <KanbanBoard />
      </main>

    </div>
  );
};
  
  export default EmployeeDashboard;
  