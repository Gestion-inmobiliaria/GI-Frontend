import React from 'react';
import { SignatureStatus } from '@/models/contract.model';
import { ContractSignatureService } from '@/services/contract-signature.service';

interface SignatureStatusBadgeProps {
    status: SignatureStatus;
    className?: string;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const SignatureStatusBadge: React.FC<SignatureStatusBadgeProps> = ({ 
    status, 
    className = '', 
    showIcon = true,
    size = 'md'
}) => {
    const { text } = ContractSignatureService.getSignatureStatusText(status);
    
    // Configuración de estilos por tamaño
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    // Estilos específicos por estado
    const getStatusStyles = (status: SignatureStatus) => {
        switch (status) {
            case SignatureStatus.NO_REQUIRED:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
            case SignatureStatus.PENDING_SIGNATURES:
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case SignatureStatus.PARTIALLY_SIGNED:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case SignatureStatus.FULLY_SIGNED:
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
            case SignatureStatus.SIGNATURE_EXPIRED:
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    // Iconos por estado
    const getStatusIcon = (status: SignatureStatus) => {
        const baseClasses = `${iconSizes[size]} mr-1`;
        
        switch (status) {
            case SignatureStatus.NO_REQUIRED:
                return (
                    <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case SignatureStatus.PENDING_SIGNATURES:
                return (
                    <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case SignatureStatus.PARTIALLY_SIGNED:
                return (
                    <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case SignatureStatus.FULLY_SIGNED:
                return (
                    <svg className={baseClasses} fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case SignatureStatus.SIGNATURE_EXPIRED:
                return (
                    <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const statusStyles = getStatusStyles(status);
    const sizeStyle = sizeClasses[size];

    return (
        <span className={`inline-flex items-center border rounded-full font-medium ${statusStyles} ${sizeStyle} ${className}`}>
            {showIcon && getStatusIcon(status)}
            {text}
        </span>
    );
};

export default SignatureStatusBadge;