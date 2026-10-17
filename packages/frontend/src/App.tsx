import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LangProvider } from './i18n/LangContext';
import Layout from './components/Layout';
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

// Lazy-load all pages — initial bundle only ships auth shell + chats entry point.
// Each page loads on demand, keeping first paint under 2s on 4G.
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ChatsPage = lazy(() => import('./pages/ChatsPage'));
const ChatRoomPage = lazy(() => import('./pages/ChatRoomPage'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const HallOfFamePage = lazy(() => import('./pages/HallOfFamePage'));
const AvatarStudioPage = lazy(() => import('./pages/AvatarStudioPage'));
const ThroneRoomPage = lazy(() => import('./pages/ThroneRoomPage'));
const FameTrackerPage = lazy(() => import('./pages/FameTrackerPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const LifestylePage = lazy(() => import('./pages/LifestylePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CompetitionPage = lazy(() => import('./pages/CompetitionPage'));
const SocialPage = lazy(() => import('./pages/SocialPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const VisionPage = lazy(() => import('./pages/VisionPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const RanksPage = lazy(() => import('./pages/RanksPage'));
const SeasonsPage = lazy(() => import('./pages/SeasonsPage'));
const BattlesPage = lazy(() => import('./pages/BattlePage').then((m) => ({ default: m.BattlesPage })));
const BattleRoomPage = lazy(() => import('./pages/BattlePage').then((m) => ({ default: m.BattleRoomPage })));
const CrewsPage = lazy(() => import('./pages/CrewsPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const GamblePage = lazy(() => import('./pages/GamblePage'));
const FactoryPage = lazy(() => import('./pages/FactoryPage'));
const LobbyPage = lazy(() => import('./pages/LobbyPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DJBoothPage = lazy(() => import('./pages/DJBoothPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const EarningsPage = lazy(() => import('./pages/EarningsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'));

// Lightweight page-loading fallback — matches the app's blue brand
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '3px solid rgba(0,150,255,0.2)', borderTopColor: '#0096ff',
        animation: 'blueSpin 0.9s linear infinite',
      }} />
    </div>
  );
}

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
          <Route path="/login" element={<PublicOnly><Suspense fallback={<PageLoader />}><LoginPage /></Suspense></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Suspense fallback={<PageLoader />}><SignupPage /></Suspense></PublicOnly>} />
          <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/chats" replace />} />
            <Route path="chats" element={<Suspense fallback={<PageLoader />}><ChatsPage /></Suspense>} />
            <Route path="chats/:id" element={<Suspense fallback={<PageLoader />}><ChatRoomPage /></Suspense>} />
            <Route path="video" element={<Suspense fallback={<PageLoader />}><VideoPage /></Suspense>} />
            <Route path="leaderboard" element={<Suspense fallback={<PageLoader />}><LeaderboardPage /></Suspense>} />
            <Route path="hall-of-fame" element={<Suspense fallback={<PageLoader />}><HallOfFamePage /></Suspense>} />
            <Route path="avatar-studio" element={<Suspense fallback={<PageLoader />}><AvatarStudioPage /></Suspense>} />
            <Route path="throne" element={<Suspense fallback={<PageLoader />}><ThroneRoomPage /></Suspense>} />
            <Route path="fame" element={<Suspense fallback={<PageLoader />}><FameTrackerPage /></Suspense>} />
            <Route path="friends" element={<Suspense fallback={<PageLoader />}><FriendsPage /></Suspense>} />
            <Route path="lifestyle" element={<Suspense fallback={<PageLoader />}><LifestylePage /></Suspense>} />
            <Route path="shop" element={<Suspense fallback={<PageLoader />}><ShopPage /></Suspense>} />
            <Route path="competition" element={<Suspense fallback={<PageLoader />}><CompetitionPage /></Suspense>} />
            <Route path="social" element={<Suspense fallback={<PageLoader />}><SocialPage /></Suspense>} />
            <Route path="stories" element={<Suspense fallback={<PageLoader />}><StoriesPage /></Suspense>} />
            <Route path="vault" element={<Suspense fallback={<PageLoader />}><VaultPage /></Suspense>} />
            <Route path="vision" element={<Suspense fallback={<PageLoader />}><VisionPage /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
            <Route path="ranks" element={<Suspense fallback={<PageLoader />}><RanksPage /></Suspense>} />
            <Route path="seasons" element={<Suspense fallback={<PageLoader />}><SeasonsPage /></Suspense>} />
            <Route path="battles" element={<Suspense fallback={<PageLoader />}><BattlesPage /></Suspense>} />
            <Route path="battles/:id" element={<Suspense fallback={<PageLoader />}><BattleRoomPage /></Suspense>} />
            <Route path="crews" element={<Suspense fallback={<PageLoader />}><CrewsPage /></Suspense>} />
            <Route path="artists" element={<Suspense fallback={<PageLoader />}><ArtistsPage /></Suspense>} />
            <Route path="gamble" element={<Suspense fallback={<PageLoader />}><GamblePage /></Suspense>} />
            <Route path="factory" element={<Suspense fallback={<PageLoader />}><FactoryPage /></Suspense>} />
            <Route path="character-studio" element={<Navigate to="/avatar-studio" replace />} />
            <Route path="lobby" element={<Suspense fallback={<PageLoader />}><LobbyPage /></Suspense>} />
            <Route path="home" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
            <Route path="insights" element={<Suspense fallback={<PageLoader />}><InsightsPage /></Suspense>} />
            <Route path="dj-booth" element={<Suspense fallback={<PageLoader />}><DJBoothPage /></Suspense>} />
            <Route path="safety" element={<Suspense fallback={<PageLoader />}><SafetyPage /></Suspense>} />
            <Route path="wallet" element={<Suspense fallback={<PageLoader />}><WalletPage /></Suspense>} />
            <Route path="earnings" element={<Suspense fallback={<PageLoader />}><EarningsPage /></Suspense>} />
            <Route path="u/:id" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
            <Route path="profile" element={<ProfileRedirect />} />
            <Route path="profile/edit" element={<Suspense fallback={<PageLoader />}><ProfileEditPage /></Suspense>} />
            <Route path="*" element={<Navigate to="/chats" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
      </LangProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

// Redirect /profile to the current user's profile page
function ProfileRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/u/${user.id}`} replace />;
}
