const { ethers } = require("ethers");
const { REWARD_TOKEN_ABI } = require("../config/RewardTokenConfig");

// 1. Setup Provider
const provider = new ethers.JsonRpcProvider(process.env.REWARD_TOKEN_RPC_URL);

// 2. Setup Wallet (Admin/Minter)
// Lưu ý: Ví này phải có quyền MINTER_ROLE trong contract mới gọi được hàm mint/spend
const adminWallet = new ethers.Wallet(
  process.env.REWARD_TOKEN_PRIVATE_KEY,
  provider
);

// 3. Contract Instances
const readContract = new ethers.Contract(
  process.env.REWARD_TOKEN_ADDRESS,
  REWARD_TOKEN_ABI,
  provider
);
const writeContract = new ethers.Contract(
  process.env.REWARD_TOKEN_ADDRESS,
  REWARD_TOKEN_ABI,
  adminWallet
);

class RewardTokenService {
  // Helper: Format từ Wei sang số thường (để hiển thị)
  _toEther(weiAmount) {
    return ethers.formatEther(weiAmount);
  }

  // Helper: Format từ số thường sang Wei (để ghi lên chain)
  _toWei(amount) {
    return ethers.parseEther(String(amount));
  }

  /**
   * Đăng ký ví cho User mới (Gọi hàm registerUser)
   */
  async registerUserOnChain(userId, walletAddress) {
    try {
      console.log(
        `[RewardToken] Registering User ID: ${userId} - Wallet: ${walletAddress}`
      );

      const tx = await writeContract.registerUser(userId, walletAddress);

      console.log(`[RewardToken] Tx Hash (Register): ${tx.hash}`);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[RewardToken] Lỗi registerUser:`, error);
      throw new Error(
        "Lỗi khi đăng ký ví user trên Blockchain: " + error.message
      );
    }
  }

  /**
   * Cộng điểm thưởng cho User (Mint points)
   */
  async rewardPoints(userId, amount, reason = "Purchase Reward") {
    try {
      console.log(
        `[RewardToken] Rewarding ${amount} tokens to User ID: ${userId}`
      );

      // Gọi hàm mintToUser
      const tx = await writeContract.mintToUser(userId, amount, reason);

      console.log(`[RewardToken] Tx Hash (Reward): ${tx.hash}`);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[RewardToken] Lỗi rewardPoints:`, error);
      throw new Error("Lỗi khi cộng điểm thưởng trên Blockchain");
    }
  }

  /**
   * Trừ điểm của User (Burn/Spend points)
   */
  async redeemPoints(userId, amount, reason = "Redeem Voucher") {
    try {
      const tx = await writeContract.spendFromUser(userId, amount, reason);

      console.log(`[RewardToken] Tx Hash (Redeem): ${tx.hash}`);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(`[RewardToken] Lỗi redeemPoints:`, error);
      throw new Error(
        "Lỗi khi trừ điểm thưởng trên Blockchain: " + error.message
      );
    }
  }

  /**
   * Lấy số dư điểm của User (View)
   */
  async getBalance(userId) {
    try {
      const balanceWei = await readContract.getUserBalance(userId);
      return this._toEther(balanceWei);
    } catch (error) {
      console.error(`[RewardToken] Lỗi getBalance:`, error);
      return "0";
    }
  }

  /**
   * Lấy địa chỉ ví đang gắn với User ID (View)
   */
  async getUserWallet(userId) {
    try {
      const wallet = await readContract.getUserWallet(userId);
      if (wallet === ethers.ZeroAddress) return null;
      return wallet;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new RewardTokenService();
