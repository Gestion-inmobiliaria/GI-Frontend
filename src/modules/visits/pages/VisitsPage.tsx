import VisitForm from './VisitForm'
import VisitList from './VisitList'
import React, { useState } from 'react'
import VisitCalendar from './VisitCalendar'


const VisitsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'new' | 'list'>('calendar')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Calendario de Visitas
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Agendar Visita
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Lista de Visitas
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'calendar' && <VisitCalendar />}
      {activeTab === 'new' && <VisitForm onSuccess={() => setActiveTab('calendar')} />}
      {activeTab === 'list' && <VisitList />}
    </div>
  )
}

export default VisitsPage