/** PM2 config — run: cd /home/john/apps/margies.app && pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "margies-app",
      cwd: __dirname,
      script: "server.mjs",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "128M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 3008,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
