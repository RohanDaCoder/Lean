module.exports = (timestamp, type) => {
  if (!timestamp)
    throw new TypeError("[Timestamp Util] Timestamp isn't specified");
  if (typeof timestamp !== "number")
    throw new TypeError("[Timestamp Util] Timestamp isn't a number.");
  if (type) {
    if (typeof type !== "string")
      throw new TypeError("[Timestamp Util] Type isn't a string.");
    return `<t:${Math.floor(timestamp / 1000)}${type ? `:${type}` : ""}>`;
  }
};