const { ethers } = require("ethers");

/**
 * Escrow client: gọi BookStoreEscrow từ backend.
 *
 * - offchainId: chính là order.id (số trong database)
 * - bytes32 orderId on-chain = keccak256( toUtf8Bytes( String(order.id) ) )
 */

// ABI tối thiểu cho các hàm backend sử dụng
const ESCROW_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_merchantWallet",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    name: "EscrowCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fundedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeoutAt",
        type: "uint256",
      },
    ],
    name: "EscrowFunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "refundedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "refundedAt",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "timeout",
        type: "bool",
      },
    ],
    name: "EscrowRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "releasedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "releasedAt",
        type: "uint256",
      },
    ],
    name: "EscrowReleased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "orderKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum BookStoreEscrow.PaymentStatus",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "PaymentRecorded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "ESCROW_TIMEOUT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activeEscrowCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "depositEscrow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveOrderIds",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "getEscrow",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum BookStoreEscrow.EscrowStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct BookStoreEscrow.EscrowInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "getOrderPaymentIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
    ],
    name: "getPayment",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "orderId",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "enum BookStoreEscrow.PaymentStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        internalType: "struct BookStoreEscrow.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPaymentsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "isActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merchantWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "refundEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "orderId",
        type: "string",
      },
    ],
    name: "releaseEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAmountInEscrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const { ESCROW_RPC_URL, ESCROW_PRIVATE_KEY, ESCROW_CONTRACT_ADDRESS } =
  process.env;

let provider = null;
let wallet = null;
let escrowContract = null;

try {
  if (ESCROW_RPC_URL && ESCROW_PRIVATE_KEY && ESCROW_CONTRACT_ADDRESS) {
    provider = new ethers.JsonRpcProvider(ESCROW_RPC_URL);
    wallet = new ethers.Wallet(ESCROW_PRIVATE_KEY, provider);
    escrowContract = new ethers.Contract(
      ESCROW_CONTRACT_ADDRESS,
      ESCROW_ABI,
      wallet
    );
    console.log(
      "[escrowClient] Escrow contract initialised at",
      ESCROW_CONTRACT_ADDRESS
    );
  } else {
    console.warn(
      "[escrowClient] ESCROW_* env vars missing. Escrow integration disabled."
    );
  }
} catch (err) {
  console.error("[escrowClient] Failed to initialise escrow contract:", err);
  escrowContract = null;
}

function getEscrowOrderIdBytes32(offchainId) {
  if (offchainId === undefined || offchainId === null) {
    throw new Error("offchainId không hợp lệ để hash");
  }
  const text = String(offchainId);
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

async function hasActiveEscrow(offchainId) {
  if (!escrowContract) {
    throw new Error(
      "Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)"
    );
  }
  const active = await escrowContract.isActive(offchainId);
  return active;
}

async function refundEscrowOnChain(offchainId) {
  if (!escrowContract) {
    throw new Error(
      "Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)"
    );
  }
  // const orderIdBytes32 = getEscrowOrderIdBytes32(offchainId);
  console.log(
    "[escrowClient] refundEscrow cho offchainId =",
    offchainId,
    "bytes32 =",
    orderIdBytes32
  );

  const tx = await escrowContract.refundEscrow(offchainId);
  const receipt = await tx.wait();

  if (!receipt.status) {
    throw new Error("Refund escrow transaction failed");
  }
  console.log("[escrowClient] Refund thành công, txHash =", receipt.hash);
  return receipt.hash;
}

async function releaseEscrowOnChain(offchainId) {
  if (!escrowContract) {
    throw new Error(
      "Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)"
    );
  }
  // const orderIdBytes32 = getEscrowOrderIdBytes32(offchainId);
  console.log(
    "[escrowClient] releaseEscrow cho offchainId =",
    offchainId,
    "bytes32 =",
    orderIdBytes32
  );

  const tx = await escrowContract.releaseEscrow(offchainId);
  const receipt = await tx.wait();

  if (!receipt.status) {
    throw new Error("Release escrow transaction failed");
  }
  console.log("[escrowClient] Release thành công, txHash =", receipt.hash);
  return receipt.hash;
}

module.exports = {
  escrowContract,
  ESCROW_ABI,
  getEscrowOrderIdBytes32,
  refundEscrowOnChain,
  releaseEscrowOnChain,
  hasActiveEscrow,
};
