import React from 'react';
import { Crown, X } from 'lucide-react';
import { Button } from './Button';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    title?: string;
    message?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    onUpgrade,
    title = "Upgrade Required",
    message = "Unlock exclusive features and accelerate your career by upgrading your plan."
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden animate-fade-in-up border border-slate-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                        <Crown className="w-8 h-8 text-amber-600" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                        {title}
                    </h3>

                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="space-y-3">
                        <Button
                            onClick={onUpgrade}
                            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            View Plans & Upgrade
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="w-full h-12 text-slate-500 hover:text-slate-700 font-bold hover:bg-slate-50 rounded-xl"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
