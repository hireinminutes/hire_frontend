import { ArrowLeft, Home, FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface NotFoundPageProps {
    onNavigate: (page: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects - Made more subtle to ensure text readability */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Card Container - Increased opacity/darkness for better text contrast */}
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[32px] p-8 md:p-12 text-center shadow-2xl shadow-black/50">

                    {/* Icon/Illustration */}
                    <div className="mb-8 relative mx-auto w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                        <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-blue-500/20 border border-white/10">
                            <FileQuestion className="w-10 h-10 text-white -rotate-12" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700 shadow-lg rotate-3">
                            404
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Page Not Found
                    </h1>

                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                        We couldn't find the page you're looking for. It might have been removed or the link might be broken.
                    </p>

                    {/* Buttons - Fixed alignment and visibility */}
                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={() => onNavigate('landing')}
                            className="w-full py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-xl font-bold shadow-lg shadow-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </Button>

                        <Button
                            onClick={() => window.history.back()}
                            className="w-full py-4 bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </Button>
                    </div>

                </div>

                {/* Footer Text - Increased Contrast */}
                <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                    Error 404 • Hire In Minutes
                </p>
            </div>
        </div>
    );
}
