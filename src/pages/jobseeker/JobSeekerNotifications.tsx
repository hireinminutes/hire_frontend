import { useEffect, useState } from 'react';
import {
  Bell, Briefcase, CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar, ArrowRight, Clock
} from 'lucide-react';

import { Skeleton } from '../../components/ui/Skeleton';
import { getApiUrl } from '../../config/api';
import { getAuthHeaders } from '../../contexts/AuthContext';
import { JobSeekerPageProps, NotificationItem } from './types';
import { Button } from '../../components/ui/Button';

export function JobSeekerNotifications(_props: JobSeekerPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const fetchNotifications = async (pageNum = 1, reset = false) => {
    try {
      setNotificationsLoading(true);
      const response = await fetch(getApiUrl(`/api/auth/notifications?page=${pageNum}&limit=20`), {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        const mappedNotifications = (data.data || []).map((n: any) => ({
          ...n,
          id: n._id,
          created_at: n.createdAt
        }));

        if (reset) {
          setNotifications(mappedNotifications);
        } else {
          setNotifications(prev => [...prev, ...mappedNotifications]);
        }

        setHasMore(data.pagination?.page < data.pagination?.pages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, false);
  };

  const toggleNotificationDetails = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/auth/notifications/${notificationId}/read`), {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(getApiUrl('/api/auth/notifications/mark-all-read'), {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string | undefined, title: string) => {
    if (type === 'application_accepted' || title.includes('Approved')) return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    if (type === 'application_rejected' || title.includes('Rejected')) return <XCircle className="w-5 h-5 text-red-600" />;
    if (type === 'meeting_scheduled') return <Calendar className="w-5 h-5 text-purple-600" />;
    if (type === 'verification_approved') return <CheckCircle className="w-5 h-5 text-blue-600" />;
    if (title.includes('Application')) return <Briefcase className="w-5 h-5 text-slate-600" />;
    return <Bell className="w-5 h-5 text-slate-500" />;
  };

  const renderNotificationList = (list: NotificationItem[], title: string) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-4">
        <h2 className="font-black text-slate-900 px-2 uppercase tracking-wide text-xs bg-slate-100 w-fit py-1 rounded-md">{title}</h2>
        {list.map((notification) => {
          const isExpanded = expandedNotifications.has(notification.id);
          const icon = getNotificationIcon(notification.type, notification.title);

          return (
            <div
              key={notification.id}
              className={`
                group relative overflow-hidden rounded-[24px] border transition-all duration-300
                ${notification.read
                  ? 'bg-white border-slate-100 hover:border-slate-200'
                  : 'bg-gradient-to-r from-blue-50/50 to-white border-blue-100 shadow-lg shadow-blue-500/5'}
              `}
            >
              <div
                className="p-5 sm:p-6 flex items-start gap-5 cursor-pointer"
                onClick={() => toggleNotificationDetails(notification.id)}
              >
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105
                    ${notification.read ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200'}
                `}>
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                    <h3 className={`text-base font-bold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className={`text-sm mt-1.5 leading-relaxed line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                    {notification.message}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 self-center">
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" title="Unread" />
                  )}
                  <button className="text-slate-300 group-hover:text-slate-500 p-1 rounded-full hover:bg-slate-100 transition-all">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-0 ml-[4.25rem]">
                  <div className="h-px bg-slate-100 mb-4 w-full"></div>

                  {notification.data && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-3 mb-4">
                      {notification.data.jobTitle && (
                        <div><span className="font-bold text-slate-900">Role:</span> {notification.data.jobTitle}</div>
                      )}
                      {notification.data.companyName && (
                        <div><span className="font-bold text-slate-900">Company:</span> {notification.data.companyName}</div>
                      )}
                      {notification.data.customMessage && (
                        <div className="italic text-slate-500 border-l-2 border-blue-200 pl-3 py-1">
                          "{notification.data.customMessage}"
                        </div>
                      )}
                      {(notification.data.meetingLink || notification.data.link) && (
                        <a
                          href={notification.data.meetingLink || notification.data.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mt-2 group/link"
                        >
                          Open Link <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      )}
                      {notification.data.meetingDetails && (
                        <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                          <div className="font-bold text-slate-900 mb-2 border-b border-slate-50 pb-1">Meeting Details</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-slate-500">Date</div>
                            <div className="font-medium text-slate-900 text-right">{new Date(notification.data.meetingDetails.date).toDateString()}</div>
                            <div className="text-slate-500">Time</div>
                            <div className="font-medium text-slate-900 text-right">{notification.data.meetingDetails.time}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!notification.read && (
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkNotificationAsRead(notification.id);
                        }}
                        className="bg-white hover:bg-slate-900 hover:text-white border-slate-200 font-bold rounded-xl px-4 h-9 transition-colors"
                      >
                        Mark as read
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-8 pb-20">
      {/* Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-8 md:p-12 shadow-2xl shadow-slate-900/20 isolate">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Notifications
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-lg">
              Stay updated on your applications, interview schedules, and profile activity.
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-2xl backdrop-blur-md transition-all active:scale-95"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {notificationsLoading && notifications.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-6 flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Bell className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">You have no new notifications at the moment.</p>
          </div>
        ) : (
          <>
            {renderNotificationList(unreadNotifications, 'New')}
            {renderNotificationList(readNotifications, 'Earlier')}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  disabled={notificationsLoading}
                  className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-8 h-12 shadow-sm"
                >
                  {notificationsLoading ? 'Loading...' : 'Load More Notifications'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
