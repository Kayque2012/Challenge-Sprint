import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { ScrollToTop } from '../components/ScrollToTop';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Footer } from '../components/Footer';
import { Home } from '../pages/Home';
import { FAQ } from '../pages/FAQ';
import { Reconhecimentos } from '../pages/Reconhecimentos';
import { QuemSomos } from '../pages/QuemSomos';
import { Sobre } from '../pages/Sobre';
import { Contato } from '../pages/Contato';
import { Formulario } from '../pages/Formulario';
import { Cadastro } from '../pages/Cadastro';
import { Login } from '../pages/Login';
import { AdminDashboard } from '../pages/AdminDashboard';
import { DentistaDashboard } from '../pages/DentistaDashboard';
import { PacienteDashboard } from '../pages/PacienteDashboard';
import { CalculadoraScore } from '../pages/CalculadoraScore';
import { FormularioContato } from '../pages/FormularioContato';
import { Prontuario } from '../pages/Prontuario';
import { Doador } from '../pages/Doador';
import { ApoloniasDoBem } from '../pages/ApoloniasDoBem';

// Layout com Header + Footer para páginas públicas e utilitários
function PublicLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5DC] dark:bg-[#080c17]">
      <Header />
      <motion.div
        key={location.pathname}
        className="flex-grow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.div>
      <Footer />
    </div>
  );
}

/**
 * Roteamento da aplicação Turma do Bem.
 *
 * Auth centralizada em <ProtectedRoute> — verifica sessão e role antes
 * de renderizar cada dashboard, redirecionando para /login se necessário.
 *
 * Grupos de rotas:
 *   PublicLayout   → /, /faq, /quem-somos, /sobre, /reconhecimentos,
 *                    /contato, /formulario, /cadastro, /login, /Doador,
 *                    /Calculadora/Score, /FormularioContato, /prontuario/:nome
 *   Dashboards     → /dashboard/admin    (role: admin | dev)
 *                    /dashboard/dentista (role: dentista | dev)
 *                    /dashboard/paciente (role: paciente)
 *                    Sem Header/Footer — navegação via sidebar própria.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Páginas com Header + Footer ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                  element={<Home />} />
          <Route path="/faq"               element={<FAQ />} />
          <Route path="/reconhecimentos"   element={<Reconhecimentos />} />
          <Route path="/quem-somos"        element={<QuemSomos />} />
          <Route path="/sobre"             element={<Sobre />} />
          <Route path="/contato"           element={<Contato />} />
          <Route path="/formulario"        element={<Formulario />} />
          <Route path="/cadastro"          element={<Cadastro />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/Doador"            element={<Doador />} />
          <Route path="/Calculadora/Score" element={<CalculadoraScore />} />
          <Route path="/FormularioContato" element={<FormularioContato />} />
          <Route path="/prontuario/:nome"  element={<Prontuario />} />
          <Route path="/apolonias-do-bem" element={<ApoloniasDoBem />} />
        </Route>

        {/* ── Dashboards protegidos — sem Header/Footer ── */}
        <Route path="/dashboard/admin"    element={<ProtectedRoute allowedRoles={['admin', 'dev']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/dentista" element={<ProtectedRoute allowedRoles={['dentista', 'dev']}><DentistaDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/paciente" element={<ProtectedRoute allowedRoles={['paciente']}><PacienteDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}