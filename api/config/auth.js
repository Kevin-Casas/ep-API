module.exports = {
  secreto: process.env.AUTH_SECRETO || "secreto",
  expires: process.env.AUTH_EXPIRES || "1d",
  rounds: process.env.AUTH_ROUNDS || 10
} 