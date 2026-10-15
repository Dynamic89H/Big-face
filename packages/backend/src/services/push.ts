import webpush from 'web-push';
import { pool } from '../db';

// VAPID keys — set via environment variables on Railway.
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || 'BG9Mh5vfZuDRG7580TcQ1DAXq56YPf0hvtuzCx70eWYsbtmsrXGXM5VALPfaqd-4gnTsAs7HIE6oEUDLm6gp0pM';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'of3N4gmJhkwl9qPa5WEnY32J1AEK65-QtsI9vTFoOXc';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:dwayneeugene963@gmail.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

export function getVapidPublicKey(): string {
  return VAPID_PUBLIC;
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

/** Send a push notification to one user (all their devices). */
export async function pushToUser(userId: string, payload: PushPayload): Promise<number> {
  const { rows } = await pool.query(
    'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1',
    [userId]
  );
  let sent = 0;
  for (const sub of rows) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ ...payload, icon: payload.icon || '/probus-lion.webp' })
      );
      sent++;
    } catch (e: any) {
      // Remove dead subscriptions (410 Gone = unsubscribed).
      if (e?.statusCode === 410 || e?.statusCode === 404) {
        await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
      }
    }
  }
  return sent;
}

/** Send a push notification to ALL users — global broadcast. */
export async function pushToAll(payload: PushPayload): Promise<{ sent: number; users: number }> {
  const { rows } = await pool.query(
    'SELECT DISTINCT user_id FROM push_subscriptions'
  );
  let sent = 0;
  for (const { user_id } of rows) {
    sent += await pushToUser(user_id, payload);
  }
  return { sent, users: rows.length };
}

// Daily notification content — rotates through engaging messages.
// Each has translations for global reach.
const DAILY_MESSAGES = [
  {
    en: { title: '👑 Your crown is waiting', body: 'Climb the leaderboard on Big Face today. Face King status is up for grabs!' },
    es: { title: '👑 Tu corona te espera', body: 'Sube en la clasificación de Big Face hoy. ¡El título de Rey Cara está en juego!' },
    fr: { title: '👑 Ta couronne t\'attend', body: 'Grimpe au classement sur Big Face aujourd\'hui. Le titre de Roi Face est à prendre!' },
    pt: { title: '👑 Sua coroa está esperando', body: 'Suba no ranking do Big Face hoje. O título de Rei Face está em jogo!' },
    sw: { title: '👑 Taji yako inakungoja', body: 'Panda ubao wa Big Face leo. Cheo cha Mfalme Uso kiko wazi!' },
  },
  {
    en: { title: '🎲 Gamble Face is hot', body: 'Tables are open — roll the dice and win up to $250. Feeling lucky?' },
    es: { title: '🎲 Gamble Face está caliente', body: 'Las mesas están abiertas — tira los dados y gana hasta $250. ¿Te sientes afortunado?' },
    fr: { title: '🎲 Gamble Face chauffe', body: 'Les tables sont ouvertes — lance les dés et gagne jusqu\'à 250$. Tu te sens chanceux?' },
    pt: { title: '🎲 Gamble Face está quente', body: 'As mesas estão abertas — jogue os dados e ganhe até $250. Sentindo sorte?' },
    sw: { title: '🎲 Gamble Face ni moto', body: 'Meza ziko wazi — rusha kete ushinde hadi $250. Unajisikia na bahati?' },
  },
  {
    en: { title: '💰 Level up = get paid', body: 'Every level-up pays tokens. Rank up on Big Face and cash out real money!' },
    es: { title: '💰 Sube de nivel = cobra', body: 'Cada nivel paga tokens. ¡Sube de rango en Big Face y retira dinero real!' },
    fr: { title: '💰 Monte de niveau = sois payé', body: 'Chaque niveau rapporte des tokens. Monte en grade sur Big Face et encaisse de l\'argent réel!' },
    pt: { title: '💰 Suba de nível = receba', body: 'Cada nível paga tokens. Suba no Big Face e saque dinheiro real!' },
    sw: { title: '💰 Panda ngazi = lipwa', body: 'Kila ngazi inalipa tokeni. Panda cheo Big Face na utoe pesa halisi!' },
  },
  {
    en: { title: '⚔️ Battle time', body: 'Gift battles are live! Team up, send gifts, and dominate the arena.' },
    es: { title: '⚔️ Hora de batalla', body: '¡Las batallas de regalos están en vivo! Forma equipo, envía regalos y domina la arena.' },
    fr: { title: '⚔️ Heure du combat', body: 'Les batailles de cadeaux sont en direct! Fais équipe, envoie des cadeaux et domine l\'arène.' },
    pt: { title: '⚔️ Hora da batalha', body: 'Batalhas de presentes ao vivo! Junte-se, envie presentes e domine a arena.' },
    sw: { title: '⚔️ Wakati wa vita', body: 'Vita vya zawadi viko hewani! Ungana, tuma zawadi, utawale uwanja.' },
  },
  {
    en: { title: '🎤 Drop your track', body: 'Artist Spotlight is waiting. Upload your music and get tipped by fans!' },
    es: { title: '🎤 Sube tu tema', body: 'Artist Spotlight te espera. ¡Sube tu música y recibe propinas de fans!' },
    fr: { title: '🎤 Dépose ton morceau', body: 'Artist Spotlight t\'attend. Télécharge ta musique et reçois des pourboires de fans!' },
    pt: { title: '🎤 Lance sua música', body: 'Artist Spotlight está esperando. Envie sua música e receba gorjetas de fãs!' },
    sw: { title: '🎤 Weka wimbo wako', body: 'Artist Spotlight inakungoja. Pakia muziki wako upokee zawadi kutoka kwa mashabiki!' },
  },
  {
    en: { title: '🏠 Live like a king', body: 'New mansions and exotic whips in the Lifestyle shop. Customize your ride!' },
    es: { title: '🏠 Vive como un rey', body: 'Nuevas mansiones y autos exóticos en la tienda. ¡Personaliza tu auto!' },
    fr: { title: '🏠 Vis comme un roi', body: 'Nouveaux manoirs et voitures exotiques dans la boutique. Personnalise ta voiture!' },
    pt: { title: '🏠 Viva como um rei', body: 'Novas mansões e carros exóticos na loja. Personalize seu carro!' },
    sw: { title: '🏠 Ishi kama mfalme', body: 'Majumba mapya na magari ya kifahari dukani. Binafsisha gari lako!' },
  },
  {
    en: { title: '👥 Join a crew', body: 'Crews are battling for dominance. Join one and fight in crew wars!' },
    es: { title: '👥 Únete a un crew', body: 'Los crews luchan por el dominio. ¡Únete y pelea en guerras de crews!' },
    fr: { title: '👥 Rejoins un crew', body: 'Les crews se battent pour la domination. Rejoins-en un et combats!' },
    pt: { title: '👥 Entre para um crew', body: 'Crews batalham pela dominância. Entre para um e lute nas guerras!' },
    sw: { title: '👥 Jiunge na kikundi', body: 'Vikundi vinapigania utawala. Jiunge na upigane vita vya vikundi!' },
  },
];

/** Get today's rotating message, localized by language code. */
export function getDailyMessage(lang: string = 'en'): { title: string; body: string } {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const msg = DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
  const l = (lang || 'en').toLowerCase().slice(0, 2);
  const key = ['en', 'es', 'fr', 'pt', 'sw'].includes(l) ? l : 'en';
  return (msg as any)[key] || msg.en;
}
