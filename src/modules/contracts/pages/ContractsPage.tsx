import React, { useState } from 'react'
import ContractList from './ContractList'
import ContractGenerator from './ContractGenerator'



const ContractsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'list'>('generator')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generator')}
              className={`${
                activeTab === 'generator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Generar Contrato
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Contratos Existentes
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'generator' ? <ContractGenerator /> : <ContractList />}
    </div>
  )
}

export default ContractsPage
