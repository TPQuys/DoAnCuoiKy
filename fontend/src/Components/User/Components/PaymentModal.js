import { Box, Button, Modal } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer'; // Import Buffer from the 'buffer' package

// Worker URL should be for pdfjs-dist 3.11.174
const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PaymentModal = ({ paymentData, open, onClose }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    // Fetch and load the invoice PDF file
    useEffect(() => {
        if (open && paymentData?.Invoice) {
            const fetchInvoice = () => {
                // Convert the Buffer to a Blob
                const buffer = Buffer.from(paymentData.Invoice); // Using the Buffer polyfill
                const blob = new Blob([buffer], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            };

            fetchInvoice();
        }

        // Cleanup the URL when the modal is closed
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl); // Revoke the URL to release memory
            }
        };
    }, [open, paymentData]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '800px',
                    bgcolor: 'background.paper',
                    padding: 2,
                    overflowY: 'hidden',
                    position: 'relative', // Make the Box a positioning context for child elements
                }}
            >
                {/* Nút Đóng */}
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        margin: 1,
                    }}
                >
                    Đóng
                </Button>

                {/* Nút Tải PDF */}
                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        download="invoice.pdf" // Tên file khi tải về
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                margin: 1,
                            }}
                        >
                            Tải xuống PDF
                        </Button>
                    </a>
                )}

                {/* Hiển thị PDF */}
                {pdfUrl ? (
                    <Worker workerUrl={workerUrl}>
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                ) : (
                    <p>Đang tải hóa đơn...</p>
                )}
            </Box>
        </Modal>
    );
};

export default PaymentModal;
