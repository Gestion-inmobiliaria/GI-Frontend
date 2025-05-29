import React, { useState, useEffect } from 'react';
import { ContractSignatureService } from '@/services/contract-signature.service';
import { SignatureStatistics } from '@/models/contract.model';

const SignatureStatisticsComponent: React.FC = () => {
    const [statistics, setStatistics] = useState<SignatureStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError('');
            const stats = await ContractSignatureService.getSignatureStatistics();
            setStatistics(stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (value: number, total: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="text-red-600 dark:text-red-400 text-center">
                    <p>{error}</p>
                    <button
                        onClick={fetchStatistics}
                        className="mt-2 text-sm bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!statistics) return null;

    const statsData = [
        {
            label: 'Sin firma requerida',
            value: statistics.noSignatureRequired,
            color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            percentage: getPercentage(statistics.noSignatureRequired, statistics.total)
        },
        {
            label: 'Pendientes de firma',
            value: statistics.pendingSignatures,
            color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            percentage: getPercentage(statistics.pendingSignatures, statistics.total)
        },
        {
            label: 'Firmados parcialmente',
            value: statistics.partiallySigned,
            color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            percentage: getPercentage(statistics.partiallySigned, statistics.total)
        },
        {
            label: 'Completamente firmados',
            value: statistics.fullySigned,
            color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            percentage: getPercentage(statistics.fullySigned, statistics.total)
        },
        {
            label: 'Firmas expiradas',
            value: statistics.expired,
            color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            percentage: getPercentage(statistics.expired, statistics.total)
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Estadísticas de Firmas
                </h3>
                <button
                    onClick={fetchStatistics}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Total de contratos</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{statistics.total}</span>
                </div>
            </div>

            <div className="space-y-3">
                {statsData.map((stat, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">{stat.label}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stat.value} ({stat.percentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${stat.color.split(' ')[0]}`}
                                style={{ width: `${stat.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen rápido */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {statistics.fullySigned}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Completados</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {statistics.pendingSignatures + statistics.partiallySigned}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">En proceso</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignatureStatisticsComponent;