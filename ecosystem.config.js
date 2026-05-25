module.exports = {
  apps: [
    {
      name: 'agenda-contactos-backend',
      script: 'server.js',
      cwd: '/var/www/Proyecto SO II/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_USER: 'root',
        DB_PASSWORD: '',
        DB_NAME: 'agenda_contactos',
        JWT_SECRET: 'agenda-secreto-super-seguro-2026-cambiar-esto'
      },
      error_file: '/var/www/Proyecto SO II/logs/backend-error.log',
      out_file: '/var/www/Proyecto SO II/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      merge_logs: true,
      listen_timeout: 10000
    },
    {
      name: 'agenda-contactos-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/Proyecto SO II/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        VITE_API_URL: 'http://localhost:5000/api'
      },
      error_file: '/var/www/Proyecto SO II/logs/frontend-error.log',
      out_file: '/var/www/Proyecto SO II/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      merge_logs: true,
      listen_timeout: 10000
    }
  ],
  
  deploy: {
    production: {
      user: 'lester',
      host: 'localhost',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/Proyecto SO II',
      'post-deploy': 'npm install'
    }
  }
};
