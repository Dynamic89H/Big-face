import { usePageTitle } from '../hooks/usePageTitle';

export default function PrivacyPage() {
  usePageTitle('Privacy Policy');
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-sub">Last updated: October 15, 2026</p>
      </div>
      <div className="card" style={{ maxWidth: 720 }}>
        <h3>What Big Face collects</h3>
        <p className="form-note">
          Big Face collects the information you provide directly: your username, display name,
          profile photo, bio, and content you post (messages, media, comments). We also collect
          basic usage data such as XP, levels, and gift activity to run leaderboards and rewards.
        </p>
        <h3>How we use it</h3>
        <p className="form-note">
          Your profile information is visible to other Big Face users. We use your data to operate
          the app — chat, video rooms, leaderboards, gifts, and payouts. We do not sell your
          personal information to third parties.
        </p>
        <h3>Payments</h3>
        <p className="form-note">
          Payouts are processed through PayPal. Big Face takes a 30% platform fee on creator
          earnings; you keep 70%. Payment processing is handled by PayPal under their own
          privacy policy.
        </p>
        <h3>Photos and media</h3>
        <p className="form-note">
          Photos and videos you upload are stored so they can be shown in the app. You can
          delete your posts at any time from your profile.
        </p>
        <h3>Safety</h3>
        <p className="form-note">
          Big Face includes blocking, reporting, and moderation tools. Users who violate our
          community standards may have content removed or accounts suspended. If you are under
          18, please use Big Face with a parent or guardian's permission.
        </p>
        <h3>Your choices</h3>
        <p className="form-note">
          You can edit your profile, delete your posts, block users, and delete your account
          at any time. To request deletion of your data, contact us at the support email below.
        </p>
        <h3>Contact</h3>
        <p className="form-note">
          Questions about this policy? Reach us at dwayneeugene963@gmail.com.
        </p>
      </div>
    </div>
  );
}
