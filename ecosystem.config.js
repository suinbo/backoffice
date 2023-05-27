module.exports = {
    apps: [
        {
            name: 'gaia-ux-service',
            script: './server.js',
            watch: false,
            autorestart: true,
            max_memory_restart: '1G',
            error_file: '/app/logs/error.log',
            out_file: '/app/logs/out.log',
            combine_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
            env: {
                PM2_SERVE_PATH: 'dist',
                PM2_SERVE_PORT: 8080,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html',
            },
        },
    ],
}
