# TipMaster - Crypto Tipping Platform

TipMaster is a modern crypto tipping platform built for restaurant staff, enabling them to receive tips in USDC on Base network. The platform features simplified authentication with Gmail auto-wallet creation and direct Coinbase Wallet connection.

## Features

- 🔐 **Simplified Authentication**
  - Gmail sign-in with automatic wallet creation
  - Direct Coinbase Wallet connection
  - No crypto experience required for staff

- 💰 **USDC Tips on Base**
  - Direct USDC transfers
  - Interactive tipping via XMTP
  - Real-time notifications

- 📱 **Mobile-First Design**
  - QR code generation for staff profiles
  - Responsive dashboard
  - Easy tip scanning

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Blockchain**: Base Network, USDC
- **Messaging**: XMTP
- **Analytics**: Moralis

## Getting Started

### Prerequisites

1. Node.js 18+ and npm
2. Firebase account
3. Coinbase Developer Platform account
4. Moralis account
5. XMTP private key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tipmaster.git
cd tipmaster
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Coinbase Developer Platform
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key
NEXT_PUBLIC_CDP_API_KEY_NAME=your_cdp_api_key_name
NEXT_PUBLIC_CDP_API_KEY_PRIVATE_KEY=your_cdp_api_key_private_key

# XMTP Configuration
XMTP_PRIVATE_KEY=your_xmtp_private_key

# Moralis Configuration
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key

# Base Network
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

4. Start the development server:
```bash
npm run dev
```

## Authentication Flow

### Gmail + Auto Wallet (Staff)
1. Staff clicks "Sign in with Gmail"
2. Google OAuth popup appears
3. System automatically creates a smart wallet (30 seconds)
4. Staff receives email with wallet backup info
5. Staff can generate QR code
6. Ready to receive tips

### Coinbase Wallet (Direct)
1. User clicks "Connect Coinbase Wallet"
2. Coinbase Wallet app opens
3. User confirms connection
4. User signs XMTP activation message
5. User can generate QR code
6. Ready to receive tips

## Project Structure

```
tipmaster/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   └── ui/                # UI components
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript types
│   └── hooks/                  # Custom React hooks
├── functions/                  # Firebase Functions
└── public/                     # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Firebase Functions

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Functions:
```bash
cd functions
npm install
```

4. Deploy functions:
```bash
firebase deploy --only functions
```

## Security

- All private keys and API keys are stored in environment variables
- `.env.local` is git-ignored
- Firebase security rules are configured for data protection
- XMTP messages are end-to-end encrypted

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please create an issue in the GitHub repository or contact the project maintainers.

## Acknowledgments

- Base Network for the L2 infrastructure
- Coinbase for the wallet integration
- XMTP for the messaging system
- Moralis for the analytics 