import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatsPage from './pages/ChatsPage';
import ChatRoomPage from './pages/ChatRoomPage';
import VideoPage from './pages/VideoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HallOfFamePage from './pages/HallOfFamePage';
import AvatarStudioPage from './pages/AvatarStudioPage';
import ThroneRoomPage from './pages/ThroneRoomPage';
import FameTrackerPage from './pages/FameTrackerPage';
import FriendsPage from './pages/FriendsPage';
import DJBoothPage from './pages/DJBoothPage';
import SafetyPage from './pages/SafetyPage';
import WalletPage from './pages/WalletPage';
import EarningsPage from './pages/EarningsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-wrap" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p>Waking up Big Face…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/chats" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/chats" replace />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="chats/:id" element={<ChatRoomPage />} />
            <Route path="video" element={<VideoPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="hall-of-fame" element={<HallOfFamePage />} />
            <Route path="avatar-studio" element={<AvatarStudioPage />} />
            <Route path="throne" element={<ThroneRoomPage />} />
            <Route path="fame" element={<FameTrackerPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="dj-booth" element={<DJBoothPage />} />
            <Route path="safety" element={<SafetyPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="u/:id" element={<ProfilePage />} />
            <Route path="profile/edit" element={<ProfileEditPage />} />
            <Route path="*" element={<Navigate to="/chats" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
