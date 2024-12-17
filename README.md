# EVE Frontier Smart Assembly Base

EVE Frontier Smart Assembly Base is a client-only dapp framework designed for seamless integration with the EVE Frontier game.

## Table of Contents

1. [Project Overview](#project-overview) 🌟
2. [Dependencies](#dependencies) 🔗
3. [Getting Started](#getting-started) 🚀
4. [Testing](#testing) 🧪
5. [Documentation](#documentation) 📚
6. [License](#license) 📜

## Project Overview 🌟

EVE Frontier Smart Assembly Base is a client-only dapp framework designed for seamless integration with the EVE Frontier game. It provides blockchain functionality via Viem and manages blockchain-based data states efficiently. The project is built with TypeScript, Material UI, Tailwind CSS, and Vite.

### Dependencies 🔗

- Node.js (v16+)
- pnpm v8 (install via `npm install --global pnpm@8`)
- OneKey or EVE Vault wallet connected to `https://devnet-data-sync.nursery.reitnorf.com`

## Getting Started 🚀

To get a local copy of the project up and running, follow these simple steps.

1.  **Create a New Project**

    To create a project called _my-eve-dapp_, run this command:

    ```bash
    npx create-eve-dapp --type base my-eve-dapp
    ```

2.  **Open the Newly Cloned Repository**

    ```bash
    cd my-eve-dapp
    ```

3.  **Install Packages**

    ```bash
    pnpm install
    ```

4.  **Set Up Environment Variables**

    Sample values are available in .envsample.

    Copy `.envsample` to `.env` and update the values:

        cp .envsample .env

    Update the following in the .env file:

        VITE_SMARTASSEMBLY_ID=
        VITE_GATEWAY_HTTP="https://blockchain-gateway.nursery.reitnorf.com"
        VITE_GATEWAY_WS="wss://blockchain-gateway.nursery.reitnorf.com"

5.  **Run the Development Server**

    ```bash
    pnpm run dev
    ```

6.  **View the Live App**

    Visit `http://localhost:3000` in your browser to see the app in action.

### Testing 🧪

This project uses Cypress with the Synpress plugin for end-to-end (E2E) testing. It also includes unit and component tests, as well as linting scripts.

### Running E2E Tests

1. **Install Dependencies**

   ```bash
   pnpm i
   ```

2. **Build the Project**

   ```bash
   pnpm run build --mode test
   ```

3. **Preview the Build**

   ```bash
   pnpm preview
   ```

4. **Run E2E Tests**

   In a new terminal window:

   ```bash
   pnpm test:e2e
   ```

### Other Testing and Linting Commands

**Run Component Tests**

    pnpm test:component

**Open Cypress UI**

    npx cypress open

**Fix Linting Issues**

    pnpm lint:fix

### Documentation 📚

Further documentation on the Smart Assembly Base dApp is available at the [EVE Frontier Docs](https://docs.evefrontier.com/Dapp/quick-start).

## License 📜

This project is licensed under the MIT License. See the [LICENSE](../../../LICENSE) file for details.
