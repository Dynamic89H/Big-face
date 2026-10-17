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
      <div className="page-head" style={{ textAlign: 'center' }}>
        <h1 className="page-title">BIG FACE</h1>
        <p className="page-sub">
          What are you getting into today?
        </p>
      </div>
      <HomeHub />
    </div>
  );
}
