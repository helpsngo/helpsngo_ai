import React from 'react';
import { UserProfile } from '../types';
import { UserCertificatesVaultModal } from './UserCertificatesVaultModal';

interface CertificateModalProps {
  user: UserProfile;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenAdminStudio?: () => void;
  initialCertificateId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ 
  user, 
  onClose,
  onOpenAuth,
  onOpenAdminStudio,
  initialCertificateId
}) => {
  return (
    <UserCertificatesVaultModal
      user={user}
      onClose={onClose}
      onOpenAuth={onOpenAuth}
      onOpenAdminStudio={onOpenAdminStudio}
      initialCertificateId={initialCertificateId}
    />
  );
};
