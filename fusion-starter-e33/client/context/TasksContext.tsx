import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, TaskFilters, TaskComment, TaskActivity } from '../types';

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasks: (filters?: TaskFilters) => Task[];
  addComment: (taskId: string, comment: TaskComment) => void;
  addActivity: (taskId: string, activity: TaskActivity) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard',
    description: 'Create a modern dashboard UI with charts and analytics',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'John Doe',
    createdBy: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    dueDate: '2024-01-25',
    categories: ['UI/UX', 'Frontend'],
    progress: 65,
    estimatedHours: 40,
    comments: [],
    activities: [],
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users cannot login with special characters in password',
    status: 'pending',
    priority: 'high',
    assignedTo: '3',
    assignedToName: 'Jane Smith',
    createdBy: '1',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    dueDate: '2024-01-22',
    categories: ['Backend', 'Bug Fix'],
    progress: 0,
    estimatedHours: 8,
    comments: [],
    activities: [],
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    status: 'pending',
    priority: 'medium',
    createdBy: '1',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    dueDate: '2024-01-28',
    categories: ['Documentation'],
    progress: 0,
    estimatedHours: 20,
    comments: [],
    activities: [],
  },
  {
    id: '4',
    title: 'Refactor authentication module',
    description: 'Improve code quality and add better error handling',
    status: 'completed',
    priority: 'medium',
    assignedTo: '2',
    assignedToName: 'John Doe',
    createdBy: '1',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    dueDate: '2024-01-20',
    categories: ['Backend', 'Refactoring'],
    progress: 100,
    estimatedHours: 16,
    comments: [],
    activities: [],
  },
  {
    id: '5',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'John Doe',
    createdBy: '1',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
    dueDate: '2024-01-26',
    categories: ['DevOps', 'Infrastructure'],
    progress: 45,
    estimatedHours: 12,
    comments: [],
    activities: [],
  },
  {
    id: '6',
    title: 'Database optimization',
    description: 'Add indexes and optimize slow queries',
    status: 'pending',
    priority: 'low',
    createdBy: '1',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-17T14:00:00Z',
    dueDate: '2024-02-01',
    categories: ['Backend', 'Performance'],
    progress: 0,
    estimatedHours: 24,
    comments: [],
    activities: [],
  },
];

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addComment = (taskId: string, comment: TaskComment) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, comments: [...(task.comments || []), comment] }
        : task
    ));
  };

  const addActivity = (taskId: string, activity: TaskActivity) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, activities: [...(task.activities || []), activity] }
        : task
    ));
  };

  const getTasks = (filters?: TaskFilters): Task[] => {
    let filtered = [...tasks];

    if (filters?.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters?.assignedTo) {
      filtered = filtered.filter(task => task.assignedTo === filters.assignedTo);
    }

    if (filters?.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.categories?.some(cat => cat.toLowerCase().includes(query)) ?? false)
      );
    }

    if (filters?.dueDateFrom && filters?.dueDateTo) {
      const from = new Date(filters.dueDateFrom);
      const to = new Date(filters.dueDateTo);
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= from && dueDate <= to;
      });
    }

    return filtered;
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTasks, addComment, addActivity }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
};
