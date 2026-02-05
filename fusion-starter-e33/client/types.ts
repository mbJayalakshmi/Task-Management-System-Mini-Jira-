export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  department?: string;
  joinDate?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  categories?: string[];
  comments?: TaskComment[];
  activities?: TaskActivity[];
  progress?: number;
  estimatedHours?: number;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string, role: UserRole) => void;
  logout: () => void;
}

export interface TasksContext {
  tasks: Task[];
  users: User[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasks: (filters?: TaskFilters) => Task[];
  addComment: (taskId: string, comment: TaskComment) => void;
  addActivity: (taskId: string, activity: TaskActivity) => void;
}

export interface TaskFilters {
  status?: TaskStatus;
  assignedTo?: string;
  priority?: TaskPriority;
  searchQuery?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
