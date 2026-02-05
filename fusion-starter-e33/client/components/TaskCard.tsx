import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onViewDetails: (task: Task) => void;
  canManage: boolean;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100', textColor: 'text-yellow-800', label: 'Pending' },
  in_progress: { color: 'bg-blue-100', textColor: 'text-blue-800', label: 'In Progress' },
  completed: { color: 'bg-green-100', textColor: 'text-green-800', label: 'Completed' },
};

const priorityConfig = {
  low: { color: 'border-l-green-500', icon: '◯', label: 'Low' },
  medium: { color: 'border-l-yellow-500', icon: '◎', label: 'Medium' },
  high: { color: 'border-l-red-500', icon: '◉', label: 'High' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange, onViewDetails, canManage }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';
  const priority = task.priority || 'medium';

  return (
    <div className={`card-base p-5 hover:shadow-md transition-all border-l-4 ${priorityConfig[priority].color} cursor-pointer`} onClick={() => onViewDetails(task)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-lg text-muted-foreground flex-shrink-0">{priorityConfig[priority].icon}</span>
            <h3 className="font-semibold text-foreground truncate text-lg">{task.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 ml-6">{task.description}</p>

          {/* Progress Bar */}
          {task.progress !== undefined && (
            <div className="mt-3 ml-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
                <span className="text-xs font-semibold text-foreground">{task.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-blue-500 h-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap ml-6">
            <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${statusConfig[task.status].color} ${statusConfig[task.status].textColor}`}>
              {statusConfig[task.status].label}
            </span>
            <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
              priority === 'high' ? 'bg-red-100 text-red-700' :
              priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {priorityConfig[priority].label}
            </span>
            {task.assignedToName && (
              <span className="inline-block px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 font-medium">
                👤 {task.assignedToName}
              </span>
            )}
            {task.categories && task.categories.length > 0 && (
              <span className="inline-block px-2 py-1 rounded-md text-xs bg-purple-50 text-purple-700 font-medium">
                🏷️ {task.categories[0]}
              </span>
            )}
            {dueDate && (
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                isOverdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
              }`}>
                📅 {dueDate.toLocaleDateString()}
              </span>
            )}
            {task.estimatedHours && (
              <span className="inline-block px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700 font-medium">
                ⏱️ {task.estimatedHours}h
              </span>
            )}
            {task.comments && task.comments.length > 0 && (
              <span className="inline-block px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700">
                💬 {task.comments.length}
              </span>
            )}
          </div>
        </div>

        {canManage && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-4l7-7m0 0l-7 7m7-7v7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-md transition-colors"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {canManage && task.status !== 'completed' && (
        <div className="mt-3 ml-6 flex gap-2">
          {task.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, 'in_progress');
              }}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors font-medium"
            >
              ▶ Start Work
            </button>
          )}
          {task.status === 'in_progress' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, 'completed');
              }}
              className="text-xs px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition-colors font-medium"
            >
              ✓ Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
