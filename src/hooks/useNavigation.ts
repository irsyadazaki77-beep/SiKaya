import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type HoverMenuType = 'belajar' | 'simulasi' | 'keuangan' | 'komunitas' | null;

export function useNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHoverMenu, setActiveHoverMenu] = useState<HoverMenuType>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile menu accordions
  const [isMobileBelajarOpen, setIsMobileBelajarOpen] = useState(false);
  const [isMobileSimulasiOpen, setIsMobileSimulasiOpen] = useState(false);
  const [isMobileKeuanganOpen, setIsMobileKeuanganOpen] = useState(false);
  const [isMobileKomunitasOpen, setIsMobileKomunitasOpen] = useState(false);

  const handleMouseEnterMenu = (menu: HoverMenuType) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveHoverMenu(menu);
  };

  const handleMouseLeaveMenu = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverMenu(null);
    }, 150);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setActiveHoverMenu(null);
  };

  const navigateTo = (path: string, state?: Record<string, unknown>) => {
    closeAllMenus();
    if (state) {
      navigate(path, { state });
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen,
    activeHoverMenu,
    setActiveHoverMenu,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
    closeAllMenus,
    navigateTo,
    location,
    isMobileBelajarOpen,
    setIsMobileBelajarOpen,
    isMobileSimulasiOpen,
    setIsMobileSimulasiOpen,
    isMobileKeuanganOpen,
    setIsMobileKeuanganOpen,
    isMobileKomunitasOpen,
    setIsMobileKomunitasOpen
  };
}
