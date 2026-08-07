import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("leadflow_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("leadflow_token") || null;
    });

    const [isLoading, setIsLoading] = useState(true);

    // Helper to safely extract token & user from response payload
    const extractAuthData = (resData) => {
        let extractedToken = null;
        let extractedUser = null;

        if (resData) {
            if (resData.data && typeof resData.data === "object") {
                extractedToken = resData.data.token || resData.data.accessToken;
                extractedUser = resData.data.user || resData.data;
            }
            if (!extractedToken && resData.message && typeof resData.message === "object") {
                extractedToken = resData.message.token;
                extractedUser = resData.message.user;
            }
            if (!extractedToken && resData.token) {
                extractedToken = resData.token;
                extractedUser = resData.user;
            }
        }
        return { token: extractedToken, user: extractedUser };
    };

    // Check token validity on initial mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("leadflow_token");
            if (storedToken) {
                try {
                    const response = await api.get("/auth/me");
                    const userData = response.data?.data?.user || response.data?.message?.user || response.data?.user;
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem("leadflow_user", JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error("Auth verification failed:", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token: jwtToken, user: authUser } = extractAuthData(response.data);

            if (!jwtToken) {
                throw new Error("Invalid response from server: Token missing");
            }

            setToken(jwtToken);
            setUser(authUser);

            localStorage.setItem("leadflow_token", jwtToken);
            localStorage.setItem("leadflow_user", JSON.stringify(authUser));

            return { success: true, user: authUser };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Login failed. Please check your credentials.";
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            const { token: jwtToken, user: authUser } = extractAuthData(response.data);

            if (jwtToken && authUser) {
                setToken(jwtToken);
                setUser(authUser);

                localStorage.setItem("leadflow_token", jwtToken);
                localStorage.setItem("leadflow_user", JSON.stringify(authUser));
            }

            return { success: true, user: authUser, message: "Account created successfully!" };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Registration failed. Please try again.";
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout").catch(() => {});
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem("leadflow_token");
            localStorage.removeItem("leadflow_user");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
