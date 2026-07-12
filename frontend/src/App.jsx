import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import NetworkStatusBanner from "./components/common/NetworkStatusBanner";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";
import { ClubOrderProvider } from "./context/ClubOrderContext";
import router from "./routes";

function App() {
  return (
    <ToastProvider>
      <NetworkStatusBanner />
      <NotificationProvider>
        <ClubOrderProvider>
          <ChatProvider>
            <RouterProvider router={router} />
          </ChatProvider>
        </ClubOrderProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
