# TipMaster API Documentation

## Authentication Endpoints

### POST /api/auth/gmail
Authenticate user with Gmail and create a smart wallet.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "wallet": {
      "address": "0x...",
      "backupInfo": "encrypted_backup_info"
    }
  }
}
```

### POST /api/auth/coinbase
Authenticate user with Coinbase Wallet.

**Request Body:**
```json
{
  "address": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "address": "0x..."
    }
  }
}
```

## Tips Endpoints

### POST /api/tips/send
Send a tip to a staff member.

**Request Body:**
```json
{
  "recipientId": "user_id",
  "amount": "10.00",
  "currency": "USDC",
  "message": "Great service!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "status": "pending"
  }
}
```

### GET /api/tips/history
Get tip history for a user.

**Query Parameters:**
- `userId`: User ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "tips": [
      {
        "id": "tip_id",
        "amount": "10.00",
        "currency": "USDC",
        "sender": "0x...",
        "recipient": "0x...",
        "message": "Great service!",
        "timestamp": "2024-03-20T12:00:00Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

## Analytics Endpoints

### GET /api/analytics/dashboard
Get analytics dashboard data.

**Query Parameters:**
- `userId`: User ID
- `period`: Time period (day, week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTips": "1000.00",
    "tipCount": 50,
    "averageTip": "20.00",
    "trends": {
      "daily": [
        {
          "date": "2024-03-20",
          "amount": "100.00",
          "count": 5
        }
      ]
    }
  }
}
```

## Firebase Functions

### startXmtpAgent
Starts the XMTP agent for monitoring transactions.

**Trigger:** HTTP request

**Request:**
```json
{
  "userId": "user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "agent_id",
    "status": "running"
  }
}
```

### monitorUsdcTransfers
Monitors USDC transfers on Base network.

**Trigger:** Moralis Stream webhook

**Request Body:**
```json
{
  "streamId": "stream_id",
  "transaction": {
    "hash": "0x...",
    "from": "0x...",
    "to": "0x...",
    "value": "1000000"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_REQUEST`: Invalid request parameters
- `INSUFFICIENT_FUNDS`: Insufficient funds for transaction
- `TRANSACTION_FAILED`: Transaction failed
- `SERVER_ERROR`: Internal server error

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Tips endpoints: 10 requests per minute
- Analytics endpoints: 20 requests per minute

## Webhooks

### Coinbase Commerce Webhook
Endpoint: `/api/webhooks/coinbase-commerce`

**Headers:**
- `X-CC-Webhook-Signature`: Webhook signature

**Request Body:**
```json
{
  "id": "event_id",
  "type": "charge:confirmed",
  "data": {
    "id": "charge_id",
    "amount": "10.00",
    "currency": "USD",
    "status": "CONFIRMED"
  }
}
```

### Moralis Stream Webhook
Endpoint: `/api/webhooks/moralis-stream`

**Headers:**
- `X-API-Key`: Moralis API key

**Request Body:**
```json
{
  "streamId": "stream_id",
  "transaction": {
    "hash": "0x...",
    "from": "0x...",
    "to": "0x...",
    "value": "1000000"
  }
}
``` 