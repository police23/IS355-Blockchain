import axios from 'axios';
import { API_BASE_URL } from '../config';

const ORDER_API_URL = `${API_BASE_URL}/orders`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};


export const getOrderById = async (orderId) => {
  const response = await axios.get(`${ORDER_API_URL}/${orderId}`, { headers: getAuthHeader() });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axios.patch(`${ORDER_API_URL}/${orderId}/cancel`, {}, { headers: getAuthHeader() });
  return response.data;
};

export const getOrderStatus = async (orderId) => {
  const response = await axios.get(`${ORDER_API_URL}/${orderId}/status`, { headers: getAuthHeader() });
  return response.data;
};


export const getProcessingOrdersByUserID = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/processing?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};

export const getCancelledOrders = async () => {
  const response = await axios.get(`${ORDER_API_URL}/cancelled`, { headers: getAuthHeader() });
  return response.data;
};


export const getAllProcessingOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/processing/all?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllConfirmedOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/confirmed/all?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllDeliveringOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/delivering/all?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllDeliveredOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/delivered/all?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllCancelledOrders = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/cancelled/all?page=${page}&pageSize=${pageSize}`, {
    headers: getAuthHeader()
  });
  return response.data;
};


export const getConfirmedOrdersByUserID = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/confirmed?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};

export const getDeliveringOrdersByUserID = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/delivering?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};

export const getDeliveredOrdersByUserID = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/delivered?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};

export const getCancelledOrdersByUserID = async (page = 1, pageSize = 10) => {
  const response = await axios.get(`${ORDER_API_URL}/cancelled?page=${page}&pageSize=${pageSize}`, { headers: getAuthHeader() });
  return response.data;
};

export const confirmOrder = async (orderId) => {
  const response = await axios.patch(`${ORDER_API_URL}/${orderId}/confirm`, {}, { headers: getAuthHeader() });
  return response.data;
};


export const completeOrder = async (orderId) => {
  const response = await axios.patch(`${ORDER_API_URL}/${orderId}/complete`, {}, { headers: getAuthHeader() });
  return response.data;
};

export const assignOrderToShipper = async (orderId, shipper_id) => {
  const response = await axios.post(
    `${ORDER_API_URL}/${orderId}/assign-shipper`,
    { shipper_id },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getDeliveringOrdersByShipperID = async () => {
  const response = await axios.get(`${ORDER_API_URL}/delivering/shipper`, { headers: getAuthHeader() });
  return response.data;
};


export const getOrderAssignment = async (orderId) => {
  const response = await axios.get(
    `${ORDER_API_URL}/${orderId}/assignment`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const unassignOrder = async (orderId) => {
  const response = await axios.delete(
    `${ORDER_API_URL}/${orderId}/unassign-shipper`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getDeliveredOrdersByShipperID = async () => {
  const response = await axios.get(`${ORDER_API_URL}/delivered/shipper`, { headers: getAuthHeader() });
  return response.data;
};

export const getReceiptPDFByOrderID = async (orderID) => {
  const response = await axios.get(`${ORDER_API_URL}/${orderID}/receipt`, { 
    headers: getAuthHeader(),
    responseType: 'blob'  // Expect blob/PDF response
  })
  return response.data
}

export const getContractEvents = async (page = 1, pageSize = 10, type) => {
  const typeParam = type ? `&type=${encodeURIComponent(type)}` : "";
  const response = await axios.get(`${API_BASE_URL}/contract-events?page=${page}&pageSize=${pageSize}${typeParam}`, { headers: getAuthHeader() });
  return response.data;
};

export const getOrderEvents = async (orderId) => {
  const response = await axios.get(`${ORDER_API_URL}/${orderId}/events`, { headers: getAuthHeader() });
  return response.data;
};

export const getVouchers = async () => {
  // điền lại endpoint URL
  const response = await axios.get(`${API_BASE_URL}/voucher`, { headers: getAuthHeader() })
  return response.data
}

export const purchaseVoucher = async (userID, voucherID) => {
  // điền lại endpoint URL
  const response = await axios.get(`${API_BASE_URL}/ew`, 
    { userID, voucherID },
    { headers: getAuthHeader() }
  )
  return response.data
}