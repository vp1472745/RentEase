import React, { useState } from 'react';

const RealEstateResearchReports = () => {
  const reports = [
    {
      id: 1,
      title: "India Rental Property Market: Trends and Growth Opportunities",
      description: "Insights into the factors driving the rental property market in India, including urbanization and market demand.",
      date: "January 15, 2025",
      category: "Rental Trends",
      downloadLink: "https://www.linkedin.com/pulse/india-rental-property-market-trends-growth-opportunities-cp7kf"
    },
    {
      id: 2,
      title: "Expert Solutions to Common Real Estate Listing Issues",
      description: "Best practices for creating effective property listings that attract quality tenants in the Indian market.",
      date: "February 20, 2025",
      category: "Listing Optimization",
      downloadLink: "https://www.suntecindia.com/blog/common-real-estate-listing-issues/"
    },
    {
      id: 3,
      title: "Tenant Verification in India: A Comprehensive Guide for Landlords",
      description: "Guidelines on legally and effectively screening potential tenants in India.",
      date: "March 10, 2025",
      category: "Property Management",
      downloadLink: "https://www.redcheckes.com/Bloglist-tenant-verification-in-india"
    },
    {
      id: 4,
      title: "Property Maintenance Guide by CREDAI – MCHI",
      description: "Comprehensive guide on building and estate management techniques and practices in India.",
      date: "April 5, 2025",
      category: "Property Management",
      downloadLink: "https://www.mchi.net/pdf/National-Property-Maintenance-Guide.pdf"
    },
    {
      id: 5,
      title: "Short-Term vs. Long-Term Rentals: Which Offers Higher Returns?",
      description: "Comparative analysis of profitability and management requirements for different rental strategies in India.",
      date: "May 18, 2025",
      category: "Rental Strategies",
      downloadLink: "https://timesproperty.com/news/post/short-term-vs-long-term-rentals-which-offers-higher-returns-blid8637"
    },
    {
      id: 6,
      title: "How Technology is Changing the Game for Rental Property Owners in India",
      description: "Review of the best apps and tools for managing rental properties efficiently in the Indian context.",
      date: "June 22, 2025",
      category: "Property Tech",
      downloadLink: "https://timesofindia.indiatimes.com/blogs/voices/how-technology-is-changing-the-game-for-rental-property-owners-in-india/"
    }
  ];

  const categories = ["All", "Rental Trends", "Listing Optimization", "Property Management", "Rental Strategies", "Property Tech"];

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory === "All" || report.category === activeCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (reportTitle, downloadUrl) => {
    console.log(`Downloaded: ${reportTitle}`);
    window.open(downloadUrl, '_blank');
  };

  return (
          <>
          <div className='w-[100%] h-15 bg-purple-800'></div>
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-purple-800 sm:text-2xl lg:text-5xl">
            Rental Property Research Hub
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-purple-800">
            Expert insights to help you list, manage, and optimize your rental properties in India.
          </p>
        </div>

        <div className="mb-8 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="search" className="block text-sm font-medium text-purple-800 mb-1">
                Search Reports
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-4 pr-10 py-2 border-purple-800 outline-none rounded-md  border" 
                  placeholder="Search by title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label htmlFor="category" className="block text-sm font-medium text-purple-800  mb-1">
                Filter by Category
              </label>
              <select
                id="category"
                className="block w-full pl-3 pr-10 py-2 text-base border border-purple-800 outline-none rounded-md"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)} 
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <div key={report.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow border border-purple-800">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{report.title}</h3>
                  <p className="text-sm text-purple-800 mb-4">{report.description}</p>
                  <div className="flex justify-between items-center text-sm text-purple-800">
                    <span>{report.date}</span>
                    <button
                      className="text-purple-800 cursor-pointer hover:text-purple-600 font-medium"
                      onClick={() => handleDownload(report.title, report.downloadLink)}
                    >
                 Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No reports found.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RealEstateResearchReports;
