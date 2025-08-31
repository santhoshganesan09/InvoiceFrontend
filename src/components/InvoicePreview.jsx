// src/components/InvoicePreview.jsx
import React from 'react';
import { generatePDF } from './GeneratePDF'; // adjust if needed

const InvoicePreview = ({
  services,
  paymentMethod,
  authorizedPerson,
  date,
  subtotal,
  gst,
  total,
  invoiceNo,
  clientCompany,
  clientAddress,
  district,
  country,
  clientEmail,
  clientContact,
  paid,
  balance,
}) => {
  return (
    <div className="invoice-preview" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Invoice</h2>

      <div className="invoice-header">
        <p><strong>Invoice No:</strong> {invoiceNo}</p>
        <p><strong>Date:</strong> {date}</p>
      </div>

      <div className="client-details">
        <h3>Client Information</h3>
        <p><strong>Company:</strong> {clientCompany}</p>
        <p><strong>Address:</strong> {clientAddress}</p>
        <p><strong>District:</strong> {district}</p>
        <p><strong>Country:</strong> {country}</p>
        <p><strong>Email:</strong> {clientEmail}</p>
        <p><strong>Contact:</strong> {clientContact}</p>
      </div>

      <div className="services">
        <h3>Services</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Service</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td style={{ padding: '8px 0' }}>{service.name}</td>
                <td style={{ textAlign: 'right' }}>₹{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="totals" style={{ marginTop: '20px' }}>
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>GST:</strong> ₹{gst}</p>
        <p><strong>Total:</strong> ₹{total}</p>
        <p><strong>Paid:</strong> ₹{paid}</p>
        <p><strong>Balance:</strong> ₹{balance}</p>
      </div>

      <div className="footer" style={{ marginTop: '20px' }}>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Authorized By:</strong> {authorizedPerson}</p>

        <button
          className="download-btn"
          onClick={() =>
            generatePDF({
              services,
              paymentMethod,
              authorizedPerson,
              date,
              subtotal,
              gst,
              total,
              invoiceNo,
              clientCompany,
              clientAddress,
              district,
              country,
              clientEmail,
              clientContact,
              paid,
              balance,
            })
          }
        >
          Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
