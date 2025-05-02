import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserIcon } from '@heroicons/react/24/solid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "CLOSED"];

const priorityColors = {
  HIGH: 'bg-red-200 text-red-800',
  MEDIUM: 'bg-yellow-200 text-yellow-800',
  LOW: 'bg-green-200 text-green-800',
};

const statusColors = {
  TODO: 'bg-gray-300 text-gray-800',
  IN_PROGRESS: 'bg-yellow-300 text-yellow-800',
  COMPLETED: 'bg-green-300 text-green-800',
  CLOSED: 'bg-red-300 text-red-800',
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tasks/all');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const shortenDescription = (description, wordLimit = 10) => {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const getEmployeeUsername = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : t('unassigned');
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
  
    if (!destination || destination.droppableId === source.droppableId) return;
  
    const draggedTask = tasks.find(task => task.taskId.toString() === draggableId);
    if (!draggedTask) return;
  
    const updatedTaskDto = {
      title: draggedTask.title,
      description: draggedTask.description,
      status: destination.droppableId,
      priority: draggedTask.priority,
      deadline: draggedTask.deadline,
      estimatedDuration: draggedTask.estimatedDuration,
      actualDuration: draggedTask.actualDuration,
      assignedEmployeeId: draggedTask.assignedEmployeeId,
    };
  
    try {
      const response = await axios.post(`http://localhost:8080/tasks/update/${draggedTask.taskId}`, updatedTaskDto);
  
      const updatedTask = response.data;
      setTasks(prev =>
        prev.map(t => (t.taskId === updatedTask.taskId ? updatedTask : t))
      );
  
      // SweetAlert on success
      Swal.fire({
        title: '✅'+t('taskUpdatedTitle'),
        text: t('movedto')+`${t(destination.droppableId.toLowerCase())}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
  
    } catch (err) {
      console.error("Error updating task:", err);
      Swal.fire({
        title: '❌'+t('updateFailed'),
        text: t('updateError'),
        icon: 'error'
      });
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">{t('task_board')}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-6">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg"
                >
                  <h2 className="text-2xl font-bold mb-4 text-center">{t(status.toLowerCase())}</h2>
                  <div className="space-y-4">
                    {tasks
                      .filter(task => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.taskId.toString()} draggableId={task.taskId.toString()} index={index}>
                          {(provided) => (
                            <Link to={`/tasks/${task.taskId}`} className="block">
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white m-3 p-4 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
                              >
                                <h3 className="text-xl font-semibold">{t(task.title.toLowerCase())}</h3>
                                <p>
                                  {shortenDescription(task.description, 10)}
                                  <button
                                    style={{
                                      color: 'blue',
                                      border: 'none',
                                      background: 'none',
                                      marginLeft: '5px',
                                      cursor: 'pointer',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {t('see_more')}
                                  </button>
                                </p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                  <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                                    {t(task.priority.toLowerCase())}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
                                    {t(task.status.toLowerCase())}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-500 space-y-1 mt-4">
                                  <p className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    {getEmployeeUsername(task.assignedEmployeeId)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
