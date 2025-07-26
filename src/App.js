import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, LogOut, User, Lock } from 'lucide-react';

const TaskManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Demo users for testing
  const validUsers = {
    'admin': 'password123',
    'testuser': 'test123',
    'demo': 'demo'
  };

  // Initial demo tasks
  const initialTasks = [
    { id: 1, title: 'Complete QA Challenge', description: 'Implement Playwright and Postman tests', priority: 'high', completed: false },
    { id: 2, title: 'Review Test Cases', description: 'Go through all test scenarios', priority: 'medium', completed: true },
    { id: 3, title: 'Update Documentation', description: 'Write comprehensive test plan', priority: 'low', completed: false }
  ];

  useEffect(() => {
    if (isLoggedIn && tasks.length === 0) {
      setTasks(initialTasks);
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validUsers[loginForm.username] === loginForm.password) {
      setIsLoggedIn(true);
      setCurrentUser(loginForm.username);
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setTasks([]);
    setEditingTask(null);
    setShowAddForm(false);
    setFormData({ title: '', description: '', priority: 'medium' });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask = {
      id: Date.now(),
      ...formData,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setFormData({ title: '', description: '', priority: 'medium' });
    setShowAddForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setTasks(tasks.map(task => 
      task.id === editingTask 
        ? { ...task, ...formData }
        : task
    ));
    
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium' });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
            <p className="text-gray-600">Please login to continue</p>
          </div>

          <div className="space-y-6">
            {loginError && (
              <div data-testid="login-error" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Username
              </label>
              <input
                type="text"
                data-testid="username-input"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                data-testid="password-input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  data-testid="login-button"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Login
                </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>admin / password123</div>
              <div>testuser / test123</div>
              <div>demo / demo</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <span data-testid="current-user" className="text-gray-600">Welcome, {currentUser}</span>
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            data-testid="add-task-button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Add/Edit Task Form */}
        {(showAddForm || editingTask) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-testid="task-form">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  data-testid="task-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  data-testid="task-description-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  data-testid="task-priority-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (editingTask) {
                      handleUpdateTask(e);
                    } else {
                      handleAddTask(e);
                    }
                  }}
                  data-testid="save-task-button"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', priority: 'medium' });
                  }}
                  data-testid="cancel-button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Tasks ({tasks.length})</h2>
          
          {tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  data-testid={`task-item-${task.id}`}
                  className={`bg-white rounded-lg shadow-md p-4 ${task.completed ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskComplete(task.id)}
                          data-testid={`task-checkbox-${task.id}`}
                          className="w-4 h-4 text-blue-600"
                        />
                        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} ml-7`}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditTask(task)}
                        data-testid={`edit-task-${task.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                        title="Edit task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        data-testid={`delete-task-${task.id}`}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;