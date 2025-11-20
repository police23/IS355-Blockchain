import { useEffect, useState } from "react";
import "./CryptoEventsTable.css";
import {
  getAllProcessingOrders,
  getAllConfirmedOrders,
  getAllDeliveredOrders,
  getAllDeliveringOrders,
  confirmOrder,
  assignOrderToShipper,
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
        label: "Hủy",
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
            // let response = { data: { transactions: [], total: 0 } };
            let response = mockBlockchainData
            
            // Filter transactions based on the `type`
            let filteredItems = [];
            if (activeTab === "all") filteredItems = response.items;
                // response = await getAllCryptoTransactions(currentPage, pageSize);
            else if (activeTab === "deposited") 
                filteredItems = response.items.filter(tx => tx.action === "deposit");
                // response = await getDepositedCryptoTransactions(currentPage, pageSize);
            else if (activeTab === "released") 
                filteredItems = response.items.filter(tx => tx.action === "release");
                // response = await getReleasedCryptoTransactions(currentPage, pageSize);
            else if (activeTab === "cancelled") 
                filteredItems = response.items.filter(tx => tx.action === "cancel");
                // response = await getCancelledCryptoTransactions(currentPage, pageSize);
            else if (activeTab === "created") 
                filteredItems = response.items.filter(tx => tx.action === "create");
                // response = await getCreatedCryptoTransactions(currentPage, pageSize);

            console.log('Filtered transactions:', filteredItems);

            // Check if the filtered data is valid
            if (!Array.isArray(filteredItems)) {
                console.error('Crypto transaction data is not an array:', filteredItems);
                setTransactions([]);
                setTotal(0);
                setLoading(false);
                return;
            }

            // Update state with filtered data
            setTransactions(filteredItems);
            setTotal(filteredItems.length);
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
                        <th>
                            <input
                                type="checkbox"
                                checked={currentRecords.length > 0 && currentRecords.every(order => selectedRows.includes(order.id))}
                                onChange={e => {
                                    if (e.target.checked) {
                                    // Add all current page orders to selectedRows
                                    setSelectedRows(prev => ([...new Set([...prev, ...currentRecords.map(o => o.id)])]));
                                    } else {
                                    // Remove all current page orders from selectedRows
                                    setSelectedRows(prev => prev.filter(id => !currentRecords.some(o => o.id === id)));
                                    }
                                }}
                                aria-label="Chọn tất cả"
                            />
                        </th>
                        <th>Mã đơn</th>
                        <th>Địa chỉ khách</th>
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
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(transaction.id)}
                                        onChange={e => {
                                            e.stopPropagation();
                                            setSelectedRows(prev =>
                                            e.target.checked
                                                ? [...prev, transaction.id]
                                                : prev.filter(id => id !== transaction.id)
                                            );
                                        }}
                                        onClick={e => e.stopPropagation()}
                                        aria-label={`Chọn transaction #${transaction.id}`}
                                    />
                                </td>
                                <td>{transaction.id || ''}</td>
                                <td>{transaction.customerAddress}</td>
                                <td>{transaction.ethAmount}</td>
                                <td>{formatCurrency(transaction.vndAmount)}</td>
                                <td>{formatDate(transaction.timestamp)}</td>
                                <td>
                                    <span className={"status-badge status-" + transaction.action.toString()}>
                                        {transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1)}
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


const mockBlockchainData = {
    page: 1,
    total: 3,
    limit: 10,
    items: [
        {
            id: "TX001",
            customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
            ethAmount: 0.5,
            vndAmount: 20000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "deposit",
        },
        {
            id: "TX002",
            customerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
            ethAmount: 1.2,
            vndAmount: 48000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "release",
        },
        {
            id: "TX003",
            customerAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
            ethAmount: 0.8,
            vndAmount: 32000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "cancel",
        },
        {
            id: "TX004",
            customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
            ethAmount: 0.5,
            vndAmount: 20000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "deposit",
        },
        {
            id: "TX005",
            customerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
            ethAmount: 1.2,
            vndAmount: 48000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "release",
        },
        {
            id: "TX006",
            customerAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
            ethAmount: 0.8,
            vndAmount: 32000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "cancel",
        },
        {
            id: "TX007",
            customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
            ethAmount: 0.5,
            vndAmount: 20000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "deposit",
        },
        {
            id: "TX008",
            customerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
            ethAmount: 1.2,
            vndAmount: 48000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "release",
        },
        {
            id: "TX009",
            customerAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
            ethAmount: 0.8,
            vndAmount: 32000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "cancel",
        },
        {
            id: "TX010",
            customerAddress: "0x1234567890abcdef1234567890abcdef12345678",
            ethAmount: 0.5,
            vndAmount: 20000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "create",
        },
        {
            id: "TX011",
            customerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
            ethAmount: 1.2,
            vndAmount: 48000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "create",
        },
        {
            id: "TX012",
            customerAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
            ethAmount: 0.8,
            vndAmount: 32000000,
            timestamp: "2025-11-16T10:30:00Z",
            action: "create",
        },
    ]
}