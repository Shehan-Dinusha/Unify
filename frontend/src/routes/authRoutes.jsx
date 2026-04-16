import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RegisterAccountTypePage from "../pages/RegisterAccountTypePage";
import RegisterCredentialsPage from "../pages/RegisterCredentialsPage";
import RegisterOtpPage from "../pages/RegisterOtpPage";
import RegisterProfilePage from "../pages/RegisterProfilePage";
import RegisterSuccessPage from "../pages/RegisterSuccessPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/register/account-type", element: <RegisterAccountTypePage /> },
  { path: "/register/credentials", element: <RegisterCredentialsPage /> },
  { path: "/register/otp", element: <RegisterOtpPage /> },
  { path: "/register/profile", element: <RegisterProfilePage /> },
  { path: "/register/success", element: <RegisterSuccessPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
];
