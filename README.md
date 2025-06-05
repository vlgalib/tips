# TipMaster

A universal crypto tipping system for the hospitality industry that combines QR codes, cryptocurrency payments, card payments, and XMTP messaging.

## Features

- QR code generation for staff members
- Multiple payment methods:
  - Credit/debit cards (via Coinbase Commerce)
  - Direct cryptocurrency transfers (USDC on Base mainnet)
  - Interactive XMTP chat-based tipping
- Real-time notifications via XMTP protocol
- Analytics dashboard for staff and restaurant management

## Tech Stack

- Frontend: Next.js 14+ with TypeScript, TailwindCSS, and App Router
- Backend: Firebase Functions with Node.js
- Database: Firebase Realtime Database
- Blockchain: Base mainnet integration
- Messaging: XMTP Node SDK for real-time notifications
- Payments: Coinbase Commerce + OnchainKit + Coinbase AgentKit
- Hosting: Firebase Hosting
- Monitoring: Moralis Streams Firebase Extension

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/vlgalib/tips.git
cd tips
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
# Firebase Configuration
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PROJECT_ID=

# Next.js Public Variables
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# XMTP Configuration
XMTP_PRIVATE_KEY=
XMTP_ENV=production

# Coinbase Configuration
COINBASE_API_KEY=
COINBASE_WEBHOOK_SECRET=

# Base Network
BASE_RPC_URL=https://mainnet.base.org
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [XMTP](https://xmtp.org/)
- [Coinbase Commerce](https://commerce.coinbase.com/)
- [Base](https://base.org/) 