"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const util_1 = require("../util");
const auth_1 = require("../middleware/auth");
const xp_1 = require("../services/xp");
const legendary_1 = require("../services/legendary");
const router = (0, express_1.Router)();
router.get('/me', auth_1.requireAuth, (0, util_1.asyncHandler)(async (req, res) => {
    const me = req.user.id;
    const { rows } = await db_1.pool.query(`SELECT xp, level,
              (SELECT COUNT(*)::int + 1 FROM users WHERE xp > u.xp) AS rank
       FROM users u WHERE u.id = $1`, [me]);
    const xp = Number(rows[0].xp);
    const level = Number(rows[0].level);
    res.json({
        level,
        tier: (0, xp_1.tierForLevel)(level),
        xp,
        xpForNext: (0, xp_1.xpForLevel)(level + 1) - xp,
        rank: rows[0].rank,
    });
}));
router.get('/legendary', auth_1.requireAuth, (0, util_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, legendary_1.getLatestLegendary)());
}));
exports.default = router;
