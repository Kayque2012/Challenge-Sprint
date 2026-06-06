import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './Routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'inherit', fontSize: '14px' },
            duration: 4000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
