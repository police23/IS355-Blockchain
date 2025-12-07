import { useEffect, useMemo, useRef, useState } from "react";
import "./MyOrderReceiptModal.css";
import axios from "axios";
import { getReceiptPDFByOrderID } from "../../services/OrderService";

export default function MyOrderReceiptModal({ orderId, open, onClose }) {
	// Use backend endpoint to fetch decrypted PDF
	const [isLoaded, setIsLoaded] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState("");
	const [objectUrl, setObjectUrl] = useState("");
	const objectUrlRef = useRef("");

	useEffect(() => {
		// Clean up object URL when closing or CID changes
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = "";
			}
		};
	}, []);

	useEffect(() => {
		if (!open) {
			setIsLoaded(false);
			setIsFetching(false);
			setError("");
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = "";
			}
			setObjectUrl("");
			return;
		}

		// When opened, fetch the (encrypted) file via GET, decrypt (if needed), and render
		let cancelled = false;
		const run = async () => {
			try {
				setIsFetching(true);
				setError("");
				setIsLoaded(false);

				// Fetch PDF blob from backend
				const pdfBlob = await getReceiptPDFByOrderID(orderId);

				// Create object URL from blob
				const url = URL.createObjectURL(pdfBlob);
				if (cancelled) return;

				// Replace previous object URL if any
				if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = url;
				setObjectUrl(url);
				setIsLoaded(true);
			} catch (e) {
				console.error(e)
				if (!cancelled) {
					setError(e?.message || "Failed to load PDF");
					setIsLoaded(false);
				}
			} finally {
				if (!cancelled) setIsFetching(false);
			}
		};

		run();
		return () => {
			cancelled = true;
		};
	}, [open, orderId]);

	if (!open) return null;

	return (
		<div className="receipt-modal__backdrop" role="dialog" aria-modal="true">
			<div className="receipt-modal__container">
				<div className="receipt-modal__header">
					<h3 className="receipt-modal__title">Order #{orderId}</h3>
					<button className="receipt-modal__close" onClick={onClose} aria-label="Close">
						×
					</button>
				</div>

				<div className="receipt-modal__body">
					{(isFetching || !isLoaded) && !error && (
						<div className="receipt-modal__loading">
							<div className="spinner" />
							<span>Loading and decrypting PDF…</span>
						</div>
					)}
					{error && (
						<div className="receipt-modal__error">{error}</div>
					)}
					{/* Render PDF via object URL created from fetched bytes */}
					<iframe
						title="Order Receipt PDF"
						className={`receipt-modal__iframe ${isLoaded && !isFetching && !error ? "loaded" : ""}`}
						src={objectUrl}
					/>
				</div>

				<div className="receipt-modal__footer">
					<a href={objectUrl} target="_blank" rel="noreferrer" className="receipt-modal__link">
						Open in new tab
					</a>
				</div>
			</div>
		</div>
	);
}

