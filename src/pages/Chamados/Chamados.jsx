import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Search,
    RefreshCw,
    Plus,
    Ticket,
    AlertCircle,
    Pencil,
    Trash2,
    CheckCircle2,
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ChamadoForm from './ChamadoForm';

import './Chamados.css';

export default function Chamados() {
    const { user } = useAuth();

    const [chamados, setChamados] = useState([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [chamadoEditando, setChamadoEditando] = useState(null);
    const [excluindoId, setExcluindoId] = useState(null);

    const perfil = user?.perfil || 'CLIENTE';
    const podeExcluir = perfil === 'ADMIN';

    const carregarChamados = useCallback(async () => {
        setLoading(true);
        setErro('');

        try {
            const response = await api.get('/api/chamados');
            const resultado = response.data;

            const lista = Array.isArray(resultado)
                ? resultado
                : Array.isArray(resultado?.value)
                    ? resultado.value
                    : Array.isArray(resultado?.dados)
                        ? resultado.dados
                        : [];

            setChamados(lista);
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                'Não foi possível carregar os chamados.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarChamados();
    }, [carregarChamados]);

    const chamadosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) return chamados;

        return chamados.filter((chamado) =>
            [
                chamado.titulo,
                chamado.descricao,
                chamado.status,
                chamado.prioridade,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(termo)
        );
    }, [chamados, busca]);

    function abrirCadastro() {
        setSucesso('');
        setChamadoEditando(null);
        setMostrarFormulario(true);
    }

    function abrirEdicao(chamado) {
        setSucesso('');
        setChamadoEditando(chamado);
        setMostrarFormulario(true);
    }

    function fecharFormulario() {
        setMostrarFormulario(false);
        setChamadoEditando(null);
    }

    async function handleFormularioConcluido() {
        const operacao = chamadoEditando ? 'atualizado' : 'cadastrado';

        await carregarChamados();
        fecharFormulario();

        setSucesso(`Chamado ${operacao} com sucesso.`);
    }

    async function excluirChamado(chamado) {
        const id = chamado._id || chamado.id;

        if (!id || !podeExcluir) return;

        const confirmou = window.confirm(
            `Deseja realmente excluir o chamado "${chamado.titulo}"?\n\nEssa ação não pode ser desfeita.`
        );

        if (!confirmou) return;

        setExcluindoId(id);
        setErro('');
        setSucesso('');

        try {
            await api.delete(`/api/chamados/${id}`);
            await carregarChamados();

            setSucesso('Chamado excluído com sucesso.');
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                'Não foi possível excluir o chamado.'
            );
        } finally {
            setExcluindoId(null);
        }
    }

    function formatarData(data) {
        if (!data) return '-';

        const valor = new Date(data);

        return Number.isNaN(valor.getTime())
            ? '-'
            : valor.toLocaleDateString('pt-BR');
    }

    return (
        <div className="chamados-page">
            <div className="chamados-heading">
                <div>
                    <h1>Chamados</h1>
                    <p>Gerencie os chamados registrados no Help Flow.</p>
                </div>

                <button
                    className="chamados-primary-button"
                    type="button"
                    onClick={abrirCadastro}
                >
                    <Plus size={18} />
                    Novo chamado
                </button>
            </div>

            <div className="chamados-summary">
                <div className="chamados-summary-icon">
                    <Ticket size={22} />
                </div>

                <div>
                    <span>Total de chamados</span>
                    <strong>{chamados.length}</strong>
                </div>
            </div>

            {sucesso && (
                <div className="chamados-success" role="status">
                    <CheckCircle2 size={18} />
                    {sucesso}
                </div>
            )}

            {erro && (
                <div className="chamados-error" role="alert">
                    <AlertCircle size={18} />
                    {erro}
                </div>
            )}

            <section className="chamados-panel">
                <div className="chamados-toolbar">
                    <div className="chamados-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Buscar por título, descrição ou status..."
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                        />
                    </div>

                    <button
                        className="chamados-refresh-button"
                        type="button"
                        onClick={carregarChamados}
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Atualizar
                    </button>
                </div>

                <div className="chamados-table-wrapper">
                    <table className="chamados-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Prioridade</th>
                                <th>Status</th>
                                <th>Usuário</th>
                                <th>Criado em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="chamados-empty">
                                        Carregando chamados...
                                    </td>
                                </tr>
                            ) : chamadosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="chamados-empty">
                                        Nenhum chamado encontrado.
                                    </td>
                                </tr>
                            ) : (
                                chamadosFiltrados.map((chamado) => {
                                    const id = chamado._id || chamado.id;

                                    return (
                                        <tr key={id}>
                                            <td>
                                                <div className="chamados-title-cell">
                                                    <strong>{chamado.titulo}</strong>
                                                    <small>{chamado.descricao || '-'}</small>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`chamados-priority priority-${String(
                                                        chamado.prioridade || ''
                                                    ).toLowerCase()}`}
                                                >
                                                    {chamado.prioridade || '-'}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`chamados-status status-${String(
                                                        chamado.status || ''
                                                    ).toLowerCase()}`}
                                                    >
                                                    {chamado.status?.replaceAll('_', ' ') || '-'}
                                                </span>
                                            </td>

                                            <td>{chamado.usuarioId || '-'}</td>
                                            <td>{formatarData(chamado.createdAt)}</td>

                                            <td>
                                                <div className="chamados-actions">
                                                    <button
                                                        type="button"
                                                        className="chamados-action-button edit"
                                                        onClick={() => abrirEdicao(chamado)}
                                                        title="Editar chamado"
                                                        aria-label={`Editar ${chamado.titulo}`}
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    {podeExcluir && (
                                                        <button
                                                        type="button"
                                                        className="chamados-action-button delete"
                                                        onClick={() => excluirChamado(chamado)}
                                                        disabled={excluindoId === id}
                                                        title="Excluir chamado"
                                                        aria-label={`Excluir ${chamado.titulo}`}
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="chamados-table-footer">
                    Exibindo {chamadosFiltrados.length} de {chamados.length} chamados
                </div>
            </section>

            {mostrarFormulario && (
                <ChamadoForm
                    chamado={chamadoEditando}
                    onClose={fecharFormulario}
                    onSuccess={handleFormularioConcluido}
                />
            )}
        </div>
    );
}