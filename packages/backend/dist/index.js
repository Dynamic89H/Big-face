"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const zod_1 = require("zod");
const config_1 = require("./config");
const util_1 = require("./util");
const sockets_1 = require("./sockets");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const friends_1 = __importDefault(require("./routes/friends"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const messages_1 = __importDefault(require("./routes/messages"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const media_1 = __importDefault(require("./routes/media"));
const avatar_1 = __importDefault(require("./routes/avatar"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const stripe_1 = __importDefault(require("./routes/stripe"));
const gifts_1 = __importDefault(require("./routes/gifts"));
const earnings_1 = __importDefault(require("./routes/earnings"));
const throne_1 = __importDefault(require("./routes/throne"));
const admin_1 = __importDefault(require("./routes/admin"));
const reports_1 = __importDefault(require("./routes/reports"));
const video_1 = __importDefault(require("./routes/video"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: config_1.config.frontendUrl, credentials: true }));
app.use((0, morgan_1.default)('dev'));
// The Stripe webhook needs the RAW body for signature verification, so it is
// mounted with express.raw and excluded from express.json.
app.use('/api/stripe/webhook', express_1.default.raw({ type: 'application/json' }));
app.use((req, res, next) => {
    if (req.path === '/api/stripe/webhook')
        return next();
    return express_1.default.json({ limit: '2mb' })(req, res, next);
});
app.use('/uploads', express_1.default.static(config_1.config.uploadDir));
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/friends', friends_1.default);
app.use('/api/rooms', rooms_1.default);
app.use('/api', messages_1.default); // /rooms/:id/messages, /messages/:id/...
app.use('/api/uploads', uploads_1.default);
app.use('/api/media', media_1.default);
app.use('/api/avatar', avatar_1.default);
app.use('/api/wallet', wallet_1.default);
app.use('/api/stripe', stripe_1.default);
app.use('/api/gifts', gifts_1.default);
app.use('/api/earnings', earnings_1.default);
app.use('/api/throne', throne_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api', video_1.default); // /rooms/:id/video/start, /video/sessions/:id/end
app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Global error handler — always responds { error: message }.
app.use((err, _req, res, _next) => {
    if (err instanceof zod_1.z.ZodError) {
        const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        res.status(400).json({ error: message });
        return;
    }
    if (err instanceof multer_1.default.MulterError) {
        res.status(400).json({ error: err.message });
        return;
    }
    if (err instanceof util_1.HttpError) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    if (err && typeof err === 'object' && err.code === '23505') {
        res.status(409).json({ error: 'Already exists' });
        return;
    }
    console.error('[error]', err);
    res.status(500).json({ error: 'Internal server error' });
});
async function boot() {
    fs_1.default.mkdirSync(config_1.config.uploadDir, { recursive: true });
    // Migrations normally run via `npm run migrate`. AUTO_MIGRATE=true is a
    // convenience for deploys where no separate migrate step runs.
    if (process.env.AUTO_MIGRATE === 'true') {
        console.log('[boot] AUTO_MIGRATE=true — running migrations');
        const { runMigrations } = await Promise.resolve().then(() => __importStar(require('./migrate')));
        await runMigrations();
    }
    const server = (0, http_1.createServer)(app);
    (0, sockets_1.initSockets)(server);
    server.listen(config_1.config.port, () => {
        console.log(`[boot] Big Face backend listening on :${config_1.config.port}`);
    });
}
boot().catch((err) => {
    console.error('[boot] failed to start', err);
    process.exit(1);
});
