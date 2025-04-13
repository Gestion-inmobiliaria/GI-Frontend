import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { AlertTriangle } from 'lucide-react'

export function NotificacionPage() {
  const bandera = true 
  // const bandera2 = true 
  return (
    <ScrollArea>
      <div className="flex flex-col gap-2 p-4 pt-0 hover:bg-accent" >        
        <button
            key={45}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:dark:bg-dark-bg-secondary hover:bg-light-bg-primary',
              !bandera && 'bg-muted'
            )}
            onClick={() => !bandera           
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">Stock Minimo</div>
                  { bandera && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    bandera
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                12 jun 2024 12:00
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              Coca Cola a llegado al stock mínimo              
            </div>
            <div className="text-xs font-medium">Stock Actual: 50</div>          
            {bandera
              ? (
              <div className="flex items-center gap-2 w-full justify-between">                
                  <Badge key={41} variant={getBadgeVariantFromLabel('work')}>
                    Importante
                  </Badge>
                  <AlertTriangle className="text-red-600" size={24} />                
              </div>
                )
              : null}
          </button>        
          <button        
            key={4515}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:dark:bg-dark-bg-secondary hover:bg-light-bg-primary',
              !bandera && 'bg-muted'
            )}
            onClick={() => !bandera         
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">Stock Minimo</div>
                  { !bandera && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    bandera
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                28 jun 2024 7:00
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              Sprite a llegado al stock mínimo              
            </div>
            <div className="text-xs font-medium">Stock Actual: 15</div>            
            {bandera
              ? (
              <div className="flex items-center gap-2 w-full justify-between">                
                  <Badge key={41666} variant={getBadgeVariantFromLabel('personal')}>
                    Importante
                  </Badge>
                  <AlertTriangle className="text-red-600" size={24} />                
              </div>
                )
              : null}
          </button>        
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>['variant'] {
  if (['work'].includes(label.toLowerCase())) {
    return 'default'
  }

  if (['personal'].includes(label.toLowerCase())) {
    return 'outline'
  }

  return 'secondary'
}
