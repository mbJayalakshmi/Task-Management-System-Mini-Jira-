import React, { useState } from 'react';
import { Task, TaskComment } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  currentUserId: string;
  onAddComment: (taskId: string, comment: TaskComment) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  currentUserId,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !task) return null;

  const handleAddComment = () => {
    if (commentText.trim()) {
      const comment: TaskComment = {
        id: `comment-${Date.now()}`,
        taskId: task.id,
        userId: currentUserId,
        userName: 'Current User',
        content: commentText,
        createdAt: new Date().toISOString(),
      };
      onAddComment(task.id, comment);
      setCommentText('');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground truncate">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Title and Status */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">{task.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority || 'medium']}`}>
                {(task.priority || 'medium').toUpperCase()} Priority
              </span>
              {isOverdue && (
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  ⚠️ OVERDUE
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-secondary rounded-lg p-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
              <p className="font-semibold text-foreground">{task.assignedToName || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created Date</p>
              <p className="font-semibold text-foreground">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="font-semibold text-foreground">
                {dueDate ? dueDate.toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Hours</p>
              <p className="font-semibold text-foreground">{task.estimatedHours || '-'} hours</p>
            </div>
          </div>

          {/* Progress */}
          {task.progress !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">Progress</h4>
                <span className="text-lg font-bold text-primary">{task.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-blue-500 h-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Categories */}
          {task.categories && task.categories.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {task.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          {task.activities && task.activities.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Activity Log</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {task.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 bg-secondary rounded-lg">
                    <div className="flex-shrink-0 text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-foreground">{activity.userName}</p>
                      <p className="text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Comments</h4>

            {task.comments && task.comments.length > 0 && (
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="bg-secondary rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground">{comment.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="input-field flex-1"
              />
              <button
                onClick={handleAddComment}
                className="btn-primary"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
