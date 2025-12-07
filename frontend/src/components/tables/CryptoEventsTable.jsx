import { useEffect, useState } from "react";
import "./CryptoEventsTable.css";
import {
  getAllProcessingOrders,
  getAllConfirmedOrders,
  getAllDeliveredOrders,
  getAllDeliveringOrders,
  confirmOrder,
  assignOrderToShipper,
    getContractEvents,
} from "../../services/OrderService";
import ConfirmationModal from "../modals/ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCircleCheck, faCircleExclamation, faCirclePlus, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";


const cryptoActiveTabs = [
    {
        key: "all",
        label: "Tất cả",
        icon: <FontAwesomeIcon icon={faCircleExclamation}/>,
    },
    {
        key: "created",
        label: "Create",
        icon: <FontAwesomeIcon icon={faCirclePlus}/>,
    },
    {
        key: "deposited",
        label: "Deposit",
        icon: <FontAwesomeIcon icon={faMoneyBillTransfer}/>,
    },
    {
        key: "released",
        label: "Release",
        icon: <FontAwesomeIcon icon={faCircleCheck}/>,
    },
    {
        key: "cancelled",
        label: "Cancel",
        icon: <FontAwesomeIcon icon={faBan} />,
    },
]

// Constants
const DEFAULT_PAGE_SIZE = 10;

export const CryptoEventsTable = ({ type = "deposited", isShipper = false }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [total, setTotal] = useState(0);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [activeTab, setActiveTab] = useState("all")

    // Auto close notification after 5s
    useEffect(() => {
        if (notification.message) {
        const timer = setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [notification.message]);

    useEffect(() => {
        if(type !== "orders") fetchTransactions();
        else fetchCryptoOrders()
    }, [type, isShipper, currentPage, pageSize, activeTab]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Map UI tab keys to contract event names in DB
            const tabEventMap = {
                created: 'EscrowCreated',
                deposited: 'PaymentRecorded',
                released: 'EscrowReleased',
                cancelled: 'EscrowRefunded'
            };

            const eventType = activeTab === 'all' ? undefined : tabEventMap[activeTab] || activeTab;

            const res = await getContractEvents(currentPage, pageSize, eventType);

            const items = Array.isArray(res.items) ? res.items : [];

            // Normalize items for frontend usage
            const normalized = items.map(it => {
                let payload = {};
                try { payload = typeof it.payload === 'string' ? JSON.parse(it.payload) : it.payload || {}; } catch (e) { payload = {}; }

                // map event names to the CSS badge keys used in CryptoEventsTable.css
                const eventToKey = {
                    EscrowCreated: 'create',
                    PaymentRecorded: 'deposit',
                    EscrowFunded: 'deposit',
                    EscrowReleased: 'release',
                    EscrowRefunded: 'cancel',
                    PaymentReleased: 'release',
                };

                const displayMap = {
                    create: 'Create',
                    deposit: 'Deposit',
                    release: 'Release',
                    cancel: 'Cancel',
                };

                const rawAction = it.event_name || '';
                const actionKey = eventToKey[rawAction] || 'default';
                const actionLabel = displayMap[actionKey] || rawAction;

                return {
                    id: it.id || it.transaction_hash || '',
                    transactionHash: it.transaction_hash,
                    action: rawAction,
                    actionKey,
                    actionLabel,
                    orderId: it.order_id,
                    customerAddress: payload.payer || payload.sender || payload.buyer || it.order_buyer_wallet || '',
                    ethAmount: payload.amount || null,
                    vndAmount: it.order_final_amount || 0,
                    timestamp: it.created_at || it.timestamp,
                    // Pre-format time/date so rendering is simple and consistent
                    formattedTime: (() => {
                        try {
                            const d = new Date(it.created_at || it.timestamp);
                            return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                        } catch (e) { return '' }
                    })(),
                    formattedDate: (() => {
                        try {
                            const d = new Date(it.created_at || it.timestamp);
                            return d.toLocaleDateString('vi-VN');
                        } catch (e) { return '' }
                    })(),
                    raw: it,
                };
            });

            setTransactions(normalized);
            setTotal(res.total || normalized.length);
        } catch (error) {
            setNotification({ message: "Lỗi khi tải crypto transactions", type: "error" });
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => setShowConfirmModal(true);

    const handleConfirmModal = async () => {
        try {
            // Gọi API xác nhận
            const pendingOrderIds = selectedRows.filter(id =>
                transactions.find(o => o.id === id && o.status === "pending")
            );

            console.log('pendingOrderIds gửi lên xác nhận:', pendingOrderIds);
            const res = await confirmOrder(pendingOrderIds);
            console.log('Kết quả confirmOrder:', res);
            setNotification({ message: "Xác nhận đơn hàng thành công", type: "success" });
            fetchTransactions();
            setSelectedRows([]);
        } catch (error) {
            setNotification({ message: `Xác nhận đơn hàng thất bại: ${error?.message || error}`, type: "error" });
            console.error('Lỗi xác nhận đơn hàng:', error);
        } finally {
            setShowConfirmModal(false);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const options = { hour: '2-digit', minute: '2-digit' };
        const date = d.toLocaleDateString("vi-VN");
        const time = d.toLocaleTimeString("vi-VN", options);
        return `${time} ${date}`;
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0₫";
    };

    const formatVndNoSymbol = (amount) => {
        if (amount === null || amount === undefined || amount === "") return "0";
        const n = Number(amount);
        if (!Number.isFinite(n)) return "-";
        return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
    };

    const formatEthAmount = (amount) => {
        if (amount === null || amount === undefined || amount === "") return "-";
        // amount may be string or number; try parseFloat
        const n = parseFloat(String(amount));
        if (!Number.isFinite(n)) return "-";
        return n.toFixed(6);
    };


    const totalPages = Math.ceil(total / pageSize);

    // Pagination helpers - Sử dụng server-side pagination
    const indexOfLastRecord = currentPage * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    const currentRecords = transactions; // Đã được phân trang từ server

    // Tính toán lại canConfirm dựa trên selectedRows và orders
    const canConfirm = selectedRows.some(id => {
        const order = transactions.find(o => o.id === id);
        return order && order.status === 'pending';
    });

    // Đảm bảo canConfirm luôn được khai báo trước return
    return (
    <>
        <div className="crypto-table-container">
            {/* Các tab chia các event */}
            <div className="order-tabs">
            {cryptoActiveTabs.map(tab => (
                <button
                    key={tab.key}
                    className={`order-tab-btn${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
            </div>

            <table className="crypto-table">
                <thead>
                    <tr>
                
                        <th>Mã đơn</th>
                        <th>Địa chỉ gửi transaction</th>
                        <th>Lượng (ETH)</th>
                        <th>Lượng (VNĐ)</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.length === 0 ? (
                        <tr><td colSpan={7} className="order-table-empty">Không có dữ liệu</td></tr>
                    ) : (
                        currentRecords.flatMap(transaction =>
                            <tr
                                key={transaction.id}
                                className={selectedRows.includes(transaction.id) ? "selected" : ""}
                                onClick={() => setExpandedRowId(expandedRowId === transaction.id ? null : transaction.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                
                                <td>{transaction.orderId || ''}</td>
                                <td>{transaction.customerAddress}</td>
                                <td>{formatEthAmount(transaction.ethAmount)}</td>
                                <td>{formatVndNoSymbol(transaction.vndAmount)}</td>
                                <td>
                                    <div className="time-top">{transaction.formattedTime}</div>
                                    <div className="date-bottom">{transaction.formattedDate}</div>
                                </td>
                                <td>
                                    <span className={"status-badge status-" + (transaction.actionKey || 'default')}>
                                        {transaction.actionLabel}
                                    </span>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
        {/* Pagination */}
        {total > 0 && (
            <div className="pagination">
                <div className="pagination-info">
                    Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, total)} của {total} đơn hàng
                </div>
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        &lt;
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="pagination-button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        )}
        {/* Notification */}
        {notification.message && (
            <div className={`notification ${notification.type === "error" ? "error" : ""}`} style={{ marginTop: 16 }}>
                <span className="notification-message">{notification.message}</span>
            </div>
        )}
        {/* Confirmation Modal for confirming orders */}
        <ConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmModal}
            title="Xác nhận đơn hàng"
            message={`Bạn có chắc chắn muốn xác nhận ${transactions.filter(o => selectedRows.includes(o.id) && o.status === 'pending').length} đơn hàng đã chọn?`}
        />
    </>
  );
};


