import React from 'react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppContext } from '../context/AppContext';

export const NotFoundView: React.FC = () => {
  const { navigate } = useAppContext();

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-cream">
      <div className="max-w-md w-full px-4">
        <EmptyState
          title="Page not found"
          description="The page you are looking for doesn't exist or has been moved."
          action={<Button onClick={() => navigate('landing')}>Go to Home</Button>}
        />
      </div>
    </div>
  );
};
