export enum ContractType {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
    ANTICRETICO = 'ANTICRETICO'
}

export enum ContractStatus {
    VIGENTE = 'VIGENTE',
    FINALIZADO = 'FINALIZADO'
}

export enum ContractFormat {
    PDF = 'pdf',
    HTML = 'html'
}

// NUEVOS ENUMS PARA FIRMAS
export enum SignatureStatus {
    NO_REQUIRED = 'NO_REQUIRED',
    PENDING_SIGNATURES = 'PENDING_SIGNATURES',
    PARTIALLY_SIGNED = 'PARTIALLY_SIGNED',
    FULLY_SIGNED = 'FULLY_SIGNED',
    SIGNATURE_EXPIRED = 'SIGNATURE_EXPIRED'
}

export enum SignerType {
    CLIENT = 'CLIENT',
    AGENT = 'AGENT'
}

export enum SignatureItemStatus {
    PENDING = 'PENDING',
    SIGNED = 'SIGNED',
    EXPIRED = 'EXPIRED'
}

export interface Property {
    id: string;
    address: string;
    price: number;
    description?: string;
    city?: string;
    zone?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
}

// INTERFACES EXISTENTES
export interface ContractFormData {
    contractNumber: string;
    type: ContractType;
    clientName: string;
    clientDocument: string;
    clientPhone?: string;
    clientEmail?: string;
    agentName: string;
    agentDocument: string;
    amount: string;
    startDate: string;
    endDate: string;
    propertyId: string;
    paymentMethodId: string;
    notes?: string;
    // NUEVOS CAMPOS PARA FIRMA
    requiresSignature?: boolean;
    agentEmail?: string;
}

// NUEVA INTERFACE PARA CREAR CONTRATO CON FIRMA
export interface ContractWithSignatureFormData extends ContractFormData {
    clientEmailForSignature: string;
    agentEmailForSignature: string;
}

// NUEVA INTERFACE PARA FIRMA INDIVIDUAL
export interface ContractSignature {
    id: string;
    signerType: SignerType;
    signerName: string;
    signerDocument: string;
    signatureImage?: string;
    signedAt?: string;
    ipAddress?: string;
    signatureToken: string;
    tokenExpiration: string;
    status: SignatureItemStatus;
    userAgent?: string;
}

export interface CreateContractPayload {
    contractNumber: number;
    type: ContractType;
    status: ContractStatus;
    amount: number;
    startDate: string;
    endDate: string;
    clientName: string;
    clientDocument: string;
    clientPhone?: string;
    clientEmail?: string;
    agentName: string;
    agentDocument: string;
    contractContent: string;
    contractFormat: ContractFormat;
    notes?: string;
    propertyId: string;
    paymentMethodId: string;
    requiresSignature?: boolean;
    agentEmail?: string;
}

// NUEVO PAYLOAD PARA CONTRATO CON FIRMA
export interface CreateContractWithSignaturePayload extends CreateContractPayload {
    clientEmailForSignature: string;
    agentEmailForSignature: string;
}

export interface Contract {
    id: string;
    contractNumber: number;
    type: ContractType;
    status: ContractStatus;
    amount: number;
    startDate: string;
    endDate: string;
    clientName: string;
    clientDocument: string;
    clientPhone?: string;
    clientEmail?: string;
    agentName: string;
    agentDocument: string;
    contractContent: string;
    contractFormat: ContractFormat;
    notes?: string;
    property: Property;
    payment_method: PaymentMethod;
    createdAt: string;
    updatedAt: string;
    // NUEVOS CAMPOS PARA FIRMA
    signatureStatus: SignatureStatus;
    signatureStartedAt?: string;
    signatures: ContractSignature[];
}

// NUEVAS INTERFACES PARA PROCESO DE FIRMA
export interface SignatureVerification {
    isValid: boolean;
    contract: Contract;
    signerInfo: {
        signerType: SignerType;
        signerName: string;
        signerDocument: string;
    };
    errorMessage?: string;
}

export interface SignContractData {
    token: string;
    signatureImage: string;
    documentVerification: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface SignatureStatusResponse {
    signatureStatus: SignatureStatus;
    signatures: {
        signerType: SignerType;
        signerName: string;
        status: SignatureItemStatus;
        signedAt?: string;
    }[];
    isFullySigned: boolean;
    signatureStartedAt?: string;
}

export interface InitiateSignatureData {
    clientEmail: string;
    agentEmail: string;
}

export interface SignatureStatistics {
    total: number;
    noSignatureRequired: number;
    pendingSignatures: number;
    partiallySigned: number;
    fullySigned: number;
    expired: number;
}