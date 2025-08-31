// src/components/InvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoicePreview from './InvoicePreview';
import { saveInvoice } from './InvoiceService';
import '../styles/InvoiceForm.css';

const fixedServices = [
  { name: 'Web Page Development', price: 5000 },
  { name: 'Application Management Services', price: 0 },
  { name: 'Cloud Business Services', price: 0 },
  { name: 'Business Analyst', price: 0 }
];

const optionalServices = [
  { name: 'SEO Optimization', price: 2000 },
  { name: 'Hosting Setup', price: 1500 },
  { name: 'Logo Design', price: 1000 }
];

const districtsTN = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Vellore', 'Erode', 'Thanjavur', 'Dindigul', 'Cuddalore', 'Kanchipuram', 'Nagapattinam'
];

const paymentMethods = ['UPI', 'CARD', 'ACCOUNT_TRANSFER', 'CASH'];

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState(fixedServices.map(s => ({ ...s })));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(''); // ✅ backend will return invoiceNo

  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('India');

const [paid, setPaid] = useState(0);
const [balance, setBalance] = useState(0);



  const handleAddService = () => {
    const service = optionalServices.find(s => s.name === selectedService);
    if (service && !services.find(s => s.name === service.name)) {
      setServices([...services, { ...service }]);
      setSelectedService('');
    }
  };

  const handlePriceChange = (index, newPrice) => {
    const updated = [...services];
    updated[index].price = parseInt(newPrice) || 0;
    setServices(updated);
  };

  const handleNameChange = (index, newName) => {
    const updated = [...services];
    updated[index].name = newName;
    setServices(updated);
  };

  const handleDeleteService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

 // ✅ Totals
  const subtotal = services.reduce((acc, s) => acc + s.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;
 
  // ✅ Update balance when paid changes
  React.useEffect(() => {
    const calculatedBalance = Math.max(totalAmount - paid, 0);
    setBalance(calculatedBalance);
  }, [paid, totalAmount]);

  const handleSave = async () => {
    if (!authorizedPerson.trim()) {
      alert("Please enter the authorized person's name.");
      return;
    }

    const payload = {
      
      invoiceDate: date,
      customerName: clientCompany,
      email: clientEmail,
      phone: clientContact,
      address: clientAddress,
      district,
      country,
      serviceDescription: services.map(s => s.name).join(', '),
      servicePrice: subtotal,
      tax: gst,
      totalAmount,
      paid,
      balance,
      paymentMethod: paymentMethod.toUpperCase()
    };

   try {
  const response = await saveInvoice(payload); // backend generates invoiceNo
  console.log('Save response:', response);

  if (response && response.data && response.data.invoiceNo) {
    setInvoiceNo(response.data.invoiceNo); // ✅ set invoiceNo from backend
  }

  alert('Invoice saved to backend!');
} catch (error) {
  console.error('Save failed:', error);
  alert('Failed to save invoice. Check backend.');
}

  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="invoice-form">
      <div className="row search-bar">
        <input
          type="text"
          placeholder="Search invoice or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2>Create Invoice</h2>

      <div className="row">
        <label>Client Company Name:</label>
        <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
      </div>

      <div className="row">
        <label>Client Email:</label>
        <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
      </div>

      <div className="row">
        <label>Client Contact:</label>
        <input type="tel" value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="Enter phone number" />
      </div>

      <div className="row">
        <label>Client Address:</label>
        <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={3}></textarea>
      </div>

      <div className="row">
        <label>District (Tamil Nadu):</label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">-- Select District --</option>
          {districtsTN.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>Country:</label>
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <div className="row">
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
          <option value="">-- Add Optional Service --</option>
          {optionalServices.map((s, i) => (
            <option key={i} value={s.name}>
              {s.name} - ₹{s.price}
            </option>
          ))}
        </select>
        <button onClick={handleAddService}>Add</button>
      </div>

      <div className="row">
        <label>Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          {paymentMethods.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="row">
        <label>Authorized Person:</label>
        <input type="text" value={authorizedPerson} onChange={(e) => setAuthorizedPerson(e.target.value)} />
      </div>


       {/* --- NEW FIELDS --- */}
      <div className="row"><label>Paid Amount:</label>
        <input type="number" min="0" value={paid} onChange={(e) => setPaid(Number(e.target.value))} />
      </div>
      <div className="row"><label>Balance:</label>
        <input type="number" value={balance} readOnly />
      </div>

      <h4>Added Services</h4>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={s.price}
                    onChange={(e) => handlePriceChange(i, e.target.value)}
                  />
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteService(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoicePreview
        services={services} // ✅ include all services
        paymentMethod={paymentMethod}
        authorizedPerson={authorizedPerson}
        date={date}
        subtotal={subtotal}
        gst={gst}
        total={totalAmount}
        invoiceNo={invoiceNo}
        clientCompany={clientCompany}
        clientAddress={clientAddress}
        clientEmail={clientEmail}
        clientContact={clientContact}
        district={district}
        country={country}
        paid={paid}
        balance={balance}
      />

      <div className="row">
        <button className="save-btn" onClick={handleSave}>
          Save Invoice to Backend
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
