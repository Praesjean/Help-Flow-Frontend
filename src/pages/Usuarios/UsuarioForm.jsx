import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

import api from '../../services/api';

import './UsuarioForm.css';

export default function UsuarioForm({
    usuario = null,
    onClose,
    onSuccess,
}) {
    const editando = Boolean(usuario);

    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [senha, setSenha] = useState('');
    const [perfil, setPerfil] = useState(usuario?.perfil || 'CLIENTE');
    const [ativo, setAtivo] = useState(
        usuario ? usuario.ativo === true || usuario.ativo === 1 : true
    );

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setErro('');

        if (!nome.trim()) {
            setErro('Informe o nome completo.');
            return;
        }

        if (!email.trim()) {
            setErro('Informe o e-mail.');
            return;
        }

        if (!editando && senha.length < 8) {
            setErro('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        setSalvando(true);

        try {
            if (editando) {
                await api.put(`/api/usuarios/${usuario.id}`, {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                perfil,
                ativo,
                });
        } else {
            await api.post('/api/usuarios', {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha,
                perfil,
            });
        }

            await onSuccess();
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                error.response?.data?.message ||
                (editando
                    ? 'Não foi possível atualizar o usuário.'
                    : 'Não foi possível cadastrar o usuário.')
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="usuario-modal-overlay">
            <div
                className="usuario-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="usuario-modal-title"
            >
                <div className="usuario-modal-header">
                    <div>
                        <h2 id="usuario-modal-title">
                            {editando ? 'Editar usuário' : 'Novo usuário'}
                        </h2>

                        <p>
                            {editando
                                ? 'Atualize as informações do usuário.'
                                : 'Preencha as informações para cadastrar um usuário.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="usuario-modal-close"
                        onClick={onClose}
                        disabled={salvando}
                        aria-label="Fechar formulário"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="usuario-modal-body">
                        <div className="usuario-form-field">
                            <label htmlFor="usuario-nome">
                                Nome completo <span>*</span>
                            </label>

                            <input
                                id="usuario-nome"
                                type="text"
                                placeholder="Ex.: João da Silva"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                maxLength={150}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="usuario-form-field">
                            <label htmlFor="usuario-email">
                                E-mail <span>*</span>
                            </label>

                            <input
                                id="usuario-email"
                                type="email"
                                placeholder="Ex.: joao@email.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                maxLength={255}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {!editando && (
                            <div className="usuario-form-field">
                                <label htmlFor="usuario-senha">
                                    Senha <span>*</span>
                                </label>

                                <input
                                    id="usuario-senha"
                                    type="password"
                                    placeholder="Mínimo de 8 caracteres"
                                    value={senha}
                                    onChange={(event) => setSenha(event.target.value)}
                                    minLength={8}
                                    autoComplete="new-password"
                                    required
                                />

                                <small>
                                    A senha deve possuir pelo menos 8 caracteres.
                                </small>
                            </div>
                        )}

                        <div className="usuario-form-field">
                            <label htmlFor="usuario-perfil">
                                Perfil <span>*</span>
                            </label>

                            <select
                                id="usuario-perfil"
                                value={perfil}
                                onChange={(event) => setPerfil(event.target.value)}
                                required
                            >
                                <option value="CLIENTE">Cliente</option>
                                <option value="ATENDENTE">Atendente</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        {editando && (
                            <div className="usuario-form-field">
                                <label htmlFor="usuario-status">
                                    Status
                                </label>

                                <select
                                    id="usuario-status"
                                    value={ativo ? 'ativo' : 'inativo'}
                                    onChange={(event) =>
                                        setAtivo(event.target.value === 'ativo')
                                    }
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                        )}

                        {erro && (
                            <div className="usuario-form-error" role="alert">
                                <AlertCircle size={17} />
                                <span>{erro}</span>
                            </div>
                        )}
                    </div>

                    <div className="usuario-modal-footer">
                        <button
                            type="button"
                            className="usuario-form-cancel"
                            onClick={onClose}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="usuario-form-submit"
                            disabled={salvando}
                        >
                        <Save size={17} />
                        {salvando
                            ? 'Salvando...'
                            : editando
                                ? 'Salvar alterações'
                                : 'Cadastrar usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}