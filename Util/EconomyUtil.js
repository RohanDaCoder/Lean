const COOLDOWN = {
  DAILY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  WEEKLY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  BEG: 5 * 60 * 1000, // 5 minutes in milliseconds
  WORK: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
};

const onCooldown = (cooldownTime, lastTime) => {
  if (!lastTime) return false;
  const currentTime = Date.now();
  const difference = currentTime - lastTime;
  return difference < cooldownTime;
};

const getCooldown = (cooldownTime, lastTime) => {
  if (!lastTime) return null;
  const currentTime = Date.now();
  const difference = currentTime - lastTime;
  const remainingTime = cooldownTime - difference;
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { COOLDOWN, onCooldown, getCooldown, random };
