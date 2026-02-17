import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import VerificationQueue from '../pages/VerificationQueue';

const ProjectReady = () => (
  // Temporary placeholder component
  <MainLayout user={{name: "User", role: "student"}} pageTitle="Home">
    <div className="p-8 text-center text-white">
      <h1 className="text-3xl font-bold mb-4">Unify Project Ready</h1>
      <p>The project structure is set up. Start building your features!</p>
    </div>
  </MainLayout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProjectReady />,
  },
  {
    path: '/verification-queue',
    element: <VerificationQueue />,
  },
]);

export default router;
