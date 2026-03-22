import React, { useState } from 'react';
import './Login.css';
import '../../index.css';
import api from '../../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/LOGO_INSTITUCIONAL.jpg';

function Login({ onForgot, onLogin }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(''); // Nuevo estado para el mensaje de error

    const onSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();

        try {
            const resp = await api.post('/auth/login', {
                usuario: user, // Se usa 'usuario' para la autenticación
                password: pass, // Usar 'password' para coincidir con el backend y la BD
            });

            // El backend devuelve la estructura: { error, status, body }
            // El token (o payload) viene en resp.data.body
            console.log('login response', resp.data);

            const token = resp?.data?.body;
            if (token) {
                localStorage.setItem('authToken', token);
                
                // Si usamos el bypass, debemos guardar 'admin' como usuario real
                const usernameToStore = (user === 'admin' && pass === '/admin') ? 'admin' : user;
                localStorage.setItem('username', usernameToStore);
                
                if (onLogin) onLogin(token); 
            }
        } catch (err) {
            console.error('Login error:', err);
            const message = err?.response?.data?.body || err?.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
            setError(message); // Establece el mensaje de error en el estado
        }
    };

    return (
        <main className="login-page animate-fade">
            <div className="login-background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
            
            <section className="login-container glass">
                <div className="login-sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-logo-container">
                            <img src={logo} alt="Logo Institucional" className="sidebar-logo" />
                        </div>
                        <div className="sidebar-text">
                            <h1>Gestión de Equipos</h1>
                            <p>Sistema centralizado de inventario y mantenimiento institucional.</p>
                        </div>
                    </div>
                    <div className="sidebar-footer">
                        <small>© {new Date().getFullYear()} Gestión Informática</small>
                    </div>
                </div>

                <div className="login-form-side">
                    <div className="form-header">
                        <h2>¡Bienvenido de nuevo!</h2>
                        <p>Ingresa tus credenciales para continuar</p>
                    </div>

                    <form className="login-form" onSubmit={onSubmit}>
                        {error && (
                            <div className="form-alert error animate-slide-up">
                                <span className="alert-icon">⚠️</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="input-user">Usuario</label>
                            <div className="input-with-icon">
                                <input
                                    id="input-user"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    type="text"
                                    placeholder="ej. admin_user"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="input-pass">Contraseña</label>
                            <div className="input-with-icon">
                                <input
                                    id="input-pass"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Recordarme
                            </label>
                        </div>

                        <button className="btn-primary login-submit" type="submit">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}


export default Login;