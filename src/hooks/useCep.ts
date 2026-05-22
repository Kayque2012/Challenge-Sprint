import { useState, useEffect } from 'react';

interface CepDados {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface UseCepReturn {
  dados: CepDados | null;
  loading: boolean;
  erro: string;
}

export function useCep(cep: string): UseCepReturn {
  const [dados, setDados] = useState<CepDados | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setDados(null);
      setErro('');
      return;
    }
    setLoading(true);
    setErro('');
    setDados(null);
    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          setErro('CEP não encontrado.');
        } else {
          setDados({ logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf: data.uf });
        }
      })
      .catch(() => setErro('Erro ao buscar o CEP. Verifique sua conexão.'))
      .finally(() => setLoading(false));
  }, [cep]);

  return { dados, loading, erro };
}
