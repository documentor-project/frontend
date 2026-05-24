import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ProfilePage from '@/pages/Profile';
import DocumentUploadPage from '@/pages/DocumentUpload';
import QuestionSettingsPage from '@/pages/QuestionSettings';
import QuestionListPage from '@/pages/QuestionList';
import NotificationSettingsPage from '@/pages/NotificationSettings';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DOCUMENT_UPLOAD: '/documents/upload',
  QUESTION_SETTINGS: '/questions/settings',
  QUESTION_LIST: '/questions',
  NOTIFICATION_SETTINGS: '/notifications/settings',
} as const;

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: ROUTES.DOCUMENT_UPLOAD,
    element: <DocumentUploadPage />,
  },
  {
    path: ROUTES.QUESTION_SETTINGS,
    element: <QuestionSettingsPage />,
  },
  {
    path: ROUTES.QUESTION_LIST,
    element: <QuestionListPage />,
  },
  {
    path: ROUTES.NOTIFICATION_SETTINGS,
    element: <NotificationSettingsPage />,
  },
]);

export default router;
