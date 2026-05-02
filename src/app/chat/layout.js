import { SocketProvider } from '@/components/SocketProvider';

export const metadata = {
  title: 'Bridge — Chat',
  description: 'Bridge chat interface',
};

export default function ChatLayout({ children }) {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </div>
  );
}
