import { PrivateRoutes } from '@/models/routes.model'
import { STORAGE_MENU_ACTIVE, STORAGE_MENU_SELECTED, getStorage, setStorage } from '@/utils'
import { MenuSideBar } from '@/utils/sidebar.utils'
import { type ReactNode, createContext, useState, useMemo, useContext, useEffect } from 'react'

export interface ISidebarContext {
  isContract: boolean
  selectedMenu: string
  menuActive: Record<string, boolean>
  toggleContract: () => void
  handleSelectedMenu: (menu: string) => void
  handleActivateMenu: (menu: string) => void
  resetMenuState: () => void
}

// Definir todos los posibles menús basados en MenuSideBar
const initializeMenuActive = () => {
  const menuActive: Record<string, boolean> = {};
  
  // Asegurarse de que todos los menús definidos en MenuSideBar están incluidos
  MenuSideBar.forEach(item => {
    menuActive[item.label] = false;
  });
  
  // Incluir otros menús adicionales si los hay
  return {
    ...menuActive,
    'Administrar Empresa': false,
    'Inventario': false,
    'Ventas': false,
    'Compras': false
  };
};

// Constante inicial de menús activos
const MENUACTIVE = initializeMenuActive();

export const SidebarContext = createContext<ISidebarContext>({} as ISidebarContext)

export const useSidebar = (): ISidebarContext => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

const persistedContract = getStorage('contract')
const persistedSelected = getStorage(STORAGE_MENU_SELECTED) ?? PrivateRoutes.DASHBOARD
// Usando el inicializador para garantizar que todos los menús estén presentes
const persistedMenuActive: Record<string, boolean> = 
  JSON.parse(getStorage(STORAGE_MENU_ACTIVE) || 'null') || MENUACTIVE

export const SidebarProvider = ({ children }: { children: ReactNode | JSX.Element | JSX.Element[] }) => {
  const [isContract, setIsContract] = useState<boolean>(persistedContract === 'true')
  const [selectedMenu, setSelectedMenu] = useState<string>(persistedSelected)
  const [menuActive, setMenuActive] = useState<Record<string, boolean>>(persistedMenuActive)

  // Asegurarse de que todos los menús definidos en MenuSideBar estén en menuActive
  useEffect(() => {
    const allMenuLabels = MenuSideBar.map(item => item.label);
    const menuKeys = Object.keys(menuActive);
    
    // Verificar si faltan entradas en menuActive
    const missingMenus = allMenuLabels.filter(label => !menuKeys.includes(label));
    
    if (missingMenus.length > 0) {
      const updatedMenuActive = { ...menuActive };
      missingMenus.forEach(label => {
        updatedMenuActive[label] = false;
      });
      
      setMenuActive(updatedMenuActive);
      setStorage(STORAGE_MENU_ACTIVE, JSON.stringify(updatedMenuActive));
    }
  }, [menuActive]);

  function toggleContract(): void {
    if (!isContract) {
      setStorage(STORAGE_MENU_ACTIVE, JSON.stringify(MENUACTIVE))
      setMenuActive(MENUACTIVE)
    } else {
      const labelMenu = MenuSideBar.find(item => item.children?.find(child => child.path === selectedMenu)
      )?.label
      if (labelMenu) {
        setMenuActive((prev) => ({ ...prev, [labelMenu]: true }))
      }
    }
    setStorage('contract', String(!isContract))
    setIsContract(!isContract)
  }

  function handleSelectedMenu(menu: string): void {
    setSelectedMenu(menu)
    setStorage(STORAGE_MENU_SELECTED, menu)
    
    // Activar automáticamente el menú correspondiente cuando se navega a una ruta
    const parentMenu = MenuSideBar.find(item => 
      item.path === menu || item.children?.some(child => child.path === menu)
    );
    
    if (parentMenu && parentMenu.label) {
      handleActivateMenu(parentMenu.label);
    }
  }

  function handleActivateMenu(menu: string): void {
    console.log("Activating menu:", menu, "Current state:", menuActive[menu]);
    setMenuActive((prev) => ({ ...prev, [menu]: !prev[menu] }))
    setStorage(STORAGE_MENU_ACTIVE, JSON.stringify({ ...menuActive, [menu]: !menuActive[menu] }))
  }
  
  function resetMenuState(): void {
    const resetState = initializeMenuActive();
    setMenuActive(resetState);
    setStorage(STORAGE_MENU_ACTIVE, JSON.stringify(resetState));
  }

  const value = useMemo(() => ({
    isContract,
    menuActive,
    selectedMenu,
    toggleContract,
    handleSelectedMenu,
    handleActivateMenu,
    resetMenuState
  }), [isContract, selectedMenu, menuActive, toggleContract, handleSelectedMenu, handleActivateMenu])

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
