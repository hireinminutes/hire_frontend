import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const toast = {
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-lg border animate-fade-in-up flex items-center gap-3
              ${t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ''}
              ${t.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : ''}
              ${t.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' : ''}
            `}
                    >
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${t.type === 'success' ? 'bg-emerald-100 text-emerald-600' : ''}
              ${t.type === 'error' ? 'bg-red-100 text-red-600' : ''}
              ${t.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
            `}>
                            {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {t.type === 'info' && <Info className="w-5 h-5" />}
                        </div>

                        <p className="flex-1 text-sm font-medium">{t.message}</p>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="p-1 rounded-full hover:bg-black/5 transition-colors"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
