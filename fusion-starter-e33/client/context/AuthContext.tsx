import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, role?: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    avatar: '👨‍💼',
    department: 'Management',
    joinDate: '2024-01-01',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    password: 'user123',
    avatar: '👨‍💻',
    department: 'Development',
    joinDate: '2024-01-10',
  },
  {
    id: '3',
    email: 'user2@example.com',
    name: 'Jane Smith',
    role: 'user',
    password: 'user123',
    avatar: '👩‍💻',
    department: 'Design',
    joinDate: '2024-01-12',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  const login = (email: string, password: string): boolean => {
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string, role: UserRole = 'user'): boolean => {
    if (allUsers.find(u => u.email === email)) {
      return false;
    }
    const newUser: User = {
      id: String(allUsers.length + 1),
      email,
      name,
      role,
      password,
    };
    setAllUsers([...allUsers, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
