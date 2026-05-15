import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { CheckCircle, Clock, Activity, Briefcase, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    activeMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  const [trendData, setTrendData] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes, usersRes, activitiesRes] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/tasks'),
          user.role === 'Admin' ? api.get('/api/users') : Promise.resolve({ data: [] }),
          api.get('/api/activities')
        ]);
        
        const tasks = tasksRes.data;
        const projects = projectsRes.data;
        const users = usersRes.data;
        setActivities(activitiesRes.data || []);

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Completed').length,
          inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
          pendingTasks: tasks.filter(t => t.status === 'Pending').length,
          activeMembers: users.length || 1,
        });

        // Compute last 7 days productivity trends
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
        });

        const newTrendData = last7Days.map(date => {
          const start = new Date(date);
          start.setHours(0,0,0,0);
          const end = new Date(date);
          end.setHours(23,59,59,999);
          
          const dayTasks = tasks.filter(t => {
            const taskDate = new Date(t.createdAt);
            return taskDate >= start && taskDate <= end;
          });

          return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: dayTasks.filter(t => t.status === 'Completed').length,
            pending: dayTasks.filter(t => t.status !== 'Completed').length,
          };
        });

        setTrendData(newTrendData);

      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    import('../lib/socket').then(({ default: socket }) => {
      socket.connect();
      socket.on('taskCreated', fetchDashboardData);
      socket.on('taskUpdated', fetchDashboardData);
      socket.on('taskDeleted', fetchDashboardData);

      return () => {
        socket.off('taskCreated', fetchDashboardData);
        socket.off('taskUpdated', fetchDashboardData);
        socket.off('taskDeleted', fetchDashboardData);
      };
    });
  }, [user]);

  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
  ];

  const StatCard = ({ title, value, icon, gradient, subtext }) => (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${gradient} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your team today.</p>
        </div>
        <div className="hidden sm:flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">7 Days</button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" value={stats.totalTasks} icon={<CheckCircle size={22} />} 
          gradient="from-blue-500 to-indigo-600" subtext="+12% from last week"
        />
        <StatCard 
          title="Completed" value={stats.completedTasks} icon={<TrendingUp size={22} />} 
          gradient="from-emerald-500 to-teal-600" subtext={`${Math.round((stats.completedTasks/stats.totalTasks)*100 || 0)}% completion rate`}
        />
        <StatCard 
          title="Active Projects" value={stats.totalProjects} icon={<Briefcase size={22} />} 
          gradient="from-purple-500 to-fuchsia-600" subtext="3 ending soon"
        />
        <StatCard 
          title="Team Members" value={stats.activeMembers} icon={<Users size={22} />} 
          gradient="from-orange-500 to-rose-600" subtext="All online"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Productivity Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Completed</span>
              <span className="flex items-center ml-4"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Pending</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Task Distribution</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <Activity size={20} className="mr-2 text-primary-500" /> Recent Activity
        </h3>
        <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No recent activities.</p>
          ) : (
            activities.map((activity, idx) => (
              <div key={activity._id || idx} className="flex relative">
                {idx !== activities.length - 1 && (
                  <div className="absolute top-8 left-4 w-0.5 h-full -ml-px bg-slate-200 dark:bg-slate-700"></div>
                )}
                <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center border-4 border-white dark:border-[#111113] z-10">
                  <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">
                    {activity.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-4 min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-slate-800 dark:text-slate-200">
                    <span className="font-semibold">{activity.user?.name || 'Someone'}</span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">{activity.action}</span>{' '}
                    <span className="font-medium text-primary-600 dark:text-primary-400">{activity.details || 'a task'}</span>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-slate-400">
                    <Clock size={12} className="mr-1" />
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                    {activity.project?.title && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{activity.project.title}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
