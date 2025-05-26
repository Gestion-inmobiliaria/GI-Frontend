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
    propertyId: number;
    paymentMethodId: number;
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
}
