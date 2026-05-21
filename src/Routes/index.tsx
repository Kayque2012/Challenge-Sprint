import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
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

/**
 * Roteamento da aplicação Turma do Bem.
 *
 * Auth centralizada em <ProtectedRoute> — verifica sessão e role antes
 * de renderizar cada dashboard, redirecionando para /login se necessário.
 *
 * Grupos de rotas:
 *   Públicas       → /, /faq, /quem-somos, /sobre, /reconhecimentos,
 *                    /contato, /formulario, /cadastro, /login, /Doador
 *   Protegidas     → /dashboard/admin    (role: admin | dev)
 *                    /dashboard/dentista (role: dentista | dev)
 *                    /dashboard/paciente (role: paciente)
 *   Utilitários    → /Calculadora/Score, /FormularioContato,
 *                    /prontuario/:nome
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F5F5DC]">
        <Header />
        <div className="flex-grow">
          <Routes>
            {/* ── Páginas públicas ── */}
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reconhecimentos" element={<Reconhecimentos />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Doador" element={<Doador />} />

            {/* ── Dashboards protegidos ── */}
            <Route path="/dashboard/admin"    element={<ProtectedRoute allowedRoles={['admin', 'dev']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/dentista" element={<ProtectedRoute allowedRoles={['dentista', 'dev']}><DentistaDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/paciente" element={<ProtectedRoute allowedRoles={['paciente']}><PacienteDashboard /></ProtectedRoute>} />

            {/* ── Utilitários ── */}
            <Route path="/Calculadora/Score"   element={<CalculadoraScore />} />
            <Route path="/FormularioContato"   element={<FormularioContato />} />
            <Route path="/prontuario/:nome"    element={<Prontuario />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}