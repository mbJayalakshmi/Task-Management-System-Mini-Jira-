import React from 'react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  tasks: any[];
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, tasks }) => {
  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(t => t.assignedTo === userId || t.createdBy === userId);
    return {
      total: userTasks.length,
      assigned: userTasks.filter(t => t.assignedTo === userId).length,
      completed: userTasks.filter(t => t.assignedTo === userId && t.status === 'completed').length,
    };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Team Members</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          const completionRate = stats.assigned > 0 ? Math.round((stats.completed / stats.assigned) * 100) : 0;

          return (
            <div key={user.id} className="card-base p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{user.avatar || '👤'}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-foreground">{user.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                    {user.department && (
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {user.department}
                      </span>
                    )}
                  </div>

                  {/* Task Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-secondary rounded p-2 text-center">
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                      <p className="text-xs text-muted-foreground">Assigned</p>
                    </div>
                    <div className="bg-green-50 rounded p-2 text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                  </div>

                  {/* Completion Progress */}
                  {stats.assigned > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                        <span className="text-xs font-bold text-foreground">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full transition-all"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {user.joinDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Joined: {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
