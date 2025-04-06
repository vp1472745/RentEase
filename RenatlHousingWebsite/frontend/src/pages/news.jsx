import React, { useState } from 'react';

const newsArticles = [
  {
    id: 1,
    title: "Government Rolls Out New Rental Housing Scheme",
    description: "A new affordable rental housing policy has been launched to boost rental infrastructure across urban areas in India.",
    date: "March 5, 2025",
    category: "Government Policies",
    source: "https://www.hindustantimes.com/real-estate/govt-affordable-rent-scheme"
  },
  {
    id: 2,
    title: "Top 5 Cities for Property Investment in 2025",
    description: "Discover the most promising cities for rental returns and property value growth in India this year.",
    date: "March 20, 2025",
    category: "Market Trends",
    source: "https://economictimes.indiatimes.com/wealth/real-estate/top-investment-cities-2025"
  },
  {
    id: 3,
    title: "How to List Your Property Online and Attract Tenants",
    description: "Tips for creating effective listings, choosing platforms, and writing catchy descriptions.",
    date: "February 28, 2025",
    category: "Listing Tips",
    source: "https://housing.com/news/how-to-list-property-online"
  },
  {
    id: 4,
    title: "Rising Rent Prices in Tier 2 Cities",
    description: "Rental prices are surging in cities like Indore, Lucknow, and Bhopal due to high demand.",
    date: "April 2, 2025",
    category: "Renting",
    source: "https://www.moneycontrol.com/news/business/real-estate/rent-rise-tier-2-cities-2025"
  },
  {
    id: 5,
    title: "Property Tax Rules Changed in Major Cities",
    description: "Updated property tax regulations introduced for urban residential units.",
    date: "April 1, 2025",
    category: "Government Policies",
    source: "https://www.business-standard.com/article/real-estate/property-tax-rule-change"
  },
  {
    id: 6,
    title: "Smart Cities Increasing Rental Demand",
    description: "Development of smart cities is pushing rental demand and property prices.",
    date: "March 30, 2025",
    category: "Market Trends",
    source: "https://www.financialexpress.com/real-estate/smart-cities-rental-demand"
  },
  {
    id: 7,
    title: "Common Mistakes While Renting Your Flat",
    description: "Avoid these mistakes while putting your house up for rent.",
    date: "March 25, 2025",
    category: "Renting",
    source: "https://housing.com/news/common-renting-mistakes"
  },
  {
    id: 8,
    title: "Free Legal Advice for Rental Disputes Launched",
    description: "New initiative provides free legal aid for landlord-tenant disputes.",
    date: "March 18, 2025",
    category: "Government Policies",
    source: "https://www.india.gov.in/news/legal-aid-rent-disputes"
  },
  {
    id: 9,
    title: "How to Write an Attractive Property Listing",
    description: "Improve your chances of finding tenants with effective listing strategies.",
    date: "March 10, 2025",
    category: "Listing Tips",
    source: "https://magicbricks.com/blog/write-property-listing"
  },
  {
    id: 10,
    title: "Metro Expansion Driving Property Value Surge",
    description: "New metro lines in cities are increasing rental values near stations.",
    date: "March 7, 2025",
    category: "Market Trends",
    source: "https://www.99acres.com/articles/metro-impact-on-property-values"
  },
  {
    id: 11,
    title: "What Documents You Need to Rent a Property",
    description: "A checklist of required documents for tenants and landlords.",
    date: "February 25, 2025",
    category: "Renting",
    source: "https://www.nobroker.in/blog/documents-needed-rent-house"
  },
  {
    id: 12,
    title: "Tips to Photograph Your Property Like a Pro",
    description: "Learn how to click the best photos for your online property listing.",
    date: "February 20, 2025",
    category: "Listing Tips",
    source: "https://housing.com/news/property-photo-tips"
  },
  {
    id: 13,
    title: "Rental Agreement Format Updated by Government",
    description: "New standard rental agreement introduced to avoid disputes.",
    date: "February 15, 2025",
    category: "Government Policies",
    source: "https://indiatimes.com/news/new-rental-agreement-format"
  },
  {
    id: 14,
    title: "Student Housing Booms in University Cities",
    description: "Increased demand for PGs and rentals in cities like Pune and Bengaluru.",
    date: "February 10, 2025",
    category: "Market Trends",
    source: "https://www.livemint.com/real-estate/student-housing-demand"
  },
  {
    id: 15,
    title: "New Furnishing Trends in Rental Properties",
    description: "Tenants now prefer semi-furnished homes with smart features.",
    date: "February 5, 2025",
    category: "Market Trends",
    source: "https://realty.economictimes.indiatimes.com/news/furnishing-trends-2025"
  },
  {
    id: 16,
    title: "Checklist Before You Rent Out Your Property",
    description: "Essential pre-checks every landlord must do before renting.",
    date: "January 31, 2025",
    category: "Renting",
    source: "https://99acres.com/articles/checklist-before-renting-property"
  },
  {
    id: 17,
    title: "Can You Rent Property as a Student? Know Your Rights",
    description: "Student tenants have legal rights, know how to exercise them.",
    date: "January 25, 2025",
    category: "Renting",
    source: "https://www.indiatoday.in/rent-rights-students"
  },
  {
    id: 18,
    title: "Online Platforms for Property Listing in 2025",
    description: "The best apps and platforms for renting and selling property in India.",
    date: "January 20, 2025",
    category: "Listing Tips",
    source: "https://www.techcircle.in/top-property-platforms"
  },
  {
    id: 19,
    title: "How to Handle Tenant Background Checks",
    description: "Learn how to screen tenants properly before finalizing agreement.",
    date: "January 15, 2025",
    category: "Listing Tips",
    source: "https://magicbricks.com/articles/tenant-background-checks"
  },
  {
    id: 20,
    title: "Affordable Housing Gets Budget Boost in 2025",
    description: "Government increases funding and tax benefits for affordable rental housing.",
    date: "January 10, 2025",
    category: "Government Policies",
    source: "https://www.moneycontrol.com/news/budget-2025-affordable-housing"
  }
];

const categories = ["All", "Government Policies", "Market Trends", "Listing Tips", "Renting"];

const RealEstateNews = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = newsArticles.filter(news => {
    const matchesCategory = activeCategory === "All" || news.category === activeCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          news.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (

<>
          <div className='w-[100%] h-15 bg-purple-800'></div>

    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-purple-800">Real Estate News & Updates</h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full md:w-1/2 border border-purple-800 rounded-md px-4 py-2 outline-none cursor-pointer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full md:w-1/2 border border-purple-800 rounded-md px-4 py-2 cursor-pointer"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map(news => (
              <div key={news.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition duration-200 border-2 border-purple-800">
                <h2 className="text-xl font-semibold text-purple-800">{news.title}</h2>
                <p className="text-sm  mb-2 text-purple-800">{news.date} | {news.category}</p>
                <p className="text-purple-800 mb-4">{news.description}</p>
                <a href={news.source} target="_blank" rel="noopener noreferrer" className="text-purple-800 ">
                  Read More →
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No news found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RealEstateNews;
