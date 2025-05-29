import SignatureCanvas from './SignatureCanvas';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContractSignatureService } from '@/services/contract-signature.service';
import { SignatureVerification, SignContractData } from '@/models/contract.model';

const SignaturePage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [verification, setVerification] = useState<SignatureVerification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [documentVerification, setDocumentVerification] = useState('');
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showContract, setShowContract] = useState(false);

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setError('Token de firma no proporcionado');
            setLoading(false);
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (!token) {
                throw new Error('Token no válido');
            }

            const verificationResult = await ContractSignatureService.verifySignatureToken(token);
            setVerification(verificationResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al verificar token');
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureChange = (signature: string | null) => {
        setSignatureImage(signature);
    };

    const handleSignContract = async () => {
        if (!verification || !token || !signatureImage || !documentVerification) {
            setError('Por favor complete todos los campos requeridos');
            return;
        }

        // Verificar documento
        if (documentVerification.trim() !== verification.signerInfo.signerDocument) {
            setError('El documento de identidad no coincide con el registrado');
            return;
        }

        // Validar formato de firma
        if (!ContractSignatureService.validateSignatureImage(signatureImage)) {
            setError('Formato de firma no válido');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const metadata = ContractSignatureService.getSignatureMetadata();
            
            const signData: SignContractData = {
                token,
                signatureImage,
                documentVerification: documentVerification.trim(),
                userAgent: metadata.userAgent
            };

            const result = await ContractSignatureService.signContract(signData);
            
            // Mostrar mensaje de éxito y redirigir
            alert(`¡Firma registrada exitosamente!\n\n${result.message}\n\nEstado del contrato: ${result.contractStatus}`);
            
            // Redirigir a página de confirmación o inicio
            navigate('/', { replace: true });
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al firmar contrato');
        } finally {
            setIsSubmitting(false);
        }
    };

    const decodeContractContent = (content: string) => {
        try {
            const base64Content = content.replace(/^data:text\/html;base64,/, '');
            return atob(base64Content);
        } catch (error) {
            return 'Error al decodificar el contenido del contrato';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Verificando token de firma...</p>
                </div>
            </div>
        );
    }

    if (error && !verification) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="text-center">
                        <div className="text-red-600 dark:text-red-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error de Verificación</h1>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.close()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!verification) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="text-center">
                        <div className="text-blue-600 dark:text-blue-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Firma Digital de Contrato
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Contrato #{verification.contract.contractNumber}
                        </p>
                    </div>
                </div>

                {/* Información del Contrato */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Información del Contrato
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Tipo:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{verification.contract.type}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Monto:</span>
                            <p className="font-medium text-gray-900 dark:text-white">${verification.contract.amount}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Cliente:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{verification.contract.clientName}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Agente:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{verification.contract.agentName}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <button
                            onClick={() => setShowContract(!showContract)}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {showContract ? 'Ocultar' : 'Ver'} contrato completo
                        </button>
                    </div>
                </div>

                {/* Contrato Completo */}
                {showContract && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Contrato Completo
                        </h3>
                        <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4">
                            {verification.contract.contractFormat === 'html' ? (
                                <div 
                                    className="prose max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ 
                                        __html: decodeContractContent(verification.contract.contractContent) 
                                    }}
                                />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Contrato en formato PDF
                                    </p>
                                    <a
                                        href={verification.contract.contractContent}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block transition-colors"
                                    >
                                        Abrir PDF
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Información del Firmante */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Información del Firmante
                    </h2>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="text-blue-600 dark:text-blue-400 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {verification.signerInfo.signerName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {verification.signerInfo.signerType === 'CLIENT' ? 'Cliente' : 'Agente'} - 
                                    CI: {verification.signerInfo.signerDocument}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proceso de Firma */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Proceso de Firma
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Verificación de Documento */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Verificación de Identidad
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Por favor ingrese su número de documento de identidad para verificar su identidad:
                        </p>
                        <input
                            type="text"
                            value={documentVerification}
                            onChange={(e) => setDocumentVerification(e.target.value)}
                            placeholder="Ingrese su CI/NIT"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Área de Firma */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Su Firma Digital
                        </label>
                        <SignatureCanvas
                            onSignatureChange={handleSignatureChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Términos y Condiciones */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start">
                            <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Declaración de Conformidad
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Al firmar este contrato, declaro que:
                                </p>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                                    <li>• He leído y entendido completamente el contenido del contrato</li>
                                    <li>• Acepto todos los términos y condiciones establecidos</li>
                                    <li>• La información proporcionada es verídica</li>
                                    <li>• Mi firma digital tiene la misma validez legal que una firma manuscrita</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.close()}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white py-3 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        
                        <button
                            onClick={handleSignContract}
                            disabled={isSubmitting || !signatureImage || !documentVerification.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Firmando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Firmar Contrato
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignaturePage;