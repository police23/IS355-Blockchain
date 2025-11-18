# IS355 Book Store – Smart Contracts

This folder contains the on-chain logic for the crypto escrow payment flow.

## 1. BookStoreEscrow.sol

Main responsibilities:

- Hold customer funds in escrow per `orderId` (native coin, e.g. ETH).
- Expose `createEscrow(orderId)` for customers to pay.
- Expose `releaseEscrow(orderId)` for backend/admin to confirm and pay the merchant.
- Expose `refundEscrow(orderId)` for backend/admin or buyer (after timeout) to refund.
- Track aggregate stats:
  - `activeEscrowCount`
  - `totalAmountInEscrow`
  - `getActiveOrderIds()`
- Emit detailed events so the backend can:
  - listen to `EscrowCreated`, `EscrowReleased`, `EscrowRefunded`
  - store them in SQL and render a list of crypto interactions.
- Maintain an on-chain `Payment[]` log (`PaymentRecorded` event) as an anti-fraud audit trail.

### Order ID mapping

`orderId` is a `bytes32`. From your backend you can derive it from your own string/number ID, for example:

```js
// JavaScript (ethers.js v6)
import { keccak256, toUtf8Bytes } from "ethers";

const onchainOrderId = keccak256(toUtf8Bytes(String(orderId)));
```

Use the same mapping everywhere (backend + frontend) to keep the relation between
off-chain SQL orders and on-chain escrows.

### Timeout

Each escrow has a 7-day timeout (`ESCROW_TIMEOUT = 7 days`):

- Before timeout: only `owner` (backend/admin wallet) can call `refundEscrow`.
- After timeout: `owner` **or** `buyer` can call `refundEscrow`, which refunds the buyer.

This matches the requirement of having an on-chain timeout to protect users.
