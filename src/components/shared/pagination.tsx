import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationProps {
  // Nueva interfaz que maneja cualquiera de estos patrones de props
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  
  // Props alternativos que se usan en la página de usuarios
  allItems?: number;
  currentItems?: number;
  limit?: number;
  offset?: number;
  newPage?: (totalItems: number) => void;
  prevPage?: () => void;
  setOffset?: (offset: number) => void;
  setLimit?: (limit: number) => void;
  params?: boolean;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  // Combinar ambos tipos de props
  const totalItems = props.totalItems ?? props.allItems ?? 0;
  const itemsPerPage = props.itemsPerPage ?? props.limit ?? 10;
  const currentPage = props.currentPage ?? (props.offset !== undefined ? Math.floor(props.offset / itemsPerPage) + 1 : 1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePrevPage = () => {
    if (props.onPageChange && currentPage > 1) {
      props.onPageChange(currentPage - 1);
    } else if (props.prevPage) {
      props.prevPage();
    }
  };
  
  const handleNextPage = () => {
    if (props.onPageChange && currentPage < totalPages) {
      props.onPageChange(currentPage + 1);
    } else if (props.newPage) {
      props.newPage(totalItems);
    }
  };
  
  const handleItemsPerPageChange = (value: number) => {
    if (props.onItemsPerPageChange) {
      props.onItemsPerPageChange(value);
    } else if (props.setLimit) {
      props.setLimit(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="text-sm text-muted-foreground">
        Mostrando {((currentPage - 1) * itemsPerPage) + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
      </div>
      
      <div className="flex items-center gap-2">
        <Select 
          value={itemsPerPage.toString()} 
          onValueChange={(value) => handleItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Mostrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="25">25 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm px-3 py-1">
            {currentPage} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
