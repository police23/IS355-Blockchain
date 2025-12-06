const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const OrderController = require("../controllers/OrderController");
const ReceiptController = require("../controllers/ReceiptController");
router.get(
  "/processing",
  verifyToken,
  OrderController.getOrdersByStatusAndUser
);
router.get("/confirmed", verifyToken, OrderController.getOrdersByStatusAndUser);
router.get("/delivered", verifyToken, OrderController.getOrdersByStatusAndUser);
router.get(
  "/delivering",
  verifyToken,
  OrderController.getOrdersByStatusAndUser
);
router.get("/cancelled", verifyToken, OrderController.getOrdersByStatusAndUser);
router.get(
  "/delivering/shipper",
  verifyToken,
  OrderController.getOrdersByShipperID
);
router.get(
  "/delivered/shipper",
  verifyToken,
  OrderController.getOrdersByShipperID
);
router.get(
  "/processing/all",
  verifyToken,
  OrderController.getAllOrdersByStatus
);
router.get("/confirmed/all", verifyToken, OrderController.getAllOrdersByStatus);
router.get(
  "/delivering/all",
  verifyToken,
  OrderController.getAllOrdersByStatus
);
router.get("/delivered/all", verifyToken, OrderController.getAllOrdersByStatus);
router.get("/", verifyToken, OrderController.getOrdersByUserID);
router.post("/", verifyToken, OrderController.createOrder);
router.patch("/:orderId/confirm", verifyToken, OrderController.confirmOrder);
router.patch("/:orderId/complete", verifyToken, OrderController.completeOrder);
router.patch("/:orderId/cancel", verifyToken, OrderController.cancelOrder);
router.post(
  "/:orderId/assign-shipper",
  verifyToken,
  OrderController.assignOrderToShipper
);

router.post("/crypto/create", OrderController.createCryptoOrder);
router.post("/crypto/submit-result", OrderController.submitCryptoResult);
router.get("/:orderId/events", OrderController.getEventsByOrderId);
router.get("/events", OrderController.getAllOrderEvents);
router.get("/:orderId/receipt", ReceiptController.viewReceipt);
module.exports = router;
