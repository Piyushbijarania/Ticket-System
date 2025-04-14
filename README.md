# Aptos Ticket System

A decentralized ticketing system built on the Aptos blockchain. This project allows users to create events, purchase tickets, and manage event data securely using smart contracts.

![WhatsApp Image 2025-04-03 at 23 19 21_bebb63a3](https://github.com/user-attachments/assets/f0df2acb-bc42-4b1f-ba21-b1a735eaa552)

---

## Features
- **Event Creation**: Organizers can create events with details like name, description, date, venue, capacity, and ticket price.
- **Ticket Purchase**: Users can purchase tickets for events using their Aptos wallets.
- **Blockchain Integration**: All data is stored and managed on the Aptos blockchain for transparency and security.

---

## Prerequisites
1. **Aptos CLI**: Install the Aptos CLI for deploying and interacting with the Move module. [Installation Guide](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli/)
2. **Node.js**: Install Node.js (v14 or later) for running the React frontend.
3. **Wallet**: Use a compatible Aptos wallet like [Petra Wallet](https://petra.app/) for interacting with the app.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd replicate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory with the following variables:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x34887e4e34d592107ccfcde1fae45bff974adb498b577f40eaafc673cde385c1
NEXT_PUBLIC_NETWORK=devnet
```

### 4. Deploy Smart Contract
```bash
cd move
aptos move publish --package-dir move --named-addresses aptos_ticket_system=0x34887e4e34d592107ccfcde1fae45bff974adb498b577f40eaafc673cde385c1 --profile devnet
aptos move run-script --script-path scripts/deploy.move --profile devnet
```

### 5. Start the Frontend
```bash
npm start
```

---

## Contract Address
The deployed contract address is: `0x34887e4e34d592107ccfcde1fae45bff974adb498b577f40eaafc673cde385c1`
![WhatsApp Image 2025-04-03 at 23 19 21_bebb63a3](https://github.com/user-attachments/assets/f0df2acb-bc42-4b1f-ba21-b1a735eaa552)


---

## Usage
1. Connect your Aptos wallet (e.g., Petra Wallet)
2. Create an event by providing event details
3. Purchase tickets for events
4. View your purchased tickets

---
