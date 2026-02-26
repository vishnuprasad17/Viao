import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOtpTimerReturn {
    timeRemaining: number;
    canResend: boolean;
    isExpired: boolean;
    startTimer: (expiresAt?: number) => void;
    formatTime: (s: number) => string;
}

export const useOtpTimer = (): UseOtpTimerReturn => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startTimer = useCallback((expiresAt?: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const getRemaining = () => {
            const diffMs  = (expiresAt ?? Date.now() + 120_000) - Date.now();
            return Math.max(0, Math.ceil(diffMs / 1000));
        };

        setTimeRemaining(getRemaining());

        intervalRef.current = setInterval(() => {
            const remaining = getRemaining();
            setTimeRemaining(remaining);

            if (remaining <= 0) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
            }
        }, 500);
    }, []);

    const formatTime = useCallback((seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    const canResend  = timeRemaining === 0;
    const isExpired  = canResend;

    return { timeRemaining, canResend, isExpired, startTimer, formatTime };
};