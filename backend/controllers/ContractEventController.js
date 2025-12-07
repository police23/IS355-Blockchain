const db = require('../db');

const list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    const type = req.query.type; // event_name filter
    const offset = (page - 1) * limit;

    const params = [];
    let where = '';
    if (type) {
      where = 'WHERE ce.event_name = ?';
      params.push(type);
    }

    const sql = `
      SELECT
        ce.id,
        ce.transaction_hash,
        ce.event_name,
        ce.order_id,
        ce.payload,
        ce.block_number,
        ce.created_at,
        o.id as order_numeric_id,
        o.status as order_status,
        o.final_amount as order_final_amount,
        o.buyer_wallet_address as order_buyer_wallet
      FROM contract_events ce
      LEFT JOIN orders o ON o.id = ce.order_id
      ${where}
      ORDER BY ce.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows = await db.query(sql, {
      replacements: [...params, parseInt(limit), parseInt(offset)],
      type: db.QueryTypes.SELECT,
    });

    const countSql = `SELECT COUNT(*) as total FROM contract_events ce ${where}`;
    const countRes = await db.query(countSql, {
      replacements: params,
      type: db.QueryTypes.SELECT,
    });

    return res.json({ items: rows, total: countRes[0].total, page, limit });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
};
