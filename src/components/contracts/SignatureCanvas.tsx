import React, { useRef, useEffect, useState } from 'react';
import { ContractSignatureService } from '@/services/contract-signature.service';

interface SignatureCanvasProps {
    onSignatureChange: (signatureData: string | null) => void;
    disabled?: boolean;
    className?: string;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ 
    onSignatureChange, 
    disabled = false,
    className = "" 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurar canvas
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // Para mejor resolución
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Configurar estilo de dibujo
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Limpiar canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        
        if ('touches' in event) {
            // Touch event
            const touch = event.touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        } else {
            // Mouse event
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        
        event.preventDefault();
        setIsDrawing(true);
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { x, y } = getCoordinates(event);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;
        
        event.preventDefault();
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { x, y } = getCoordinates(event);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        setHasSignature(true);
        updateSignature();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const updateSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (ContractSignatureService.hasSignatureContent(canvas)) {
            const signatureData = ContractSignatureService.canvasToSignatureImage(canvas);
            onSignatureChange(signatureData);
        } else {
            onSignatureChange(null);
            setHasSignature(false);
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ContractSignatureService.clearSignatureCanvas(canvas);
        
        // Volver a configurar el fondo blanco
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        setHasSignature(false);
        onSignatureChange(null);
    };

    return (
        <div className={`signature-canvas-container ${className}`}>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4">
                <canvas
                    ref={canvasRef}
                    className={`w-full h-40 border border-gray-200 dark:border-gray-700 rounded cursor-crosshair ${
                        disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ touchAction: 'none' }} // Prevenir scroll en móviles
                />
                
                <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {disabled 
                            ? 'Firma deshabilitada' 
                            : 'Dibuje su firma arriba usando el mouse o su dedo'
                        }
                    </p>
                    
                    <button
                        type="button"
                        onClick={clearSignature}
                        disabled={disabled || !hasSignature}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Limpiar
                    </button>
                </div>
            </div>
            
            {hasSignature && (
                <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Firma capturada
                </div>
            )}
        </div>
    );
};

export default SignatureCanvas;