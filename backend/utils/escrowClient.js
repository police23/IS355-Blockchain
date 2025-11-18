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
    "inputs": [
      { "internalType": "bytes32", "name": "orderId", "type": "bytes32" }
    ],
    "name": "createEscrow",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "orderId", "type": "bytes32" }
    ],
    "name": "releaseEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "orderId", "type": "bytes32" }
    ],
    "name": "refundEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "orderId", "type": "bytes32" }
    ],
    "name": "isActive",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const {
  ESCROW_RPC_URL,
  ESCROW_PRIVATE_KEY,
  ESCROW_CONTRACT_ADDRESS,
} = process.env;

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
    console.log("[escrowClient] Escrow contract initialised at", ESCROW_CONTRACT_ADDRESS);
  } else {
    console.warn("[escrowClient] ESCROW_* env vars missing. Escrow integration disabled.");
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
    throw new Error("Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)");
  }
  const orderIdBytes32 = getEscrowOrderIdBytes32(offchainId);
  const active = await escrowContract.isActive(orderIdBytes32);
  return active;
}

async function refundEscrowOnChain(offchainId) {
  if (!escrowContract) {
    throw new Error("Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)");
  }
  const orderIdBytes32 = getEscrowOrderIdBytes32(offchainId);
  console.log("[escrowClient] refundEscrow cho offchainId =", offchainId, "bytes32 =", orderIdBytes32);

  const tx = await escrowContract.refundEscrow(orderIdBytes32);
  const receipt = await tx.wait();

  if (!receipt.status) {
    throw new Error("Refund escrow transaction failed");
  }
  console.log("[escrowClient] Refund thành công, txHash =", receipt.hash);
  return receipt.hash;
}

async function releaseEscrowOnChain(offchainId) {
  if (!escrowContract) {
    throw new Error("Escrow contract chưa được cấu hình (thiếu ENV hoặc lỗi khởi tạo)");
  }
  const orderIdBytes32 = getEscrowOrderIdBytes32(offchainId);
  console.log("[escrowClient] releaseEscrow cho offchainId =", offchainId, "bytes32 =", orderIdBytes32);

  const tx = await escrowContract.releaseEscrow(orderIdBytes32);
  const receipt = await tx.wait();

  if (!receipt.status) {
    throw new Error("Release escrow transaction failed");
  }
  console.log("[escrowClient] Release thành công, txHash =", receipt.hash);
  return receipt.hash;
}

module.exports = {
  escrowContract,
  getEscrowOrderIdBytes32,
  refundEscrowOnChain,
  releaseEscrowOnChain,
  hasActiveEscrow,
};
