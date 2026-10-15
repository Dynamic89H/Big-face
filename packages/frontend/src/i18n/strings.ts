export type Lang = 'en' | 'es' | 'fr' | 'pt';

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

const en = {
  nav_home: 'Home', nav_chat: 'Chats', nav_video: 'Video', nav_friends: 'Friends',
  nav_lifestyle: 'Lifestyle', nav_battles: 'Battles', nav_crews: 'Crews', nav_artists: 'Artists',
  nav_earnings: 'Earnings', nav_profile: 'Profile', nav_leaderboard: 'Leaderboard',
  nav_hall: 'Hall of Fame', nav_studio: 'Avatar Studio', nav_throne: 'Throne Room',
  nav_fame: 'Fame Tracker', nav_dj: 'DJ Booth', nav_safety: 'Safety', nav_wallet: 'Wallet',
  battles_title: 'Gift Battles', battles_go_live: 'Go Live', battles_join: 'Join Battle',
  crews_title: 'Crews', crews_join: 'Join', crews_found: 'Found a crew',
  artists_title: 'Artist Spotlight', artists_tip: 'Tip Artist',
  earnings_title: 'Earnings', common_loading: 'Loading…', common_send: 'Send',
};

const es: typeof en = {
  nav_home: 'Inicio', nav_chat: 'Chats', nav_video: 'Video', nav_friends: 'Amigos',
  nav_lifestyle: 'Estilo de vida', nav_battles: 'Batallas', nav_crews: 'Pandillas', nav_artists: 'Artistas',
  nav_earnings: 'Ganancias', nav_profile: 'Perfil', nav_leaderboard: 'Clasificación',
  nav_hall: 'Salón de la fama', nav_studio: 'Estudio de avatar', nav_throne: 'Sala del trono',
  nav_fame: 'Rastreador de fama', nav_dj: 'Cabina DJ', nav_safety: 'Seguridad', nav_wallet: 'Billetera',
  battles_title: 'Batallas de regalos', battles_go_live: 'En vivo', battles_join: 'Unirse',
  crews_title: 'Pandillas', crews_join: 'Unirse', crews_found: 'Crear pandilla',
  artists_title: 'Artistas destacados', artists_tip: 'Dar propina',
  earnings_title: 'Ganancias', common_loading: 'Cargando…', common_send: 'Enviar',
};

const fr: typeof en = {
  nav_home: 'Accueil', nav_chat: 'Discussions', nav_video: 'Vidéo', nav_friends: 'Amis',
  nav_lifestyle: 'Style de vie', nav_battles: 'Batailles', nav_crews: 'Équipes', nav_artists: 'Artistes',
  nav_earnings: 'Gains', nav_profile: 'Profil', nav_leaderboard: 'Classement',
  nav_hall: 'Temple de la renommée', nav_studio: "Studio d'avatar", nav_throne: 'Salle du trône',
  nav_fame: 'Suivi de célébrité', nav_dj: 'Cabine DJ', nav_safety: 'Sécurité', nav_wallet: 'Portefeuille',
  battles_title: 'Batailles de cadeaux', battles_go_live: 'En direct', battles_join: 'Rejoindre',
  crews_title: 'Équipes', crews_join: 'Rejoindre', crews_found: 'Créer une équipe',
  artists_title: 'Artistes en vedette', artists_tip: 'Donner un pourboire',
  earnings_title: 'Gains', common_loading: 'Chargement…', common_send: 'Envoyer',
};

const pt: typeof en = {
  nav_home: 'Início', nav_chat: 'Conversas', nav_video: 'Vídeo', nav_friends: 'Amigos',
  nav_lifestyle: 'Estilo de vida', nav_battles: 'Batalhas', nav_crews: 'Equipes', nav_artists: 'Artistas',
  nav_earnings: 'Ganhos', nav_profile: 'Perfil', nav_leaderboard: 'Classificação',
  nav_hall: 'Hall da fama', nav_studio: 'Estúdio de avatar', nav_throne: 'Sala do trono',
  nav_fame: 'Rastreador de fama', nav_dj: 'Cabine DJ', nav_safety: 'Segurança', nav_wallet: 'Carteira',
  battles_title: 'Batalhas de presentes', battles_go_live: 'Ao vivo', battles_join: 'Entrar',
  crews_title: 'Equipes', crews_join: 'Entrar', crews_found: 'Criar equipe',
  artists_title: 'Artistas em destaque', artists_tip: 'Dar gorjeta',
  earnings_title: 'Ganhos', common_loading: 'Carregando…', common_send: 'Enviar',
};

export const STRINGS: Record<Lang, typeof en> = { en, es, fr, pt };
export type StringKey = keyof typeof en;
