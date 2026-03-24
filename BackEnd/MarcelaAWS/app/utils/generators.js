function pad(n) {
  return String(n).padStart(2, "0");
}

function generateCodigo() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = pad(now.getUTCMonth() + 1);
  const day = pad(now.getUTCDate());
  const hour = pad(now.getUTCHours());
  const minute = pad(now.getUTCMinutes());
  const second = pad(now.getUTCSeconds());

  return Number(`${year}${month}${day}${hour}${minute}${second}`);
}

module.exports = {
  generateCodigo,
};