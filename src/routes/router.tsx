import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { EstadisticasPage } from "@/pages/EstadisticasPage";
import { ProfilePlaceholderPage } from "@/pages/ProfilePlaceholderPage";
import { NewMovementPage } from "@/pages/movimientos/NewMovementPage";
import { CategoriesPage } from "@/pages/categorias/CategoriesPage";
import { CategoryFormPage } from "@/pages/categorias/CategoryFormPage";
import { PresupuestoPage } from "@/pages/PresupuestoPage";
import { NewBudgetPage } from "@/pages/presupuesto/NewBudgetPage";
import { EditBudgetPage } from "@/pages/presupuesto/EditBudgetPage";
import { MetasPage } from "@/pages/MetasPage";
import { NewGoalPage } from "@/pages/metas/NewGoalPage";
import { GoalDetailPage } from "@/pages/metas/GoalDetailPage";
import { CalendarioPage } from "@/pages/CalendarioPage";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      {
        path: "/estadisticas",
        element: <EstadisticasPage />,
      },
      {
        path: "/presupuesto",
        element: <PresupuestoPage />,
      },
      {
        path: "/metas",
        element: <MetasPage />,
      },
      {
        path: "/perfil",
        element: <ProfilePlaceholderPage />,
      },
    ],
  },
  {
    // Se presenta como una hoja modal (sin tab bar), no como parte de MainLayout.
    path: "/movimientos/nuevo",
    element: (
      <ProtectedRoute>
        <NewMovementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias",
    element: (
      <ProtectedRoute>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias/nueva",
    element: (
      <ProtectedRoute>
        <CategoryFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categorias/:id/editar",
    element: (
      <ProtectedRoute>
        <CategoryFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/presupuesto/nuevo",
    element: (
      <ProtectedRoute>
        <NewBudgetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/presupuesto/:id/editar",
    element: (
      <ProtectedRoute>
        <EditBudgetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/metas/nueva",
    element: (
      <ProtectedRoute>
        <NewGoalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/metas/:id",
    element: (
      <ProtectedRoute>
        <GoalDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendario",
    element: (
      <ProtectedRoute>
        <CalendarioPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/registro",
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/recuperar-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    // Sin ProtectedRoute/PublicOnlyRoute: se llega aquí desde el enlace del
    // correo, que crea una sesión temporal — no debe rebotar a ningún lado.
    path: "/actualizar-password",
    element: <ResetPasswordPage />,
  },
]);
