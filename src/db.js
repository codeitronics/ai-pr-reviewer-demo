// A tiny in-memory stand-in for a SQL database, so the demo runs without one.
// query() accepts SQL text and returns rows asynchronously, like most drivers.

const orders = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  customer: ["acme", "globex", "initech", "umbrella"][i % 4],
  total: Math.round((20 + ((i * 37) % 180)) * 100) / 100,
  status: i % 5 === 0 ? "refunded" : "paid",
}));

export async function query(sql, params = []) {
  await new Promise((r) => setTimeout(r, 5));
  const where = /WHERE customer = '([^']*)'/.exec(sql);
  if (where) return orders.filter((o) => o.customer === where[1]);
  if (/WHERE customer = \$1/.test(sql)) return orders.filter((o) => o.customer === params[0]);
  if (/WHERE id = \$1/.test(sql)) return orders.filter((o) => o.id === Number(params[0]));
  return orders;
}

export async function update(id, fields) {
  await new Promise((r) => setTimeout(r, 5));
  const o = orders.find((x) => x.id === id);
  if (o) Object.assign(o, fields);
  return o;
}
