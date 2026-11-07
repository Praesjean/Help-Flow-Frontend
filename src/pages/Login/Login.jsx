
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export default function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro('');
        setSucesso(false);
        setLoading(true);

        try {
            await login(email.trim(), senha);
            setSucesso(true);
        } catch (error) {
            const mensagem =
                error.response?.data?.message ||
                error.response?.data?.erro ||
                error.message ||
                'Não foi possível realizar o login.';

            setErro(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-logo">HF</div>
                    <h1>Help Flow</h1>
                    <p>Gerenciamento de chamados e atendimentos</p>
                </div>

                <div className="login-heading">
                    <h2>Bem-vindo de volta</h2>
                    <p>Entre com suas credenciais para continuar.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {erro && (
                        <div className="login-message login-error" role="alert">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div className="login-message login-success" role="status">
                            Login realizado com sucesso!
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-footer">
                    Help Flow · Sistema de gerenciamento de atendimentos
                </p>
            </div>
        </div>
    );
}