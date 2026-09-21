import React from 'react';
import { Modal } from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import { AuthPanel } from './AuthPanel';
import { User } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, addToast } = useAppContext();

  const handleSuccess = (user: User) => {
    login(user);
    setAuthModalOpen(false);
    addToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setAuthModalOpen(false)}
      title="Welcome to BorrowBuddy"
      maxWidth="md"
    >
      <div className="pt-2">
        <AuthPanel
          isModal={true}
          initialTab="login"
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  );
};
