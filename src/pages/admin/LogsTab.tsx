import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Activity, CreditCard, Send, User, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface ActivityLog {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        profilePicture?: string;
        profile?: {
            company?: {
                name: string;
            };
        };
    } | null;
    userModel: 'Recruiter' | 'Candidate' | 'User';
    action: string;
    details: any;
    createdAt: string;
}

interface LogsTabProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ searchQuery, onSearchChange }) => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterAction, setFilterAction] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, [page, filterAction, startDate, endDate, searchQuery]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL;

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });

            if (filterAction) queryParams.append('action', filterAction);
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);
            if (searchQuery) queryParams.append('search', searchQuery);

            const response = await fetch(`${API_BASE_URL}/api/admin/logs?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setLogs(data.data);
                setTotalPages(data.pages);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'SUBSCRIPTION_PURCHASE':
                return <CreditCard className="h-4 w-4 text-green-500" />;
            case 'INTERVIEW_REQUEST':
                return <Send className="h-4 w-4 text-blue-500" />;
            case 'USER_LOGIN':
                return <User className="h-4 w-4 text-slate-500" />;
            default:
                return <Activity className="h-4 w-4 text-purple-500" />;
        }
    };

    const formatDetails = (action: string, details: any) => {
        if (!details) return '-';

        switch (action) {
            case 'SUBSCRIPTION_PURCHASE':
                return (
                    <span className="text-green-700 font-medium">
                        Bought {details.plan?.toUpperCase()} Plan ({details.currency} {details.amount ? details.amount / 100 : 0})
                    </span>
                );
            case 'INTERVIEW_REQUEST':
                return (
                    <span>
                        Requested interview for <span className="font-semibold text-slate-900">{details.jobTitle}</span>
                        <span className="text-slate-500 text-xs block">at {details.companyName}</span>
                    </span>
                );
            default:
                return JSON.stringify(details).substring(0, 50) + (JSON.stringify(details).length > 50 ? '...' : '');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Activity Logs</h2>
                    <p className="text-slate-500">Track all user activities and system events.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        setFilterAction('');
                        setStartDate('');
                        setEndDate('');
                        onSearchChange('');
                        setPage(1);
                    }}
                    className="self-start md:self-auto"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Filters
                </Button>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by user name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                    <option value="">All Activities</option>
                    <option value="SUBSCRIPTION_PURCHASE">Subscription Purchase</option>
                    <option value="INTERVIEW_REQUEST">Interview Request</option>
                    <option value="USER_LOGIN">User Login</option>
                </select>

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center mb-2">
                                            <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No activity logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {log.user?.fullName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{log.user?.fullName || 'Unknown User'}</div>
                                                    <div className="text-xs text-slate-500">{log.userModel}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className="text-sm font-medium text-slate-700">
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatDetails(log.action, log.details)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Page <span className="font-bold">{page}</span> of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
