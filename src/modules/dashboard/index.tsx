import { useHeader } from '@/hooks'
const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])

  return (
    <div>Dashboard</div>
  )
}

export default DashboardPage
