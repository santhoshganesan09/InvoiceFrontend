// src/components/SearchPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteInvoice, searchInvoices, updateInvoice } from './InvoiceService';
import '../styles/search-bar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';


const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get('q');
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;
      try {
        const res = await searchInvoices(searchTerm);
        setResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
        alert('Error fetching results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);
  
const handleEdit = (id) => {
  const invoice = results.find(inv => inv.id === id);
  setSelectedInvoice(invoice);

  const modal = new Modal(document.getElementById('editModal'));
  modal.show();
};

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirmed) return;

    try {
      await deleteInvoice(id);
      setResults(results.filter(inv => inv.id !== id));
      alert('Invoice deleted!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete invoice.');
    }
  };


  const handleInputChange = (e) => {
    setSelectedInvoice({
      ...selectedInvoice,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await updateInvoice(selectedInvoice.id, selectedInvoice);
      alert('Invoice updated!');
      window.location.reload(); // or re-fetch search results
    } catch (err) {
      alert('Update failed.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Results</h2>
      {searchTerm ? (
        <p>You searched for: <strong>{searchTerm}</strong></p>
      ) : (
        <p>Type something to search invoices.</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="table-wrapper table-responsive mt-4">
          <table className="search-table table table-hover align-middle">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Actions</th>
              
              </tr>
            </thead>
            <tbody>
              {results.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.invoiceDate}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.email}</td>
                  <td>{inv.phone}</td>
                  <td style={{ whiteSpace: 'pre-wrap' }} >{inv.serviceDescription}</td>
                  <td>₹{inv.totalAmount}</td>
                  <td>{inv.paymentMethod}</td>
                  <td className='d-flex justify-content-center align-items-center'>
                    <button className="edit-button btn btn-warning p-2" style={{ marginRight: '5px', }} onClick={() => handleEdit(inv.id)}>Edit</button>
                    <button className="delete-button btn btn-danger"  onClick={() => handleDelete(inv.id)} style={{ marginLeft: '5px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



{/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Edit Invoice</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              {selectedInvoice && (
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Client Name</label>
                    <input type="text" name="customerName" className="form-control" value={selectedInvoice.customerName || ''} onChange={handleInputChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={selectedInvoice.email || ''} onChange={handleInputChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input type="tel" name="phone" className="form-control" value={selectedInvoice.phone || ''} onChange={handleInputChange} />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-control" rows="2" value={selectedInvoice.address || ''} onChange={handleInputChange}></textarea>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Service Description</label>
                    <textarea name="serviceDescription" className="form-control" rows="2" value={selectedInvoice.serviceDescription || ''} onChange={handleInputChange}></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Total Amount (₹)</label>
                    <input type="number" name="totalAmount" className="form-control" value={selectedInvoice.totalAmount || ''} onChange={handleInputChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Payment Method</label>
                    <select name="paymentMethod" className="form-select" value={selectedInvoice.paymentMethod || ''} onChange={handleInputChange}>
                      <option value="UPI">UPI</option>
                      <option value="CARD">CARD</option>
                      <option value="CASH">CASH</option>
                      <option value="ACCOUNT_TRANSFER">ACCOUNT_TRANSFER</option>
                    </select>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      </div>










    </div>
  );
};

export default SearchPage;
