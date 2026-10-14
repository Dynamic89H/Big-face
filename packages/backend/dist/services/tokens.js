"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
exports.addTokens = addTokens;
const db_1 = require("../db");
async function getBalance(userId) {
    const { rows } = await db_1.pool.query('SELECT token_balance FROM users WHERE id = $1', [userId]);
    if (!rows.length)
        throw new Error('User not found');
    return Number(rows[0].token_balance);
}
/**
 * THE only way to change a token balance: the users.token_balance update and the
 * token_transactions ledger row are written in the same database transaction.
 * A balance is never adjusted without a matching transaction row.
 */
async function addTokens(userId, amount, kind, opts = {}) {
    const exec = async (client) => {
        const { rows } = await client.query(`UPDATE users SET token_balance = token_balance + $1, updated_at = now()
       WHERE id = $2 RETURNING token_balance`, [amount, userId]);
        if (!rows.length)
            throw new Error('User not found');
        await client.query(`INSERT INTO token_transactions (user_id, amount, kind, reference, stripe_payment_intent_id)
       VALUES ($1, $2, $3, $4, $5)`, [userId, amount, kind, opts.reference ?? null, opts.stripePaymentIntentId ?? null]);
        return Number(rows[0].token_balance);
    };
    if (opts.client)
        return exec(opts.client);
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        const balance = await exec(client);
        await client.query('COMMIT');
        return balance;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}
