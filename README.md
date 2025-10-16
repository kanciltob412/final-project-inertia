# Final Project (Laravel + Inertia + React)

Quick start (local development)

1. Install PHP/Composer, Node and npm (Homebrew recommended on macOS):

    ```bash
    brew install php composer node
    ```

2. Install project dependencies:

    ```bash
    composer install
    npm install
    ```

3. Create .env and generate app key (if not present):

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. Prepare database and run migrations:

    ```bash
    touch database/database.sqlite
    php artisan migrate
    ```

5. Start backend and frontend (two options):
    - Start both with one command (uses `concurrently`):

        ```bash
        npm run dev:all
        ```

    - Or start separately:

        ```bash
        npm run dev        # Vite dev server (HMR)
        npm run dev:backend # php artisan serve
        ```

Open http://127.0.0.1:8000 in your browser. Vite assets and HMR are served from http://localhost:5173 by default.

VS Code setup

- The workspace is pre-configured to use the project's TypeScript version. Install recommended extensions when prompted.
- To use the workspace TypeScript, reload the VS Code window after opening the project.

Development note — Laravel vs Vite dev server

- The Laravel app is served by PHP (artisan) and renders the Inertia pages. Open the Laravel URL to see the app HTML and React components mounted by Inertia:
    - Laravel (Inertia app): http://127.0.0.1:8000 or http://<your-LAN-IP>:8000

- The Vite dev server serves static HMR assets on port 5173. Opening http://localhost:5173 in a browser will show the Vite dev index (starter page or 404) — this is normal. Don't use that URL to view the full app by itself.

- Convenient helper script
    - A helper script is included at `./scripts/start.sh`. It prints your LAN URLs and runs both the backend and Vite dev server together using `npm run dev:all`.

    - Run it like this:

        ```bash
        ./scripts/start.sh
        ```

    - Or run the servers separately if you prefer:

        ```bash
        npm run dev:frontend   # start Vite on 0.0.0.0:5173 (HMR)
        npm run dev:backend    # start Laravel on 0.0.0.0:8000
        ```

Troubleshooting

- If you open port 5173 and see a starter page, switch to port 8000 to view the actual Inertia app.
- If port 8000 is not reachable, make sure `php artisan serve` is running and not blocked by firewall rules.

Development (Makefile)

- Recommended one-command start (creates hot file, starts both servers, and waits until ready):

```bash
make start-wait
```

- Quick checks and helpers:

```bash
make doctor       # Validate public/hot, ports and /@vite/client
make stop         # Verbose stop (shows what it kills)
make stop-silent  # Quietly stop servers on ports 8000 and 5173
make create-hot   # (re)write public/hot with canonical Vite URL
```

- If you prefer manual startup, open two terminals and run:

```bash
php artisan serve --host=0.0.0.0 --port=8000
npm run dev        # or npm run dev:frontend
```

These Makefile helpers make it easy to start/stop and diagnose the dev environment.
