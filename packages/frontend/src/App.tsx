import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LangProvider } from './i18n/LangContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatsPage from './pages/ChatsPage';
import ChatRoomPage from './pages/ChatRoomPage';
import VideoPage from './pages/VideoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HallOfFamePage from './pages/HallOfFamePage';
const AvatarStudioPage = lazy(() => import('./pages/AvatarStudioPage'));
import ThroneRoomPage from './pages/ThroneRoomPage';
import FameTrackerPage from './pages/FameTrackerPage';
import FriendsPage from './pages/FriendsPage';
import LifestylePage from './pages/LifestylePage';
import ShopPage from './pages/ShopPage';
import CompetitionPage from './pages/CompetitionPage';
import SocialPage from './pages/SocialPage';
import StoriesPage from './pages/StoriesPage';
import VaultPage from './pages/VaultPage';
import VisionPage from './pages/VisionPage';
import SettingsPage from './pages/SettingsPage';
import RanksPage, { RankBadge } from './pages/RanksPage';
import SeasonsPage from './pages/SeasonsPage';
import { BattlesPage, BattleRoomPage } from './pages/BattlePage';
import CrewsPage from './pages/CrewsPage';
import ArtistsPage from './pages/ArtistsPage';
import GamblePage from './pages/GamblePage';
import FactoryPage from './pages/FactoryPage';
import CharacterStudioPage from './pages/CharacterStudioPage';
import LobbyPage from './pages/LobbyPage';
import HomePage from './pages/HomePage';
import InsightsPage from './pages/InsightsPage';
import PrivacyPage from './pages/PrivacyPage';
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
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #0a2540 0%, #061525 50%, #030a12 100%)',
      }}>
        <style>{`
          @keyframes bluePulse {
            0%, 100% { box-shadow: 0 0 30px rgba(0,150,255,0.6), 0 0 60px rgba(0,150,255,0.3); transform: scale(1); }
            50% { box-shadow: 0 0 50px rgba(0,150,255,0.9), 0 0 100px rgba(0,150,255,0.5); transform: scale(1.05); }
          }
          @keyframes blueSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes blueShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
        {/* Blue glowing ring around logo */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <div style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#0096ff', borderRightColor: 'rgba(0,150,255,0.3)',
            animation: 'blueSpin 1.2s linear infinite',
          }} />
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            overflow: 'hidden', animation: 'bluePulse 2s ease-in-out infinite',
            border: '2px solid rgba(0,150,255,0.5)',
          }}>
            <img src="/probus-lion.webp" alt="Big Face"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 800, margin: 0,
          background: 'linear-gradient(90deg, #0096ff, #66ccff, #0096ff)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'blueShimmer 2s linear infinite',
        }}>
          BIG FACE
        </h1>
        <p style={{ color: 'rgba(0,150,255,0.7)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Waking up…
        </p>
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

import { lazy, Suspense } from 'react';
import Celebration from './components/Celebration';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';

// Lazy-load 3D engines — keeps initial bundle lean, loads Three.js only when needed
const EngineCanvas = lazy(() => import('./components/EngineCanvas'));

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <OfflineBanner />
      <Suspense fallback={null}>
        <EngineCanvas />
      </Suspense>
      <Celebration />
      <LangProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
          <Route path="/privacy" element={<PrivacyPage />} />
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
            <Route path="lifestyle" element={<LifestylePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="competition" element={<CompetitionPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="stories" element={<StoriesPage />} />
            <Route path="vault" element={<VaultPage />} />
            <Route path="vision" element={<VisionPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="ranks" element={<RanksPage />} />
            <Route path="seasons" element={<SeasonsPage />} />
            <Route path="battles" element={<BattlesPage />} />
            <Route path="battles/:id" element={<BattleRoomPage />} />
            <Route path="crews" element={<CrewsPage />} />
            <Route path="artists" element={<ArtistsPage />} />
            <Route path="gamble" element={<GamblePage />} />
            <Route path="factory" element={<FactoryPage />} />
            <Route path="character-studio" element={<CharacterStudioPage />} />
            <Route path="lobby" element={<LobbyPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="insights" element={<InsightsPage />} />
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
      </LangProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
