import { useCallback, useEffect, useState } from 'react';
import {
    Ticket,
    Users,
    Activity,
    RefreshCw,
    AlertCircle,
    Clock3,
    CheckCircle2,
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();

    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        setLoading(true);
        setErro('');

        try {
            const response = await api.get('/aggregated-data');
            setDados(response.data);
        } catch (error) {
            setErro(
                error.response?.data?.message ||
                'Não foi possível carregar os dados do Dashboard.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const chamados = Array.isArray(dados?.chamados?.dados)
        ? dados.chamados.dados
        : [];

    const totalChamados = dados?.chamados?.total ?? 0;
    const totalUsuarios = dados?.usuarios?.total ?? 0;

    const totalAbertos = chamados.filter(
        (chamado) => chamado.status === 'ABERTO'
    ).length;

    const totalEmAndamento = chamados.filter(
        (chamado) => chamado.status === 'EM_ANDAMENTO'
    ).length;

    const totalResolvidos = chamados.filter(
        (chamado) =>
            chamado.status === 'RESOLVIDO' || chamado.status === 'FECHADO'
    ).length;

    const podeVerUsuarios = dados?.usuarios?.autorizado === true;

    return (
        <div className="dashboard-page">
            <div className="dashboard-heading">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Bem-vindo, {user?.nome || 'usuário'}.
                        Acompanhe os indicadores do Help Flow.
                    </p>
                </div>

                <button
                    className="dashboard-refresh"
                    type="button"
                    onClick={carregarDados}
                    disabled={loading}
                >
                <RefreshCw size={17} />
                    {loading ? 'Atualizando...' : 'Atualizar dados'}
                </button>
            </div>

            {erro && (
                <div className="dashboard-error" role="alert">
                    <AlertCircle size={18} />
                    <span>{erro}</span>
                </div>
            )}

            {loading && !dados ? (
                <div className="dashboard-loading">
                    Carregando informações dos microserviços...
                </div>
            ) : (
                <>
                    <div className="dashboard-cards">
                        <div className="dashboard-card">
                            <div className="dashboard-card-top">
                                <span>Total de chamados</span>
                                <div className="dashboard-card-icon purple">
                                    <Ticket size={21} />
                                </div>
                            </div>
                        <strong>{totalChamados}</strong>
                        <small>Chamados disponíveis para seu perfil</small>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <span>Chamados abertos</span>
                            <div className="dashboard-card-icon orange">
                                <Clock3 size={21} />
                            </div>
                        </div>
                        <strong>{totalAbertos}</strong>
                        <small>Aguardando atendimento</small>
                    </div>

                        <div className="dashboard-card">
                            <div className="dashboard-card-top">
                                <span>Em andamento</span>
                                <div className="dashboard-card-icon blue">
                                    <Activity size={21} />
                                </div>
                            </div>
                            <strong>{totalEmAndamento}</strong>
                            <small>Chamados em atendimento</small>
                        </div>

                        <div className="dashboard-card">
                            <div className="dashboard-card-top">
                                <span>Resolvidos</span>
                                <div className="dashboard-card-icon green">
                                    <CheckCircle2 size={21} />
                                </div>
                            </div>
                            <strong>{totalResolvidos}</strong>
                            <small>Chamados resolvidos ou fechados</small>
                        </div>

                        {podeVerUsuarios && (
                            <div className="dashboard-card">
                                <div className="dashboard-card-top">
                                    <span>Usuários cadastrados</span>
                                    <div className="dashboard-card-icon purple">
                                        <Users size={21} />
                                    </div>
                                </div>
                                <strong>{totalUsuarios}</strong>
                                <small>Usuários registrados no sistema</small>
                            </div>
                        )}
                    </div>

                    <section className="dashboard-section">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Chamados recentes</h2>
                                <p>Informações obtidas diretamente do BFF.</p>
                            </div>
                        </div>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Prioridade</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {chamados.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="dashboard-empty">
                                                Nenhum chamado encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        chamados.slice(0, 5).map((chamado) => (
                                            <tr key={chamado._id || chamado.id}>
                                                <td>{chamado.titulo || 'Sem título'}</td>
                                                <td>{chamado.prioridade || 'Não informada'}</td>
                                                <td>
                                                    <span className="dashboard-status">
                                                        {chamado.status || 'Não informado'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="dashboard-source">
                        Dados obtidos por meio do endpoint
                        <code> GET /aggregated-data</code>
                    </div>
                </>
            )}
        </div>
    );
}