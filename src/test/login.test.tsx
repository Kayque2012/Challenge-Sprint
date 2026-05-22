import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';

// Mocka fetch globalmente para não bater na API real
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe('Login — renderização', () => {
  it('exibe o título de boas-vindas', () => {
    renderLogin();
    expect(screen.getByText('Bem-vindo!')).toBeInTheDocument();
  });

  it('exibe campo de e-mail e botão Entrar', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('exibe links para cadastro e doador', () => {
    renderLogin();
    expect(screen.getByText(/Cadastre-se agora/i)).toBeInTheDocument();
    expect(screen.getByText(/Seja um Doador/i)).toBeInTheDocument();
  });
});

describe('Login — validação de campos obrigatórios', () => {
  beforeEach(() => mockFetch.mockReset());

  it('mostra erro quando e-mail está vazio', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText('O E-mail é obrigatório.')).toBeInTheDocument();
    });
  });

  it('mostra erro quando senha está vazia (e-mail preenchido)', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('exemplo@email.com'), {
      target: { value: 'test@teste.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument();
    });
  });
});

describe('Login — respostas da API', () => {
  beforeEach(() => mockFetch.mockReset());

  it('exibe erro quando credenciais estão incorretas (HTTP 401)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('exemplo@email.com'), {
      target: { value: 'errado@teste.com' },
    });
    const senhaInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    fireEvent.change(senhaInput, { target: { value: 'senhaErrada' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText('Email ou senha incorretos.')).toBeInTheDocument();
    });
  });

  it('exibe erro de conexão quando servidor está indisponível', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('exemplo@email.com'), {
      target: { value: 'test@teste.com' },
    });
    const senhaInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText('Erro ao conectar com o Servidor.')).toBeInTheDocument();
    });
  });
});

describe('Login — recuperação de senha', () => {
  it('exibe aviso quando "Esqueci minha senha" é clicado sem e-mail', () => {
    renderLogin();
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    expect(
      screen.getByText('Digite seu e-mail no campo acima antes de redefinir a senha.'),
    ).toBeInTheDocument();
  });

  it('exibe formulário de redefinição quando e-mail está preenchido', () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('exemplo@email.com'), {
      target: { value: 'usuario@teste.com' },
    });
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    expect(screen.getByText('Nova Senha')).toBeInTheDocument();
  });
});
