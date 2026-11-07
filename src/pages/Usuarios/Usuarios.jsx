import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Users,
    Search,
    RefreshCw,
    AlertCircle,
    ShieldCheck,
    Plus,
    CheckCircle2,
    Pencil,
    Trash2,
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import UsuarioForm from './UsuarioForm';

import './Usuarios.css';

export default function Usuarios() {
    const { user } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [formularioAberto, setFormularioAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [excluindoId, setExcluindoId] = useState(null);

    const perfil = user?.perfil || 'CLIENTE';
    const podeGerenciar = perfil === 'ADMIN';

    const usuarioLogadoId = user?.id ?? user?._id;

    const carregarUsuarios = useCallback(async () => {
        setLoading(true);
        setErro('');

        try {
            const response = await api.get('/api/usuarios');
            const resultado = response.data;

            const lista = Array.isArray(resultado)
                ? resultado
                : Array.isArray(resultado?.value)
                    ? resultado.value
                    : Array.isArray(resultado?.dados)
                        ? resultado.dados
                        : [];

            setUsuarios(lista);
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                'Não foi possível carregar os usuários.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarUsuarios();
    }, [carregarUsuarios]);

    const usuariosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) return usuarios;

        return usuarios.filter((usuario) =>
            [
                usuario.nome,
                usuario.email,
                usuario.perfil,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(termo)
        );
    }, [usuarios, busca]);

    function formatarData(data) {
        if (!data) return '-';

        const valor = new Date(data);

        return Number.isNaN(valor.getTime())
            ? '-'
            : valor.toLocaleDateString('pt-BR');
    }

    function usuarioAtivo(ativo) {
        return ativo === true || ativo === 1;
    }

    function ehUsuarioLogado(usuario) {
        return (
            usuarioLogadoId != null &&
            String(usuario.id) === String(usuarioLogadoId)
        );
    }

    function abrirCadastro() {
        setErro('');
        setSucesso('');
        setUsuarioEditando(null);
        setFormularioAberto(true);
    }

    function abrirEdicao(usuario) {
        setErro('');
        setSucesso('');
        setUsuarioEditando(usuario);
        setFormularioAberto(true);
    }

    function fecharFormulario() {
        setFormularioAberto(false);
        setUsuarioEditando(null);
    }

    async function handleFormularioConcluido() {
        const editando = Boolean(usuarioEditando);

        fecharFormulario();

        setSucesso(
            editando
                ? 'Usuário atualizado com sucesso.'
                : 'Usuário cadastrado com sucesso.'
            );

        await carregarUsuarios();
    }

    async function handleExcluir(usuario) {
        if (!podeGerenciar || excluindoId !== null) {
            return;
        }

        setErro('');
        setSucesso('');

        if (ehUsuarioLogado(usuario)) {
            setErro('Você não pode excluir sua própria conta.');
            return;
        }

        const confirmado = window.confirm(
            `Tem certeza que deseja excluir o usuário "${usuario.nome}"?\n\n` +
            'Esta ação não poderá ser desfeita.'
        );

        if (!confirmado) {
            return;
        }

        setExcluindoId(usuario.id);

        try {
            await api.delete(`/api/usuarios/${usuario.id}`);

            setSucesso(`Usuário "${usuario.nome}" excluído com sucesso.`);

            await carregarUsuarios();
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                'Não foi possível excluir o usuário.'
            );
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <div className="usuarios-page">
            <div className="usuarios-heading">
                <div>
                    <h1>Usuários</h1>
                    <p>Gerencie os usuários cadastrados no Help Flow.</p>
                </div>

                {podeGerenciar && (
                    <span className="usuarios-admin-label">
                        <ShieldCheck size={17} />
                        Acesso administrativo
                    </span>
                )}
            </div>

            <div className="usuarios-summary">
                <div className="usuarios-summary-icon">
                    <Users size={22} />
                </div>

                <div>
                    <span>Total de usuários</span>
                    <strong>{usuarios.length}</strong>
                </div>
            </div>

            {sucesso && (
                <div
                    role="status"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 16px',
                        borderRadius: 9,
                        background: '#f0fdf4',
                        color: '#15803d',
                        fontSize: 13,
                    }}
                >
                    <CheckCircle2 size={18} />
                    {sucesso}
                </div>
            )}

            {erro && (
                <div className="usuarios-error" role="alert">
                    <AlertCircle size={18} />
                    {erro}
                </div>
            )}

            <section className="usuarios-panel">
                <div className="usuarios-toolbar">
                    <div className="usuarios-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Buscar por nome, e-mail ou perfil..."
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 10,
                        }}
                    >
                        <button
                            className="usuarios-refresh-button"
                            type="button"
                            onClick={carregarUsuarios}
                            disabled={loading || excluindoId !== null}
                        >
                            <RefreshCw size={17} />
                            Atualizar
                        </button>

                        {podeGerenciar && (
                            <button
                                type="button"
                                onClick={abrirCadastro}
                                style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                padding: '10px 14px',
                                border: 'none',
                                borderRadius: 8,
                                background: '#4f46e5',
                                color: '#ffffff',
                                fontFamily: 'inherit',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                }}
                            >
                                <Plus size={17} />
                                Novo Usuário
                            </button>
                        )}
                    </div>
                </div>

                <div className="usuarios-table-wrapper">
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>E-mail</th>
                                <th>Perfil</th>
                                <th>Status</th>
                                <th>Cadastrado em</th>
                                {podeGerenciar && <th>Ações</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={podeGerenciar ? 6 : 5}
                                        className="usuarios-empty"
                                    >
                                        Carregando usuários...
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={podeGerenciar ? 6 : 5}
                                        className="usuarios-empty"
                                    >
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>
                                            <div className="usuarios-name-cell">
                                                <div className="usuarios-avatar">
                                                    {usuario.nome?.charAt(0).toUpperCase() || 'U'}
                                                </div>

                                                <div>
                                                    <strong>{usuario.nome}</strong>
                                                    <small>ID: {usuario.id}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{usuario.email}</td>

                                        <td>
                                            <span
                                                className={`usuarios-profile profile-${String(
                                                    usuario.perfil || ''
                                                ).toLowerCase()}`}
                                            >
                                                {usuario.perfil}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`usuarios-status ${
                                                usuarioAtivo(usuario.ativo)
                                                    ? 'active'
                                                    : 'inactive'
                                                }`}
                                            >
                                                {usuarioAtivo(usuario.ativo)
                                                    ? 'Ativo'
                                                    : 'Inativo'}
                                            </span>
                                        </td>

                                        <td>{formatarData(usuario.criadoEm)}</td>

                                        {podeGerenciar && (
                                            <td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirEdicao(usuario)}
                                                        title="Editar usuário"
                                                        aria-label={`Editar ${usuario.nome}`}
                                                        style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 6,
                                                        padding: '8px 10px',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: 8,
                                                        background: '#ffffff',
                                                        color: '#4f46e5',
                                                        fontFamily: 'inherit',
                                                        fontSize: 12,
                                                        cursor: 'pointer',
                                                        }}
                                                    >
                                                        <Pencil size={15} />
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleExcluir(usuario)}
                                                        disabled={
                                                        ehUsuarioLogado(usuario) || excluindoId !== null
                                                        }
                                                        title={
                                                            ehUsuarioLogado(usuario)
                                                                ? 'Você não pode excluir sua própria conta'
                                                                : 'Excluir usuário'
                                                        }
                                                        aria-label={`Excluir ${usuario.nome}`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 6,
                                                            padding: '8px 10px',
                                                            border: '1px solid #fecaca',
                                                            borderRadius: 8,
                                                            background: '#ffffff',
                                                            color: '#dc2626',
                                                            fontFamily: 'inherit',
                                                            fontSize: 12,
                                                            cursor:
                                                                ehUsuarioLogado(usuario) ||
                                                                excluindoId !== null
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                            opacity:
                                                                ehUsuarioLogado(usuario) ||
                                                                excluindoId !== null
                                                                ? 0.5
                                                                : 1,
                                                        }}
                                                    >
                                                        <Trash2 size={15} />
                                                        {excluindoId === usuario.id
                                                            ? 'Excluindo...'
                                                            : 'Excluir'}
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="usuarios-table-footer">
                    Exibindo {usuariosFiltrados.length} de {usuarios.length} usuários
                </div>
            </section>

            {formularioAberto && podeGerenciar && (
                <UsuarioForm
                    usuario={usuarioEditando}
                    onClose={fecharFormulario}
                    onSuccess={handleFormularioConcluido}
                />
            )}
        </div>
    );
}