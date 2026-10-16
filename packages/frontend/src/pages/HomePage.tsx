import HomeHub from '../components/HomeHub';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Home — Big Face's front door.
 * Scroll through sections, tap to dive into each layer.
 */
export default function HomePage() {
  usePageTitle('Big Face');

  return (
    <div className="page">
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2rem', margin: 0,
          background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
        }}>
          BIG FACE
        </h1>
        <p className="form-note" style={{ margin: '0.3rem 0 0' }}>
          What are you getting into today?
        </p>
      </div>
      <HomeHub />
    </div>
  );
}
