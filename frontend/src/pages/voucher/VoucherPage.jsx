import { useState, useEffect } from "react";
import PublicHeader from "../../components/common/PublicHeader";
import "./VoucherPage.css";
import { getVouchers, purchaseVoucher } from "../../services/OrderService";
import { useAuth } from "../../contexts/AuthContext";

export const VoucherPage = () => {
  const { user } = useAuth();
  const [myVouchers, setMyVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // const data = await getVouchers()
        const data = await getVouchers(user?.id);
        if (data.success) {
          // Map voucherTypes to availableVouchers
          setTokenBalance(data.userBalance);

          const available = data.voucherTypes.map((voucher) => ({
            id: voucher.id,
            name: voucher.name,
            description: voucher.description,
            tokenCost: voucher.token_cost,
            discountPercent: voucher.discount_percent,
          }));

          // userVouchers already has the right structure
          const myVouchersData = data.userVouchers.map((uv) => ({
            id: uv.id,
            code: uv.code,
            discount: uv.VoucherType?.discount_percent || 0,
            typeName: uv.VoucherType?.name || "Unknown",
            status: uv.status,
            expiresAt: uv.expiration_at,
          }));

          setAvailableVouchers(available);
          setMyVouchers(myVouchersData);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "used":
        return "used";
      case "expired":
        return "expired";
      default:
        return "unused";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "used":
        return "Đã dùng";
      case "expired":
        return "Hết hạn";
      case "unused":
        return "Chưa dùng";
      default:
        return status;
    }
  };

  const localPurchaseVoucher = async (userID, voucherID) => {
    try {
      setLoading(true);
      const res = await purchaseVoucher(userID, voucherID);
      console.log(res)
      if (res.success) {
        const newData = await getVouchers(user?.id);
        const newMyVouchersData = newData.userVouchers.map((uv) => ({
          id: uv.id,
          code: uv.code,
          discount: uv.VoucherType?.discount_percent || 0,
          typeName: uv.VoucherType?.name || "Unknown",
          status: uv.status,
          expiresAt: uv.expiration_at,
        }));
        setMyVouchers(newMyVouchersData);
      } else {
        alert("Giao dịch thất bại");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PublicHeader />
      {loading && <div className="loading-overlay"><div className="spinner"></div></div>}
      <div className="voucher-page">
        <div className="voucher-container">
          <div className="voucher-header">
            <div className="token-circle">
              <span className="token-amount">{tokenBalance}</span>
            </div>
            <h1>Voucher của tôi</h1>
            <p>Theo dõi và quản lý voucher</p>
          </div>

          {/* My Vouchers Section */}
          <div className="voucher-section">
            <div className="section-header">
              <h2>Voucher của bạn</h2>
              <p className="section-subtitle">Các voucher bạn sở hữu</p>
            </div>

            {myVouchers.length === 0 ? (
              <div className="no-vouchers">
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m-4 3.5V7m4 6.5v2m0 0h2m-2 0h-2m4-11h2m-2 0h-2M9 9h2m-2 0H7m4 0h2m-2 0h-2m0 6h2m-2 0h-2"
                  />
                </svg>
                <h3>Chưa có voucher nào</h3>
                <p>Bạn chưa sở hữu voucher nào. Hãy mua voucher bên dưới!</p>
              </div>
            ) : (
              <div className="vouchers-grid">
                {myVouchers.map((voucher) => (
                  <div key={voucher.id} className="voucher-card my-voucher">
                    <div
                      className={`voucher-badge ${getStatusBadgeClass(
                        voucher.status
                      )}`}
                    >
                      {getStatusLabel(voucher.status)}
                    </div>
                    <div className="voucher-content">
                      <h3>{voucher.code}</h3>
                      <p className="voucher-discount">
                        {voucher.discount}% OFF
                      </p>
                      <p className="voucher-type">{voucher.typeName}</p>
                      {voucher.expiresAt && (
                        <p className="voucher-expires">
                          Hết hạn:{" "}
                          {new Date(voucher.expiresAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Vouchers Section */}
          <div className="voucher-section">
            <div className="section-header">
              <h2>Voucher có sẵn</h2>
              <p className="section-subtitle">Mua voucher để nhận ưu đãi</p>
            </div>

            {availableVouchers.length === 0 ? (
              <div className="no-vouchers">
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3>Không có voucher nào</h3>
                <p>Hiện không có voucher nào có sẵn.</p>
              </div>
            ) : (
              <div className="vouchers-grid">
                {availableVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="voucher-card available-voucher"
                  >
                    <div className="voucher-header-section">
                      <h3>{voucher.name}</h3>
                      <span className="token-cost">
                        {voucher.tokenCost} tokens
                      </span>
                    </div>
                    <div className="voucher-content">
                      <p className="voucher-discount">
                        {voucher.discountPercent}% OFF
                      </p>
                      <p className="voucher-description">
                        {voucher.description}
                      </p>
                      <button
                        onClick={() => {
                          localPurchaseVoucher(user?.id, voucher.id);
                        }}
                        className="purchase-btn"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mockData = {
  success: true,
  voucherTypes: [
    {
      id: 1,
      name: "5% Off",
      description: "Get a 5% discount on your next order.",
      token_cost: 20,
      discount_percent: 5,
      created_at: "2025-12-09T02:00:58.000Z",
      updated_at: "2025-12-09T02:00:58.000Z",
    },
    {
      id: 2,
      name: "10% Off",
      description: "Enjoy a 10% discount on any purchase.",
      token_cost: 40,
      discount_percent: 10,
      created_at: "2025-12-09T02:00:58.000Z",
      updated_at: "2025-12-09T02:00:58.000Z",
    },
    {
      id: 3,
      name: "15% Off",
      description: "Save 15% on selected items.",
      token_cost: 60,
      discount_percent: 15,
      created_at: "2025-12-09T02:00:58.000Z",
      updated_at: "2025-12-09T02:00:58.000Z",
    },
    {
      id: 4,
      name: "20% Off",
      description: "Get a 20% discount on your order.",
      token_cost: 100,
      discount_percent: 20,
      created_at: "2025-12-09T02:00:58.000Z",
      updated_at: "2025-12-09T02:00:58.000Z",
    },
    {
      id: 5,
      name: "Free Shipping",
      description: "Covers shipping cost up to 30,000 VND.",
      token_cost: 25,
      discount_percent: 100,
      created_at: "2025-12-09T02:00:58.000Z",
      updated_at: "2025-12-09T02:00:58.000Z",
    },
  ],
  userVouchers: [],
};
