# Shareholder API Documentation

## Overview
The Shareholder API allows you to manage shareholders who want to buy shares in the company. The minimum share purchase amount is **$100**.

## Base URL
```
/shareholders
```

## Endpoints

### 1. Get All Shareholders
**GET** `/shareholders`

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of results per page

**Response:**
```json
{
  "data": {
    "shareholders": [
      {
        "id": "uuid",
        "first_name": "John",
        "middle_name": "Michael",
        "surname": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "address": "123 Main Street, City, Country",
        "share_amount": 500.00,
        "number_of_shares": 5,
        "payment_status": "pending",
        "identification_type": "passport",
        "identification_number": "AB123456",
        "nationality": "USA",
        "date_of_birth": "1990-01-15",
        "agreement_signed": true,
        "agreement_date": "2026-06-09T10:30:00Z",
        "notes": "VIP investor",
        "created_at": "2026-06-09T10:30:00Z",
        "updated_at": "2026-06-09T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "status": 200,
  "message": "Shareholders fetched successfully"
}
```

### 2. Get Shareholder by ID
**GET** `/shareholders/:id`

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "first_name": "John",
    "middle_name": "Michael",
    "surname": "Doe",
    "email": "john.doe@example.com",
    ...
  },
  "status": 200,
  "message": "Shareholder fetched successfully"
}
```

### 3. Create Shareholder
**POST** `/shareholders`

**Request Body:**
```json
{
  "first_name": "John",
  "middle_name": "Michael",  // Optional
  "surname": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street, City, Country",
  "share_amount": 500.00,  // Minimum: $100
  "payment_status": "pending",  // Optional, default: pending. Options: pending, completed, failed, refunded
  "identification_type": "passport",  // Options: passport, national_id, drivers_license, other
  "identification_number": "AB123456",
  "nationality": "USA",
  "date_of_birth": "1990-01-15",  // Format: YYYY-MM-DD
  "agreement_signed": false,  // Optional, default: false
  "notes": "Additional notes"  // Optional
}
```

**Validation Rules:**
- `first_name`: Required, not empty
- `middle_name`: Optional
- `surname`: Required, not empty
- `email`: Required, valid email format, unique
- `phone`: Required, not empty
- `address`: Required, not empty
- `share_amount`: Required, minimum $100
- `identification_type`: Required, valid option
- `identification_number`: Required, not empty
- `nationality`: Required, not empty
- `date_of_birth`: Required, must be in the past

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "first_name": "John",
    "middle_name": "Michael",
    "surname": "Doe",
    "number_of_shares": 5,  // Auto-calculated: $500 / $100 = 5 shares
    ...
  },
  "status": 201,
  "message": "Shareholder created successfully"
}
```

### 4. Update Shareholder
**PUT** `/shareholders/:id`

**Request Body:** (All fields optional)
```json
{
  "first_name": "Jane",
  "middle_name": "Elizabeth",
  "surname": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210",
  "share_amount": 1000.00,
  "payment_status": "completed",
  "agreement_signed": true
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "first_name": "Jane",
    "middle_name": "Elizabeth",
    "surname": "Smith",
    "number_of_shares": 10,  // Auto-updated when share_amount changes
    ...
  },
  "status": 200,
  "message": "Shareholder updated successfully"
}
```

### 5. Delete Shareholder
**DELETE** `/shareholders/:id`

**Response:**
```json
{
  "data": 1,
  "status": 200,
  "message": "Shareholder deleted successfully"
}
```

## Features

### 1. Name Structure
- Names are split into three fields: `first_name`, `middle_name` (optional), `surname`
- Virtual `full_name` getter combines them: "John Michael Doe" or "John Doe"

### 2. Automatic Share Calculation
- Number of shares is automatically calculated based on `share_amount`
- Formula: `number_of_shares = floor(share_amount / 100)`
- Example: $500 = 5 shares, $750 = 7 shares

### 3. Minimum Share Amount
- Minimum purchase: **$100**
- Validation error returned if amount is less than $100

### 4. Payment Tracking
- **Payment Status:** pending (default), completed, failed, refunded

### 5. Agreement Tracking
- `agreement_signed`: Boolean flag
- `agreement_date`: Automatically set when agreement is signed
- Auto-updates when `agreement_signed` changes to `true`

### 6. Identification Types
- passport
- national_id
- drivers_license
- other

## Error Responses

### Validation Error (400)
```json
{
  "data": null,
  "status": 400,
  "message": "Validation error message"
}
```

### Not Found (404)
```json
{
  "data": null,
  "status": 404,
  "message": "Shareholder not found"
}
```

### Duplicate Email (409)
```json
{
  "data": null,
  "status": 409,
  "message": "Email already registered as shareholder"
}
```

### Server Error (500)
```json
{
  "data": null,
  "status": 500,
  "message": "Error message with details"
}
```

## Database Setup

To create the shareholders table, uncomment these lines in `src/index.ts`:
```typescript
// import Shareholder from "./models/Shareholder";
// await Shareholder.sync({ alter: true });
```

## Example Usage

### Create a new shareholder with minimum shares
```bash
curl -X POST http://localhost:4001/shareholders \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "surname": "Johnson",
    "email": "alice@example.com",
    "phone": "+1555000111",
    "address": "456 Park Ave, New York",
    "share_amount": 100,
    "identification_type": "drivers_license",
    "identification_number": "DL987654",
    "nationality": "USA",
    "date_of_birth": "1985-05-20"
  }'
```

### Update payment status to completed
```bash
curl -X PUT http://localhost:4001/shareholders/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "payment_status": "completed",
    "agreement_signed": true
  }'
```

### Get all shareholders with pagination
```bash
curl "http://localhost:4001/shareholders?page=1&limit=20"
```
