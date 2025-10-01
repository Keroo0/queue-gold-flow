import React, { createContext, useContext, useState, useEffect } from 'react';

interface Queue {
  number: string;
  status: 'waiting' | 'serving' | 'completed';
  timestamp: number;
  servedAt?: number;
}

interface QueueContextType {
  queues: Queue[];
  currentServing: string | null;
  addToQueue: () => string | null;
  callNext: () => void;
  completeServing: () => void;
  getWaitingCount: () => number;
  getServingCount: () => number;
  getTotalServed: () => number;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [currentServing, setCurrentServing] = useState<string | null>(null);

  const addToQueue = (): string | null => {
    const nextNumber = queues.length + 1;
    if (nextNumber > 200) {
      return null; // Queue is full
    }
    
    const queueNumber = `A${String(nextNumber).padStart(3, '0')}`;
    const newQueue: Queue = {
      number: queueNumber,
      status: 'waiting',
      timestamp: Date.now(),
    };
    
    setQueues(prev => [...prev, newQueue]);
    return queueNumber;
  };

  const callNext = () => {
    const nextWaiting = queues.find(q => q.status === 'waiting');
    if (nextWaiting) {
      setQueues(prev =>
        prev.map(q =>
          q.number === nextWaiting.number
            ? { ...q, status: 'serving', servedAt: Date.now() }
            : q
        )
      );
      setCurrentServing(nextWaiting.number);
    }
  };

  const completeServing = () => {
    if (currentServing) {
      setQueues(prev =>
        prev.map(q =>
          q.number === currentServing
            ? { ...q, status: 'completed' }
            : q
        )
      );
      setCurrentServing(null);
    }
  };

  const getWaitingCount = () => queues.filter(q => q.status === 'waiting').length;
  const getServingCount = () => queues.filter(q => q.status === 'serving').length;
  const getTotalServed = () => queues.filter(q => q.status === 'completed').length;

  return (
    <QueueContext.Provider
      value={{
        queues,
        currentServing,
        addToQueue,
        callNext,
        completeServing,
        getWaitingCount,
        getServingCount,
        getTotalServed,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
