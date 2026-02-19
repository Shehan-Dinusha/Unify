import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import VerificationQueue from '../pages/VerificationQueue';
import { mockRequests } from '../data/mockData';
import NewsFeed from '../pages/NewsFeed';

const PlaceholderPage = ({ title, verificationCount }) => (
  <MainLayout user={{name: "Alex Johnson", role: "admin"}} pageTitle={title} verificationCount={verificationCount}>
    <div className="flex flex-col items-center justify-center h-full text-center p-lg">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-lg">
        <span className="text-heading-large">🚧</span>
      </div>
      <h1 className="text-heading-medium text-text-primary mb-sm">{title}</h1>
      <p className="text-body-medium text-text-secondary max-w-md">
        This feature is currently under development. Check back soon for updates!
      </p>
    </div>
  </MainLayout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaceholderPage title="Dashboard" verificationCount={mockRequests.length} />,
  },
  {
    path: '/verification-queue',
    element: <VerificationQueue />,
  },
  { path: '/news-feed', 
    element: <NewsFeed />,
  },
  { path: '/notifications', element: <PlaceholderPage title="Notifications" verificationCount={mockRequests.length} /> },
  { path: '/messages', element: <PlaceholderPage title="Messages" verificationCount={mockRequests.length} /> },
  { path: '/lost-and-found', element: <PlaceholderPage title="Lost & Found" verificationCount={mockRequests.length} /> },
  { path: '/marketplace', element: <PlaceholderPage title="Marketplace" verificationCount={mockRequests.length} /> },
  { path: '/learning', element: <PlaceholderPage title="Learning" verificationCount={mockRequests.length} /> },
  { path: '/report-moderation', element: <PlaceholderPage title="Report Moderation" verificationCount={mockRequests.length} /> },
  { path: '/suspended-users', element: <PlaceholderPage title="Suspended Users" verificationCount={mockRequests.length} /> },
  { path: '/boost-controller', element: <PlaceholderPage title="Boost Controller" verificationCount={mockRequests.length} /> },
  { path: '/my-products', element: <PlaceholderPage title="My Products" verificationCount={mockRequests.length} /> },
  { path: '/order-history', element: <PlaceholderPage title="Order History" verificationCount={mockRequests.length} /> },
  { path: '/order-dashboard', element: <PlaceholderPage title="Order Dashboard" verificationCount={mockRequests.length} /> },
]);

export default router;
