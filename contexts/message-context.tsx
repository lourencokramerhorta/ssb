/**
 * Message Context
 * 
 * Global message/toast system that can be triggered from anywhere in the app.
 * 
 * Usage:
 *   const { showMessage } = useMessage();
 *   showMessage('success', 'Profile saved!');
 *   showMessage('error', 'Something went wrong');
 */

import { Message, type MessageType } from '@/components/message';
import { createContext, useContext, useState } from 'react';

type MessageState = {
  type: MessageType;
  text: string;
} | null;

type MessageContextType = {
  showMessage: (type: MessageType, text: string, duration?: number) => void;
  hideMessage: () => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<MessageState>(null);
  const [duration, setDuration] = useState(4000);

  const showMessage = (type: MessageType, text: string, messageDuration = 4000) => {
    setDuration(messageDuration);
    setMessage({ type, text });
  };

  const hideMessage = () => {
    setMessage(null);
  };

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      {message && (
        <Message
          type={message.type}
          message={message.text}
          duration={duration}
          onDismiss={hideMessage}
        />
      )}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}

