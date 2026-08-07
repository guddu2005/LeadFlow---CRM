import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import { Login, Register } from "./pages/auth";
import Dashboard from "./pages/dashboard/Dashboard";
import ProspectsPage from "./pages/prospects/ProspectsPage";
import LeadsPage from "./pages/leads/LeadsPage";
import OutreachPage from "./pages/outreach/OutreachPage";
import InterviewsPage from "./pages/interviews/InterviewsPage";
import CompaniesPage from "./pages/companies/CompaniesPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import TemplatesPage from "./pages/templates/TemplatesPage";
import ReportsPage from "./pages/reports/ReportsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import SettingsPage from "./pages/settings/SettingsPage";
import EmailPage from "./pages/email/EmailPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Internal CRM Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/prospects"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <ProspectsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/leads"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <LeadsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/outreach"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <OutreachPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/email"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <EmailPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/interviews"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <InterviewsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <CompaniesPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/contacts"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <ContactsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/templates"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <TemplatesPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <ReportsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <SettingsPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Exclusive Admin-Only Route */}
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <DashboardLayout>
                                        <AdminUsersPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Catch-All Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;