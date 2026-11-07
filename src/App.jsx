import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Chamados from './pages/Chamados/Chamados';
import Usuarios from './pages/Usuarios/Usuarios';

export default function App() {
	const { isAuthenticated, user } = useAuth();

	const podeVisualizarUsuarios =
		user?.perfil === 'ADMIN' ||
		user?.perfil === 'ATENDENTE';

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/login"
					element={
						isAuthenticated
							? <Navigate to="/dashboard" replace />
							: <Login />
					}
				/>

				<Route element={<ProtectedRoute />}>
					<Route element={<MainLayout />}>
						<Route
							path="/dashboard"
							element={<Dashboard />}
						/>

						<Route
							path="/chamados"
							element={<Chamados />}
						/>

						<Route
							path="/usuarios"
							element={
								podeVisualizarUsuarios
									? <Usuarios />
									: <Navigate to="/dashboard" replace />
							}
						/>
					</Route>
				</Route>

				<Route
					path="*"
					element={
						<Navigate
							to={isAuthenticated ? '/dashboard' : '/login'}
							replace
						/>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}