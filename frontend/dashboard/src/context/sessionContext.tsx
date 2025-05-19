'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserSession } from '@/app/lib/session';
import { ISession } from '@/middleware';

interface SessionContextProps {
    sessionUser: ISession | null;
    setSessionUser: React.Dispatch<React.SetStateAction<ISession | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [sessionUser, setSessionUser] = useState<ISession | null>(null);

    useEffect(() => {
        getUserSession().then((res) => {
            console.log("setando sessão do usuário")
            setSessionUser(res);
        });
    }, []);

    return (
        <SessionContext.Provider value={{ sessionUser, setSessionUser }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextProps => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
