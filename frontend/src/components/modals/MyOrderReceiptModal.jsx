import { useEffect, useMemo, useRef, useState } from "react";
import "./MyOrderReceiptModal.css";

// Props:
// - open: boolean to show/hide modal
// - onClose: function to close modal
// - cid: optional string; if not provided, default CID used
// - gatewayBaseUrl: optional string to override gateway
// - decryptFn: async function(ArrayBuffer) => ArrayBuffer|Uint8Array|Blob (optional)
//   If provided, the fetched content will be passed to this for decryption
//   before being rendered. Should return the decrypted PDF bytes.
// - id: optional short identifier (falls back to CID)
// - orderId: optional human-friendly order code (e.g. mã đơn) — preferred for title
export default function MyOrderReceiptModal({ open, onClose, cid, gatewayBaseUrl, decryptFn, id, orderId }) {
	const DEFAULT_CID =
		"bafybeih27iuct337oz4xlazqbhrp3r4gx3qyslkdeiqktow45o4lolkjle";
	const baseUrl =
		gatewayBaseUrl ||
		"https://teal-urban-bonobo-388.mypinata.cloud/ipfs";

	const activeCid = cid || DEFAULT_CID;
	const gatewayFetchUrl = useMemo(() => `${baseUrl}/${activeCid}`, [baseUrl, activeCid]);

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

				const resp = await fetch(gatewayFetchUrl, {
					method: "GET",
					// If your gateway requires auth, add headers here
				});
				if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

				const encryptedBuffer = await resp.arrayBuffer();
				const processedBytes = decryptFn
					? await decryptFn(encryptedBuffer)
					: encryptedBuffer;

				// Convert to Blob for PDF viewing
				const pdfBlob = processedBytes instanceof Blob
					? processedBytes
					: new Blob([processedBytes], { type: "application/pdf" });

				const url = URL.createObjectURL(pdfBlob);
				if (cancelled) return;

				// Replace previous object URL if any
				if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = url;
				setObjectUrl(url);
				setIsLoaded(true);
			} catch (e) {
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
	}, [open, gatewayFetchUrl, decryptFn]);

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
					<a href={objectUrl || gatewayFetchUrl} target="_blank" rel="noreferrer" className="receipt-modal__link">
						Open in new tab
					</a>
				</div>
			</div>
		</div>
	);
}

