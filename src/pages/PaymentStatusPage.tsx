
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getAuthHeaders } from '../contexts/AuthContext';
import { getApiUrl } from '../config/api';

export function PaymentStatusPage({ onNavigate }: { onNavigate: any }) {
    const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
    const [message, setMessage] = useState('Verifying payment...');

    useEffect(() => {
        const verify = async () => {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get('order_id');

            if (!orderId) {
                setStatus('failure');
                setMessage('No order ID found');
                return;
            }

            try {
                const response = await fetch(getApiUrl('/api/payment/verify'), {
                    method: 'POST',
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderId })
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Payment successful! Your plan has been upgraded.');
                } else {
                    setStatus('failure');
                    setMessage(data.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error(error);
                setStatus('failure');
                setMessage('An error occurred during verification');
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="animate-pulse">
                        <div className="h-16 w-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 w-48 bg-slate-200 rounded mx-auto"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
                        <p className="text-slate-600 mb-6">{message}</p>
                        <Button
                            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'overview')}
                            className="w-full bg-slate-900 text-white"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                )}

                {status === 'failure' && (
                    <div>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                        <p className="text-slate-600 mb-6">{message}</p>
                        <Button
                            onClick={() => onNavigate('job-seeker-dashboard', undefined, undefined, undefined, undefined, undefined, 'browse')}
                            variant="outline"
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
