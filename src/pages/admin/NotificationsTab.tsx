import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Search, Mail, Eye, Trash2, MessageSquare,
  CheckCircle, Archive, Clock, Bell, Send, XCircle
} from 'lucide-react';
import type { ContactSubmission, AdminNotification } from './types';

interface NotificationsTabProps {
  contacts: ContactSubmission[];
  contactsLoading: boolean;
  adminNotifications: AdminNotification[];
  notificationsLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewContact: (contact: ContactSubmission) => void;
  onDeleteContact: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onSendInterview: (candidateId: string, link: string) => Promise<void>;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  contacts,
  contactsLoading,
  adminNotifications,
  notificationsLoading,
  searchQuery,
  onSearchChange,
  onViewContact,
  onDeleteContact,
  onMarkAsRead,
  onMarkNotificationRead,
  onSendInterview
}) => {
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [interviewLink, setInterviewLink] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'contact' | 'interview'>('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const allItems = [
    ...contacts.map(c => ({ ...c, _itemType: 'contact' as const, isRead: c.isRead })),
    ...adminNotifications.map(n => ({ ...n, _itemType: 'notification' as const, isRead: n.read, name: 'Admin Notification', subject: n.title }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleOpenInterviewModal = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setInterviewLink('');
    setInterviewModalOpen(true);
  };

  const handleSubmitInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !interviewLink) return;

    setSendingLink(true);
    try {
      await onSendInterview(selectedCandidateId, interviewLink);
      setInterviewModalOpen(false);
    } finally {
      setSendingLink(false);
    }
  };

  const filteredItems = allItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      (item as any).name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item as any).email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item as any).subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item as any).message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' ||
      (typeFilter === 'contact' && item._itemType === 'contact') ||
      (typeFilter === 'interview' && item._itemType === 'notification');

    return matchesSearch && matchesType;
  });

  const stats = {
    total: allItems.length,
    unread: allItems.filter(c => !c.isRead).length,
    today: allItems.filter(c => {
      const date = new Date(c.createdAt);
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    }).length
  };

  if (contactsLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center py-24 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Messages</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Manage inquiries, feedback, and support requests from users.
            </p>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Mail className="h-5 w-5 text-pink-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Unread Messages</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.unread}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Received Today</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <Archive className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total History</p>
              <p className="text-2xl font-bold text-white leading-tight">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          {/* Filter Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              className={`flex-1 md:flex-none ${typeFilter === 'all' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setTypeFilter('all')}
            >
              All ({allItems.length})
            </Button>
            <Button
              className={`flex-1 md:flex-none ${typeFilter === 'contact' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'border border-slate-200 text-slate-600 hover:bg-pink-50'}`}
              onClick={() => setTypeFilter('contact')}
            >
              Contact ({contacts.length})
            </Button>
            <Button
              className={`flex-1 md:flex-none ${typeFilter === 'interview' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'border border-slate-200 text-slate-600 hover:bg-amber-50'}`}
              onClick={() => setTypeFilter('interview')}
            >
              Interview ({adminNotifications.length})
            </Button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{filteredItems.length}</span> items found
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <MessageSquare className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Inbox Empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto">All caught up! New support submissions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const isContact = item._itemType === 'contact';
              const isRead = item.isRead;
              const date = new Date(item.createdAt);

              return (
                <div
                  key={item._id}
                  className={`group p-4 sm:p-5 hover:bg-slate-50 transition-all cursor-pointer border-l-4 ${!isRead ? 'bg-pink-50/30 border-l-pink-500' : 'bg-white border-l-transparent'
                    }`}
                  onClick={() => {
                    if (isContact) {
                      onViewContact(item as any);
                    } else {
                      setSelectedNotification(item as any);
                      setShowNotificationModal(true);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar / Icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${!isRead
                      ? (isContact ? 'bg-pink-100 text-pink-600' : 'bg-amber-100 text-amber-600')
                      : 'bg-slate-100 text-slate-500'
                      }`}>
                      {isContact ? (item as any).name.charAt(0).toUpperCase() : <Bell className="h-6 w-6" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base truncate pr-2 ${!isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {isContact ? (item as any).subject : (item as any).title}
                          </h3>
                          {!isContact && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              Interview Request
                            </span>
                          )}
                          {isContact && (
                            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              Contact Form
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-slate-600 font-medium">
                            {isContact ? `From: ${(item as any).name}` : (item as any).message.substring(0, 100)}
                          </span>
                          {isContact && (
                            <span className="text-xs text-slate-400 text-ellipsis overflow-hidden">
                              {(item as any).message?.substring(0, 100)}...
                            </span>
                          )}
                        </div>

                        {/* Actions (visible on hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isRead && (
                            <Button
                              variant="ghost"
                              className="h-11 w-11 p-0 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                isContact ? onMarkAsRead(item._id) : onMarkNotificationRead(item._id);
                              }}
                              title="Mark as Read"
                            >
                              <CheckCircle className="h-6 w-6" />
                            </Button>
                          )}
                          {!isContact && (item as any).type === 'interview_invite' && (
                            <Button
                              variant="ghost"
                              className="h-11 w-11 p-0 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                const candidateId = (item as any).data?.candidateId;
                                if (candidateId) handleOpenInterviewModal(candidateId);
                              }}
                              title="Send Interview Link"
                            >
                              <Send className="h-6 w-6" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="h-11 w-11 p-0 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isContact) {
                                onViewContact(item as any);
                              } else {
                                setSelectedNotification(item as any);
                                setShowNotificationModal(true);
                              }
                            }}
                            title="View Details"
                          >
                            <Eye className="h-6 w-6" />
                          </Button>
                          {isContact && (
                            <Button
                              variant="ghost"
                              className="h-11 w-11 p-0 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500"
                              onClick={(e) => { e.stopPropagation(); onDeleteContact(item._id); }}
                              title="Delete Message"
                            >
                              <Trash2 className="h-6 w-6" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interview Link Modal */}
      {interviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Send Interview Link</h3>
              <button
                onClick={() => setInterviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInterview} className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100">
                You are about to send an interview invitation. This will count towards the candidate's plan limit.
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Meeting / Interview URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInterviewModalOpen(false)}
                  className="border-slate-200 text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sendingLink}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {sendingLink ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification View Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedNotification.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedNotification(null);
                  if (!selectedNotification.read) {
                    onMarkNotificationRead(selectedNotification._id);
                  }
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Notification Type Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-full uppercase tracking-wider">
                  Interview Request
                </span>
                {!selectedNotification.read && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full uppercase tracking-wider">
                    Unread
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedNotification.message}</p>
                </div>
              </div>

              {/* Additional Data if available */}
              {selectedNotification.data && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Candidate Information</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedNotification.data.candidateName && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedNotification.data.candidateName}</p>
                      </div>
                    )}
                    {selectedNotification.data.candidateEmail && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedNotification.data.candidateEmail}</p>
                      </div>
                    )}
                    {selectedNotification.data.candidateId && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Candidate ID</p>
                        <p className="text-sm font-mono text-slate-700">{selectedNotification.data.candidateId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotificationModal(false);
                    setSelectedNotification(null);
                    if (!selectedNotification.read) {
                      onMarkNotificationRead(selectedNotification._id);
                    }
                  }}
                  className="border-slate-200 text-slate-600"
                >
                  Close
                </Button>
                {selectedNotification.data?.candidateId && (
                  <Button
                    onClick={() => {
                      setShowNotificationModal(false);
                      setSelectedNotification(null);
                      handleOpenInterviewModal(selectedNotification.data.candidateId);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Interview Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Contact View Modal
interface ContactViewModalProps {
  isOpen: boolean;
  contact: ContactSubmission | null;
  onClose: () => void;
}

export const ContactViewModal: React.FC<ContactViewModalProps> = ({ isOpen, contact, onClose }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all scale-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{contact.name}</h2>
              <p className="text-xs text-slate-500">{contact.email}</p>
              {(contact as any).phone && (
                <p className="text-xs text-slate-400">{(contact as any).phone}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 rounded-full h-8 w-8 p-0">
            <span className="text-xl leading-none">&times;</span>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
              <h3 className="text-lg font-semibold text-slate-900">{contact.subject}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {new Date(contact.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</label>
            <div className="bg-slate-50 p-5 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap text-sm border border-slate-100">
              {contact.message}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-slate-200 hover:bg-white text-slate-600">Close</Button>
          <Button className="ml-2 bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20">
            <Mail className="h-4 w-4 mr-2" />
            Reply via Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
