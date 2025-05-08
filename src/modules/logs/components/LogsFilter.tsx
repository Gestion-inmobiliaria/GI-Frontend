import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { type DateRange } from 'react-day-picker'

interface LogsFilterProps {
  onSearch: (search: string) => void
  onDateFilter: (fromDate?: string, toDate?: string) => void
}

export const LogsFilter: React.FC<LogsFilterProps> = ({ onSearch, onDateFilter }) => {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(search)
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)

    if (range?.from) {
      const fromDate = format(range.from, 'yyyy-MM-dd')
      const toDate = range.to ? format(range.to, 'yyyy-MM-dd') : undefined
      onDateFilter(fromDate, toDate)
    } else {
      onDateFilter(undefined, undefined)
    }

    if (range?.from && range.to) {
      setIsCalendarOpen(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setDateRange(undefined)
    onSearch('')
    onDateFilter(undefined, undefined)
  }

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en bitácora..."
              className="pl-8"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'P', { locale: es })} -{' '}
                      {format(dateRange.to, 'P', { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, 'P', { locale: es })
                  )
                ) : (
                  'Filtrar por fecha'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={handleDateChange}
                locale={es}
                disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    </Card>
  )
}
