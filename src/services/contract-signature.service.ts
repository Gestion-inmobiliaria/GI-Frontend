import { API_URL } from '@/config/constants';
import {
    InitiateSignatureData,
    SignatureVerification,
    SignContractData,
    SignatureStatusResponse,
    SignerType,
    SignatureStatistics
} from '@/models/contract.model';

export class ContractSignatureService {
    private static readonly BASE_URL = `${API_URL}/api`;

    /**
     * Iniciar proceso de firma para un contrato existente
     */
    static async initiateSignatureProcess(
        contractId: string, 
        signatureData: InitiateSignatureData
    ): Promise<{ message: string; tokens: { client: string; agent: string } }> {
        const response = await fetch(`${this.BASE_URL}/contracts/${contractId}/initiate-signatures`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signatureData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar proceso de firma');
        }

        return await response.json();
    }

    /**
     * Verificar token de firma y obtener datos del contrato
     */
    static async verifySignatureToken(token: string): Promise<SignatureVerification> {
        const response = await fetch(`${this.BASE_URL}/signature/verify/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Token de firma inválido');
        }

        return await response.json();
    }

    /**
     * Firmar contrato digitalmente
     */
    static async signContract(signData: SignContractData): Promise<{ message: string; contractStatus: string }> {
        const response = await fetch(`${this.BASE_URL}/signature/sign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al firmar contrato');
        }

        return await response.json();
    }

    /**
     * Obtener estado de firmas de un contrato
     */
    static async getSignatureStatus(contractId: string): Promise<SignatureStatusResponse> {
        const response = await fetch(`${this.BASE_URL}/contracts/${contractId}/signature-status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener estado de firmas');
        }

        return await response.json();
    }

    /**
     * Reenviar invitación de firma
     */
    static async resendSignatureInvitation(
        contractId: string, 
        signerType: SignerType
    ): Promise<{ message: string }> {
        const response = await fetch(`${this.BASE_URL}/contracts/${contractId}/resend-invitation/${signerType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al reenviar invitación');
        }

        return await response.json();
    }

    /**
     * Obtener estadísticas de firmas
     */
    static async getSignatureStatistics(): Promise<SignatureStatistics> {
        const response = await fetch(`${this.BASE_URL}/contracts/signature-statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener estadísticas');
        }

        return await response.json();
    }

    /**
     * Obtener información del navegador y ubicación para metadatos de firma
     */
    static getSignatureMetadata(): { userAgent: string; ipAddress?: string } {
        const userAgent = navigator.userAgent;
        
        // Nota: La IP real solo se puede obtener desde el servidor
        // Este es solo un placeholder para el frontend
        return {
            userAgent,
            ipAddress: undefined // Se obtendrá automáticamente en el backend
        };
    }

    /**
     * Validar formato de imagen de firma
     */
    static validateSignatureImage(imageData: string): boolean {
        // Verificar que sea una imagen válida en base64
        const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
        return base64Regex.test(imageData);
    }

    /**
     * Convertir canvas a base64 para firma
     */
    static canvasToSignatureImage(canvas: HTMLCanvasElement): string {
        return canvas.toDataURL('image/png');
    }

    /**
     * Limpiar canvas de firma
     */
    static clearSignatureCanvas(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * Verificar si el canvas tiene contenido (firma)
     */
    static hasSignatureContent(canvas: HTMLCanvasElement): boolean {
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data.some((channel, index) => {
            // Verificar canales de color (omitir alfa)
            return index % 4 !== 3 && channel !== 0;
        });
    }

    /**
     * Obtener texto descriptivo del estado de firma
     */
    static getSignatureStatusText(status: string): { text: string; color: string } {
        switch (status) {
            case 'NO_REQUIRED':
                return { text: 'Sin firma requerida', color: 'text-gray-600' };
            case 'PENDING_SIGNATURES':
                return { text: 'Pendiente de firmas', color: 'text-yellow-600' };
            case 'PARTIALLY_SIGNED':
                return { text: 'Firmado parcialmente', color: 'text-blue-600' };
            case 'FULLY_SIGNED':
                return { text: 'Completamente firmado', color: 'text-green-600' };
            case 'SIGNATURE_EXPIRED':
                return { text: 'Firmas expiradas', color: 'text-red-600' };
            default:
                return { text: 'Estado desconocido', color: 'text-gray-600' };
        }
    }

    /**
     * Calcular tiempo restante para expiración de token
     */
    static getTimeUntilExpiration(expirationDate: string): { 
        isExpired: boolean; 
        timeLeft: string; 
        urgency: 'low' | 'medium' | 'high' 
    } {
        const now = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
            return { isExpired: true, timeLeft: 'Expirado', urgency: 'high' };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        let timeLeft: string;
        let urgency: 'low' | 'medium' | 'high';

        if (days > 0) {
            timeLeft = `${days} día${days > 1 ? 's' : ''} restante${days > 1 ? 's' : ''}`;
            urgency = days > 2 ? 'low' : 'medium';
        } else if (hours > 0) {
            timeLeft = `${hours} hora${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}`;
            urgency = hours > 12 ? 'medium' : 'high';
        } else {
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            timeLeft = `${minutes} minuto${minutes > 1 ? 's' : ''} restante${minutes > 1 ? 's' : ''}`;
            urgency = 'high';
        }

        return { isExpired: false, timeLeft, urgency };
    }
}