import { useEffect, useState } from "react";
import "./CryptoOrdersTable.css";
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
import CryptoOrderDetailsModal from "../modals/CryptoOrderDetailsModal";
import { formatTimeAgo } from "../../utils/formatTimeAgo";


// Constants
const DEFAULT_PAGE_SIZE = 10;

export const CryptoOrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [total, setTotal] = useState(0);

    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const [orderDetailsId, setOrderDetailsId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        fetchCryptoOrders()
    }, [currentPage, pageSize]);

    const fetchCryptoOrders = async () => {
        setLoading(true);
        try {
            // let response = { data: { transactions: [], total: 0 } };
            let response = mockBlockchainData

            // Check if the filtered data is valid
            if (!Array.isArray(response.items)) {
                console.error('Crypto transaction data is not an array:', response.items);
                setOrders([]);
                setTotal(0);
                setLoading(false);
                return;
            }

            // Update state with filtered data
            setOrders(response.items);
            setTotal(response.items.length);
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
                orders.find(o => o.id === id && o.status === "pending")
            );

            console.log('pendingOrderIds gửi lên xác nhận:', pendingOrderIds);
            const res = await confirmOrder(pendingOrderIds);
            console.log('Kết quả confirmOrder:', res);
            setNotification({ message: "Xác nhận đơn hàng thành công", type: "success" });
            fetchCryptoOrders();
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
    const currentRecords = orders; // Đã được phân trang từ server

    // Tính toán lại canConfirm dựa trên selectedRows và orders
    const canConfirm = selectedRows.some(id => {
        const order = orders.find(o => o.id === id);
        return order && order.status === 'pending';
    });

    // Đảm bảo canConfirm luôn được khai báo trước return
    return (
    <>
        <div className="crypto-table-container">
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
                        <th>Khách hàng</th>
                        <th>Đơn giá</th>
                        <th>Thời gian khởi tạo</th>
                        <th>Trạng thái</th>
                        <th>Cập nhật</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.length === 0 ? (
                        <tr><td colSpan={7} className="order-table-empty">Không có dữ liệu</td></tr>
                    ) : (
                        currentRecords.flatMap(order =>
                            <tr
                                key={order.id}
                                className={selectedRows.includes(order.id) ? "selected" : ""}
                                onClick={() => {
                                    setOrderDetailsId(orderDetailsId === order.id ? null : order.id)
                                    setShowOrderDetails(true)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(order.id)}
                                        onChange={e => {
                                            e.stopPropagation();
                                            setSelectedRows(prev =>
                                            e.target.checked
                                                ? [...prev, order.id]
                                                : prev.filter(id => id !== order.id)
                                            );
                                        }}
                                        onClick={e => e.stopPropagation()}
                                        aria-label={`Chọn transaction #${order.id}`}
                                    />
                                </td>
                                <td>{order.id || ''}</td>
                                <td>{order.customer}</td>
                                <td>{formatCurrency(order.amount)}</td>
                                <td>{formatDate(order.createdAt.toString())}</td>
                                <td>
                                    <span className={"status-badge status-" + order.status.toString()}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td>{formatTimeAgo(order.updatedAt.toString())}</td>
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
        {showOrderDetails && (
            <CryptoOrderDetailsModal
                orderID={orderDetailsId}
                onClose={() => setShowOrderDetails(false)}
            />
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
            message={`Bạn có chắc chắn muốn xác nhận ${orders.filter(o => selectedRows.includes(o.id) && o.status === 'pending').length} đơn hàng đã chọn?`}
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
            id: "ORDER001",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "deposited",
            updatedAt: "2025-11-16T10:30:00Z",
        },
        {
            id: "ORDER002",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "released",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX003",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "cancelled",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX004",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "deposited",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX005",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "released",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX006",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "cancelled",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX007",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "deposited",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX008",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "released",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX009",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "cancelled",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX010",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "created",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX011",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "created",
            updatedAt: "2025-11-16T11:30:00Z",
        },
        {
            id: "TX012",
            customer: "Bob",
            amount: 20000000,
            createdAt: "2025-11-16T10:30:00Z",
            status: "created",
            updatedAt: "2025-11-16T11:30:00Z",
        },
    ]
}