import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import './ChamadoForm.css';

export default function ChamadoForm({
    chamado = null,
    onClose,
    onSuccess,
}) {
    const { user } = useAuth();

    const editando = Boolean(chamado);
    const perfil = user?.perfil || 'CLIENTE';
    const podeAlterarStatus = perfil === 'ADMIN' || perfil === 'ATENDENTE';
    const precisaInformarUsuario = !editando && perfil !== 'CLIENTE';

    const [titulo, setTitulo] = useState(chamado?.titulo || '');
    const [descricao, setDescricao] = useState(chamado?.descricao || '');
    const [prioridade, setPrioridade] = useState(chamado?.prioridade || 'MEDIA');
    const [status, setStatus] = useState(chamado?.status || 'ABERTO');
    const [usuarioId, setUsuarioId] = useState(
        chamado?.usuarioId || String(user?.id || user?._id || '')
    );

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setErro('');

        if (!titulo.trim() || !descricao.trim()) {
            setErro('Preencha o título e a descrição.');
            return;
        }

        if (precisaInformarUsuario && !usuarioId.trim()) {
            setErro('Informe o ID do usuário responsável pelo chamado.');
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                prioridade,
            };

            if (editando) {
                if (podeAlterarStatus) {
                    dados.status = status;
                }

                await api.put(
                    `/api/chamados/${chamado._id || chamado.id}`,
                    dados
                );
            } else {
                if (precisaInformarUsuario) {
                    dados.usuarioId = String(usuarioId).trim();
                }

                await api.post('/api/chamados', dados);
            }

            await onSuccess();
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                (editando
                    ? 'Não foi possível atualizar o chamado.'
                    : 'Não foi possível cadastrar o chamado.')
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="chamado-modal-overlay">
            <div
                className="chamado-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="chamado-modal-title"
            >
                <div className="chamado-modal-header">
                    <div>
                        <h2 id="chamado-modal-title">
                            {editando ? 'Editar chamado' : 'Novo chamado'}
                        </h2>
                        <p>
                            {editando
                                ? 'Atualize as informações do chamado.'
                                : 'Preencha as informações para abrir um chamado.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="chamado-modal-close"
                        onClick={onClose}
                        disabled={salvando}
                        aria-label="Fechar formulário"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="chamado-modal-body">
                        <div className="chamado-form-field">
                            <label htmlFor="chamado-titulo">
                                Título <span>*</span>
                            </label>

                            <input
                                id="chamado-titulo"
                                type="text"
                                placeholder="Ex.: Problema ao acessar o sistema"
                                value={titulo}
                                onChange={(event) => setTitulo(event.target.value)}
                                maxLength={150}
                                required
                            />
                        </div>

                        <div className="chamado-form-field">
                            <label htmlFor="chamado-descricao">
                                Descrição <span>*</span>
                            </label>

                            <textarea
                                id="chamado-descricao"
                                placeholder="Descreva o problema ou solicitação..."
                                value={descricao}
                                onChange={(event) => setDescricao(event.target.value)}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="chamado-form-field">
                            <label htmlFor="chamado-prioridade">
                                Prioridade
                            </label>

                            <select
                                id="chamado-prioridade"
                                value={prioridade}
                                onChange={(event) => setPrioridade(event.target.value)}
                            >
                                <option value="BAIXA">Baixa</option>
                                <option value="MEDIA">Média</option>
                                <option value="ALTA">Alta</option>
                                <option value="CRITICA">Crítica</option>
                            </select>
                        </div>

                        {precisaInformarUsuario && (
                            <div className="chamado-form-field">
                                <label htmlFor="chamado-usuario">
                                    ID do usuário <span>*</span>
                                </label>

                                <input
                                    id="chamado-usuario"
                                    type="text"
                                    placeholder="Ex.: 4"
                                    value={usuarioId}
                                    onChange={(event) => setUsuarioId(event.target.value)}
                                    required
                                />

                                <small>
                                    Informe o identificador do usuário que abriu o chamado.
                                </small>
                            </div>
                        )}

                        {editando && podeAlterarStatus && (
                            <div className="chamado-form-field">
                                <label htmlFor="chamado-status">
                                    Status
                                </label>

                                <select
                                    id="chamado-status"
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    >
                                    <option value="ABERTO">Aberto</option>
                                    <option value="EM_ANDAMENTO">Em andamento</option>
                                    <option value="RESOLVIDO">Resolvido</option>
                                    <option value="FECHADO">Fechado</option>
                                </select>
                            </div>
                        )}

                        {erro && (
                            <div className="chamado-form-error" role="alert">
                                <AlertCircle size={17} />
                                <span>{erro}</span>
                            </div>
                        )}
                    </div>

                    <div className="chamado-modal-footer">
                        <button
                            type="button"
                            className="chamado-form-cancel"
                            onClick={onClose}
                            disabled={salvando}
                            >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="chamado-form-submit"
                            disabled={salvando}
                        >
                            <Save size={17} />
                            {salvando
                                ? 'Salvando...'
                                : editando
                                    ? 'Salvar alterações'
                                    : 'Cadastrar chamado'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}