# TipMaster Deployment Guide

This guide covers the deployment process for TipMaster, including environment setup, configuration, and deployment steps.

## Prerequisites

1. Node.js 18+ and npm
2. Firebase CLI
3. Git
4. Access to required services:
   - Firebase
   - Coinbase Developer Platform
   - Moralis
   - XMTP

## Environment Setup

### 1. Firebase Setup

1. Create a new Firebase project:
```bash
firebase login
firebase projects:create tipmaster
```

2. Enable required services:
   - Authentication (Google, Email)
   - Firestore
   - Functions
   - Hosting

3. Initialize Firebase in your project:
```bash
firebase init
```

### 2. Coinbase Developer Platform Setup

1. Create a new API key:
   - Go to [Coinbase Developer Platform](https://developer.coinbase.com)
   - Create a new API key
   - Save the API key, key name, and private key

2. Configure webhook:
   - Set webhook URL to `https://your-domain.com/api/webhooks/coinbase-commerce`
   - Save the webhook secret

### 3. Moralis Setup

1. Create a new project:
   - Go to [Moralis](https://moralis.io)
   - Create a new project
   - Save the API key

2. Configure Base network stream:
   - Add Base network
   - Create USDC transfer stream
   - Set webhook URL to `https://your-domain.com/api/webhooks/moralis-stream`

### 4. XMTP Setup

1. Generate XMTP private key:
```bash
npx xmtp-js generate-key
```

2. Save the private key securely

## Configuration

### 1. Environment Variables

Create `.env.production` file:

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

### 2. Firebase Configuration

1. Update `firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

2. Update `firestore.rules`:
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /tips/{tipId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Export static files
npm run export
```

### 2. Deploy Firebase Functions

```bash
# Deploy functions
firebase deploy --only functions
```

### 3. Deploy to Firebase Hosting

```bash
# Deploy to hosting
firebase deploy --only hosting
```

### 4. Verify Deployment

1. Check Firebase Console:
   - Functions status
   - Hosting status
   - Authentication setup
   - Firestore rules

2. Test the application:
   - Authentication flow
   - Tip sending
   - Webhook handling
   - Analytics dashboard

## Monitoring

### 1. Firebase Monitoring

1. Set up Firebase Monitoring:
   - Enable Error Reporting
   - Set up Performance Monitoring
   - Configure Cloud Logging

2. Create alerts for:
   - Function errors
   - Authentication failures
   - High latency

### 2. Moralis Monitoring

1. Monitor Base network:
   - Transaction success rate
   - Gas usage
   - Contract interactions

2. Set up alerts for:
   - Failed transactions
   - High gas prices
   - Contract errors

## Backup and Recovery

### 1. Database Backup

1. Set up Firestore backup:
```bash
firebase firestore:backup ./backups
```

2. Schedule regular backups:
```bash
# Add to crontab
0 0 * * * firebase firestore:backup ./backups
```

### 2. Recovery Plan

1. Database recovery:
```bash
firebase firestore:restore ./backups/latest
```

2. Function recovery:
```bash
firebase deploy --only functions
```

## Scaling

### 1. Firebase Scaling

1. Enable Firebase Autoscaling:
   - Set minimum instances
   - Configure maximum instances
   - Set up scaling triggers

2. Optimize Firestore:
   - Use appropriate indexes
   - Implement pagination
   - Cache frequently accessed data

### 2. Application Scaling

1. Implement caching:
   - Use Firebase Hosting CDN
   - Cache API responses
   - Implement client-side caching

2. Optimize performance:
   - Use static generation
   - Implement lazy loading
   - Optimize images and assets

## Security

### 1. API Security

1. Implement rate limiting
2. Set up CORS policies
3. Use API keys for external services

### 2. Data Security

1. Encrypt sensitive data
2. Implement proper access control
3. Regular security audits

## Maintenance

### 1. Regular Updates

1. Update dependencies:
```bash
npm update
```

2. Check for security vulnerabilities:
```bash
npm audit
```

### 2. Monitoring

1. Check application logs
2. Monitor error rates
3. Track performance metrics

## Troubleshooting

### Common Issues

1. Function deployment fails:
   - Check Node.js version
   - Verify dependencies
   - Check function logs

2. Authentication issues:
   - Verify Firebase configuration
   - Check OAuth settings
   - Review security rules

3. Transaction failures:
   - Check gas prices
   - Verify contract addresses
   - Review transaction logs

### Support

For deployment issues:
1. Check Firebase Console
2. Review application logs
3. Contact support@tipmaster.com 