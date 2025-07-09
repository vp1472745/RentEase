import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import { Receipt } from "lucide-react";
import generator from "../assets/generator.gif";
import Footer from "../component/footer";

const RentReceipt = () => {
  const [formData, setFormData] = useState({
    tenantName: "",
    landlordName: "",
    rentAmount: "",
    address: "",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const receiptRef = useRef();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.tenantName) newErrors.tenantName = "Tenant Name is required";
    if (!formData.landlordName) newErrors.landlordName = "Landlord Name is required";
    if (!formData.rentAmount || formData.rentAmount <= 0) newErrors.rentAmount = "Enter a valid rent amount";
    if (!formData.address) newErrors.address = "Property Address is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    if (validateForm()) {
      useReactToPrint({ content: () => receiptRef.current })();
    }
  };

  const handleDownloadPDF = () => {
    if (validateForm()) {
      const pdf = new jsPDF();
      pdf.text("Rent Receipt", 20, 20);
      pdf.text(`Tenant Name: ${formData.tenantName}`, 20, 40);
      pdf.text(`Landlord Name: ${formData.landlordName}`, 20, 50);
      pdf.text(`Rent Amount: ₹${formData.rentAmount}`, 20, 60);
      pdf.text(`Address: ${formData.address}`, 20, 70);
      pdf.text(`Date: ${formData.date}`, 20, 80);
      pdf.save("Rent_Receipt.pdf");
    }
  };

  return (

    <>
    <div className="w-[100%]  bg-purple-800 h-15"></div>
    <div className="mx-auto  mt-10 text-white min-h-screen ">
      {/* <div className="relative h-[120vh] flex flex-col items-center justify-center bg-cover bg-center text-center text-white text-5xl"
        style={{ backgroundImage: `url('${generator}')` }}>
        Rent Receipt Generatormt-5
      </div> */}

      <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-8  ">
        <div className="w-full lg:w-2/4 max-w-2xl p-12  shadow-xl rounded-xl border border-purple-800 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center border-b border-purple-800 pb-3 text-purple-800">
            <Receipt className="mr-2" /> Rent Receipt Generator
          </h2>
          {Object.values(errors).map((error, index) => (
            <p key={index} className="text-red-500 text-sm mb-2">{error}</p>
          ))}
          <input type="text" name="tenantName" placeholder="Tenant Name" value={formData.tenantName} onChange={handleInputChange} className="w-full p-4 mb-4 border rounded  text-purple-800 border-purple-800 cursor-pointer outline-none" />
          <input type="text" name="landlordName" placeholder="Landlord Name" value={formData.landlordName} onChange={handleInputChange} className="w-full p-4 mb-4 border rounded  text-purple-800 border-purple-800 cursor-pointer outline-none" />
          <input type="number" name="rentAmount" placeholder="Rent Amount (₹)" value={formData.rentAmount} onChange={handleInputChange} className="w-full p-4 mb-4 border rounded  text-purple-800 border-purple-800 cursor-pointer outline-none" />
          <input type="text" name="address" placeholder="Property Address" value={formData.address} onChange={handleInputChange} className="w-full p-4 mb-4 border rounded  text-purple-800 border-purple-800 cursor-pointer outline-none" />
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-4 mb-4 border rounded  text-purple-800 border-purple-800 cursor-pointer outline-none" />
        </div>

        <div className="w-full lg:w-3/5 max-w-2xl p-12  shadow-xl rounded-xl mt-6 lg:mt-0 border border-purple-800">
          <div className="flex space-x-6">
            <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-4 rounded hover:bg-blue-700 cursor-pointer">
              Print Receipt
            </button>
            <button onClick={handleDownloadPDF} className="bg-green-600 text-white px-6 py-4 rounded hover:bg-green-700 cursor-pointer">
              Download PDF
            </button>
          </div>

          <div ref={receiptRef} className="mt-8 p-6 border rounded  text-purple-800 border-purple-800">
            <h3 className="text-lg font-bold border-b border-purple-800 pb-2 text-purple-800">Rent Receipt</h3>
            <p><strong>Tenant Name:</strong> {formData.tenantName}</p>
            <p><strong>Landlord Name:</strong> {formData.landlordName}</p>
            <p><strong>Rent Amount:</strong> ₹{formData.rentAmount}</p>
            <p><strong>Property Address:</strong> {formData.address}</p>
            <p><strong>Date:</strong> {formData.date}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default RentReceipt;