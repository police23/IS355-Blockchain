import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBox, faHistory } from "@fortawesome/free-solid-svg-icons";
import "../modals/Modals.css";
import "./CryptoOrderDetailsModal.css"
import { formatTimeAgo } from "../../utils/formatTimeAgo";

// Mock events data - in real scenario this would come from props
const mockRecentEvents = [
  {
    id: "EV001",
    action: "created",
    customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2025-11-16T10:30:00Z",
  },
  {
    id: "EV002",
    action: "deposited",
    customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2025-11-16T11:30:00Z",
  },
  {
    id: "EV003",
    action: "created",
    customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2025-11-16T10:30:00Z",
  },
  {
    id: "EV004",
    action: "deposited",
    customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2025-11-16T11:30:00Z",
  },
];

const CryptoOrderDetailsModal = ({ orderID, onClose }) => {
  const [recentEvents, setRecentEvents] = useState(mockRecentEvents);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  

  if (!orderID) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const options = { hour: '2-digit', minute: '2-digit' };
    const date = d.toLocaleDateString("vi-VN");
    const time = d.toLocaleTimeString("vi-VN", options);
    return `${time} ${date}`;
  };

  // formatCurrency removed because details header was removed

  const modalContent = (
    <div className="modal" onClick={onClose}>
      <div className="modal-backdrop">
        <div className="modal-content book-details-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <FontAwesomeIcon icon={faBox} className="book-details-header-icon" />
              Thông tin chi tiết đơn hàng
            </h3>
            <button className="close-button" onClick={onClose} aria-label="Đóng">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="crypto-details-modal-body">
            {/* Details header removed (user requested to remove red boxed area) */}

            {/* Recent Interactions Table */}
            <div style={{ width: "100%", marginTop: 8, marginBottom: 16, paddingTop: 8, borderTop: "1px solid #eee" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FontAwesomeIcon icon={faHistory} /> Sự kiện gần đây
              </h4>
              <div className="recent-events-wrapper">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "55%" }} />
                    <col style={{ width: "25%" }} />
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 600 }}>Tương tác</th>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 600 }}>Địa chỉ</th>
                      <th style={{ padding: "8px", textAlign: "left", fontWeight: 600 }}>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.slice()
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((event) => (
                        <tr key={event.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "8px" }}>
                            <span className={"status-badge status-" + event.action.toString()}>
                              {event.action.charAt(0).toUpperCase() + event.action.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: "8px", fontSize: "12px", fontFamily: "monospace", color: "#666" }}>
                            {event.customerAddress}
                          </td>
                          <td style={{ padding: "8px", fontSize: "12px", color: "#999" }}>
                            {formatDate(event.timestamp)}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{display: "flex", width: "100%", flexDirection: "row", gap: "8px", justifyContent: "flex-end"}}>
              <button className="crypto-details-modal-btn cancel" onClick={onClose}>Huỷ đơn hàng</button>
              <button className="crypto-details-modal-btn confirm">Xác nhận đơn hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(modalContent, document.body);
};

export default CryptoOrderDetailsModal;


/** Simple mock order data used as fallback / for dev preview */
const getMockOrder = (id) => ({
  id: id ?? "MOCK-001",
  customer: "Nguyễn Văn A",
  amount: (120000).toLocaleString("vi-VN") + " ₫",
  ethAmount: "0.035 ETH",
  status: "Pending",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
});