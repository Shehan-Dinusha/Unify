import lazyWithRetry from "../utils/lazyWithRetry";
import GuestRoute from "../components/auth/GuestRoute";
const LoginPage = lazyWithRetry(() => import("../pages/LoginPage"));
const RegisterPage = lazyWithRetry(() => import("../pages/RegisterPage"));
const RegisterAccountTypePage = lazyWithRetry(() => import("../pages/RegisterAccountTypePage"));
const RegisterCredentialsPage = lazyWithRetry(() => import("../pages/RegisterCredentialsPage"));
const RegisterOtpPage = lazyWithRetry(() => import("../pages/RegisterOtpPage"));
const RegisterProfilePage = lazyWithRetry(() => import("../pages/RegisterProfilePage"));
const RegisterSuccessPage = lazyWithRetry(() => import("../pages/RegisterSuccessPage"));
const ForgotPasswordPage = lazyWithRetry(() => import("../pages/ForgotPasswordPage"));

export const authRoutes = [
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/register/account-type", element: <RegisterAccountTypePage /> },
      { path: "/register/credentials", element: <RegisterCredentialsPage /> },
      { path: "/register/otp", element: <RegisterOtpPage /> },
      { path: "/register/profile", element: <RegisterProfilePage /> },
      { path: "/register/success", element: <RegisterSuccessPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
];
