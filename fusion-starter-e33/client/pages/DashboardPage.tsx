import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { Analytics } from '../components/Analytics';
import { UserManagement } from '../components/UserManagement';
import { Task, TaskStatus, TaskFilters, TaskComment } from '../types';

type ViewTab = 'tasks' | 'analytics' | 'team' | 'settings';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, getTasks, addComment } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewTab, setViewTab] = useState<ViewTab>('tasks');
  const itemsPerPage = 6;

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const filters: TaskFilters = {
    status: statusFilter === 'all' ? undefined : statusFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
    searchQuery: searchQuery || undefined,
  };

  let filteredTasks = getTasks(filters);

  // Apply assignment filter
  if (assignmentFilter === 'assigned') {
    filteredTasks = filteredTasks.filter(task => task.assignedTo);
  } else if (assignmentFilter === 'unassigned') {
    filteredTasks = filteredTasks.filter(task => !task.assignedTo);
  }

  // If user is not admin, only show their assigned tasks or tasks they created
  if (!isAdmin) {
    filteredTasks = filteredTasks.filter(task => task.assignedTo === user.id || task.createdBy === user.id);
  }

  // Get all users for assignment dropdown
  const mockUsers = [
    { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' as const, avatar: '👨‍💼', department: 'Management' },
    { id: '2', email: 'user@example.com', name: 'John Doe', role: 'user' as const, avatar: '👨‍💻', department: 'Development' },
    { id: '3', email: 'user2@example.com', name: 'Jane Smith', role: 'user' as const, avatar: '👩‍💻', department: 'Design' },
  ];

  const allUsers = mockUsers;

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handleAddTask = (taskData: Omit<Task, 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setSelectedTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const handleCreateClick = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleAddComment = (taskId: string, comment: TaskComment) => {
    addComment(taskId, comment);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Progress', 'Estimated Hours'];
    const rows = filteredTasks.map(t => [
      t.id,
      t.title,
      t.status,
      t.priority,
      t.assignedToName || 'Unassigned',
      t.dueDate || 'N/A',
      `${t.progress || 0}%`,
      t.estimatedHours || 'N/A',
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getTaskStats = () => {
    return {
      total: filteredTasks.length,
      pending: filteredTasks.filter(t => t.status === 'pending').length,
      inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
    };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-background">
      <Header title="Task Management System" showLogout={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
          {[
            { id: 'tasks', label: '📋 Tasks', icon: '📋' },
            { id: 'analytics', label: '📊 Analytics', icon: '📊' },
            ...(isAdmin ? [{ id: 'team', label: '👥 Team', icon: '👥' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id as ViewTab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                viewTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks View */}
        {viewTab === 'tasks' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card-base p-5">
                <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="card-base p-5">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="card-base p-5">
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="card-base p-5">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="card-base p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between mb-6">
                <div className="flex-1 w-full">
                  <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                    Search Tasks
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title, description, or categories..."
                    className="input-field w-full"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCreateClick}
                    className="btn-primary flex-1 sm:flex-none whitespace-nowrap"
                  >
                    ➕ New Task
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="btn-secondary flex-1 sm:flex-none whitespace-nowrap"
                  >
                    📥 Export CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as TaskStatus | 'all');
                      setCurrentPage(1);
                    }}
                    className="input-field w-full"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priorityFilter}
                    onChange={(e) => {
                      setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high');
                      setCurrentPage(1);
                    }}
                    className="input-field w-full"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="assignment" className="block text-sm font-medium text-foreground mb-2">
                    Assignment
                  </label>
                  <select
                    id="assignment"
                    value={assignmentFilter}
                    onChange={(e) => {
                      setAssignmentFilter(e.target.value as 'all' | 'assigned' | 'unassigned');
                      setCurrentPage(1);
                    }}
                    className="input-field w-full"
                  >
                    <option value="all">All Tasks</option>
                    <option value="assigned">Assigned</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4 mb-8">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onViewDetails={(t) => {
                      setDetailTask(t);
                      setIsDetailOpen(true);
                    }}
                    canManage={isAdmin || task.assignedTo === user.id || task.createdBy === user.id}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Analytics View */}
        {viewTab === 'analytics' && (
          <Analytics tasks={isAdmin ? tasks : tasks.filter(t => t.assignedTo === user.id || t.createdBy === user.id)} />
        )}

        {/* Team View */}
        {viewTab === 'team' && isAdmin && (
          <UserManagement users={allUsers} tasks={tasks} />
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSave={handleAddTask}
        task={selectedTask}
        currentUserId={user.id}
        users={allUsers}
        isAdmin={isAdmin}
      />

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailTask(null);
        }}
        task={detailTask}
        currentUserId={user.id}
        onAddComment={handleAddComment}
      />
    </div>
  );
};
