import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Volta ao topo da página sempre que o pathname muda.
 * Deve ser renderizado dentro do <BrowserRouter>, fora do <Routes>.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
