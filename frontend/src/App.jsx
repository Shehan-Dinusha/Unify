import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { NotificationProvider } from "./context/NotificationContext";
import router from "./routes";

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
