import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Ticket,
    Users,
    LogOut,
    Headphones,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const perfil = user?.perfil || 'CLIENTE';

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Chamados',
            path: '/chamados',
            icon: Ticket,
        },
    ];

    if (perfil === 'ADMIN' || perfil === 'ATENDENTE') {
        menuItems.push({
            label: 'Usuários',
            path: '/usuarios',
            icon: Users,
        });
    }

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <Headphones size={24} />
                    </div>

                    <div>
                        <h2>Help Flow</h2>
                        <span>Central de Atendimento</span>
                    </div>
                </div>

                <div className="sidebar-section-title">
                    MENU PRINCIPAL
                </div>

                <nav className="sidebar-navigation">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                        type="button"
                    >
                        <LogOut size={19} />
                        <span>Sair do sistema</span>
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="app-header">
                    <div className="header-title">
                        Sistema de Gerenciamento de Chamados
                    </div>

                    <div className="header-user">
                        <div className="header-user-info">
                            <strong>{user?.nome || 'Usuário'}</strong>
                            <span>{perfil}</span>
                        </div>

                        <div className="header-avatar">
                            {(user?.nome || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}