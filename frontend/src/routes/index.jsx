
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

const ProjectReady = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold mb-4">Unify Project Ready</h1>
    <p>The project structure is set up. Start building your features!</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <ProjectReady />,
      },
    ],
  },
]);

export default router;
