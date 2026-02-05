import React, { useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface AnalyticsProps {
  tasks: Task[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const statusCounts = {
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };

    const priorityCounts = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
    };

    const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const completedHours = tasks
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

    const avgProgress = tasks.length > 0
      ? Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length)
      : 0;

    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    const dueThisWeek = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length;

    return {
      statusCounts,
      priorityCounts,
      totalHours,
      completedHours,
      avgProgress,
      overdueTasks,
      dueThisWeek,
      totalTasks: tasks.length,
      completionRate: tasks.length > 0 ? Math.round((statusCounts.completed / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  const getChartColor = (percentage: number): string => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-4xl font-bold text-foreground">{stats.totalTasks}</p>
        </div>

        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${getChartColor(stats.completionRate)} bg-clip-text text-transparent`}>
            {stats.completionRate}%
          </p>
        </div>

        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Avg Progress</p>
          <p className="text-4xl font-bold text-primary">{stats.avgProgress}%</p>
        </div>

        <div className="card-base p-5">
          <p className="text-sm text-muted-foreground mb-1">Hours Logged</p>
          <p className="text-4xl font-bold text-blue-600">{stats.completedHours}/{stats.totalHours}h</p>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.overdueTasks > 0 && (
          <div className="card-base p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚠️</div>
              <div>
                <p className="font-semibold text-red-900">{stats.overdueTasks} Overdue Tasks</p>
                <p className="text-sm text-red-700">Attention needed immediately</p>
              </div>
            </div>
          </div>
        )}

        {stats.dueThisWeek > 0 && (
          <div className="card-base p-4 border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📅</div>
              <div>
                <p className="font-semibold text-yellow-900">{stats.dueThisWeek} Due This Week</p>
                <p className="text-sm text-yellow-700">Plan accordingly</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="card-base p-6">
        <h3 className="font-bold text-lg text-foreground mb-4">Status Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Pending</span>
              <span className="text-sm font-bold text-yellow-600">{stats.statusCounts.pending}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-500 h-full"
                style={{ width: `${(stats.statusCounts.pending / stats.totalTasks) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">In Progress</span>
              <span className="text-sm font-bold text-blue-600">{stats.statusCounts.in_progress}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(stats.statusCounts.in_progress / stats.totalTasks) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Completed</span>
              <span className="text-sm font-bold text-green-600">{stats.statusCounts.completed}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${(stats.statusCounts.completed / stats.totalTasks) * 100 || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="card-base p-6">
        <h3 className="font-bold text-lg text-foreground mb-4">Priority Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.priorityCounts.low}</p>
            <p className="text-sm text-muted-foreground mt-1">Low Priority</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.priorityCounts.medium}</p>
            <p className="text-sm text-muted-foreground mt-1">Medium Priority</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.priorityCounts.high}</p>
            <p className="text-sm text-muted-foreground mt-1">High Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};
