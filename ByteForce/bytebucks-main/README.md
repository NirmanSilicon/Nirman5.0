# ByteBucks - NFT Marketplace

ByteBucks is a modern, full-featured NFT marketplace built with a cutting-edge technology stack. It provides a platform for users to create, trade, and manage their digital assets in a seamless and intuitive way. This project features a React-based frontend, a Supabase backend, and integrates with Ethereum-based blockchains for wallet connectivity.

## Features

*   **NFT Browsing:** Explore and discover NFTs on the marketplace.
*   **User Profiles:** View user collections and activity.
*   **NFT Minting:** Create new NFTs and add them to the marketplace.
*   **Wallet Integration:** Connect with Ethereum wallets like MetaMask.
*   **Dashboard:** A comprehensive user dashboard to manage assets, view analytics, and track portfolio performance.
*   **Search:** A powerful search functionality to find NFTs and collections.
*   **Social Features:** Follow users and comment on NFTs.

## Tech Stack

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui, Radix UI
*   **Routing:** React Router
*   **State Management:** TanStack Query
*   **Form Handling:** React Hook Form & Zod

### Backend

*   **Platform:** Supabase
*   **Database:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth
*   **Storage:** Supabase Storage for NFT media
*   **Serverless Functions:** Supabase Functions (written in TypeScript)

### Blockchain

*   **Wallet Connectivity:** wagmi & viem
*   **Wallet UI:** RainbowKit
*   **Supported Chains:** Ethereum, Polygon, and other EVM-compatible chains.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or another package manager
*   A Supabase account for the backend setup

### Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd bytebucks-main
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

You need to set up your environment variables for the application to connect to Supabase.

1.  Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```

2.  Fill in the required Supabase URL and Anon Key in the `.env` file:
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

### Running the Development Server

Once you've installed the dependencies and configured your environment variables, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase.
*   `npm run preview`: Previews the production build locally.