// {isAuthenticated && user ? (
//   <div className="relative" ref={profileRef}>
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         setIsProfileOpen(!isProfileOpen);
//       }}
//       className="relative w-10 cursor-pointer h-10 flex ml-20 items-center justify-center rounded-full overflow-hidden border-2 border-white"
//     >
//       <img
//         src={users}
//         alt="Profile"
//         className="w-full h-full object-cover"
//       />
//     </button>
//     {isProfileOpen && (
//       <div 
//         className="absolute right-0 mt-2 w-90 bg-white shadow-lg rounded-lg py-2 overflow-y-auto max-h-130 custom-scrollbar"
//         onClick={(e) => {
//           // Close menu when clicking on empty space
//           if (e.target === e.currentTarget) {
//             setIsProfileOpen(false);
//           }
//         }}
//       >
//         {/* Profile Header */}
//         <div 
//           className="px-4 py-2 flex items-center"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <img
//             src={users}
//             alt="Profile"
//             className="w-12 h-12 rounded-full object-cover border"
//           />
//           <div className="ml-3">
//             <p className="font-semibold mt-2 ">{user?.name}</p>
//             <p className="text-gray-500 text-sm">{user?.email}</p>
//             <Link 
//               to="" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsProfileOpen(false);
//               }}
//             >
//               <div className="flex">
//                 <IoDiamondOutline className="mt-1" size={14} />
//                 <span className="mt-1 ml-1 text-[12px]">
//                   Upgrade to Premium
//                 </span>
//                 <RiArrowRightSLine className="mt-1 ml-1" size={19} />
//               </div>
//             </Link>
//           </div>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate("/profile");
//               setIsProfileOpen(false);
//             }}
//             className="mr-2 text-gray-600 hover:text-gray-900"
//           >
//             <Edit size={20} className="cursor-pointer mb-9" />
//           </button>
//         </div>

//         <div className="border-t my-2"></div>

//         {/* My Activity Section */}
//         <div 
//           className="bg-white p-4 rounded-lg"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <h2 className="font-semibold mb-4">My Activity</h2>
//           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-[12px]">
//             {[
//               {
//                 id: "Contacted",
//                 label: "Contacted\nProperties",
//                 icon: <img src={contactp} alt="Contacted" className="w-7 h-7 mt-2" />,
//                 count: 4,
//               },
//               // ... other activity items ...
//             ].map((tab) => (
//               <div
//                 key={tab.id}
//                 className={`flex flex-col items-center border-2 rounded-lg px-6 shadow-md w-[72px] h-[90px] relative cursor-pointer ${
//                   selectedTab === tab.id
//                     ? "bg-purple-50 border-purple-800 border-2 text-purple-800 hover:text-black"
//                     : "bg-white shadow-lg hover:border-purple-800 border-3"
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedTab(tab.id);
//                 }}
//               >
//                 {tab.icon}
//                 <p className="text-center whitespace-pre-line">
//                   {tab.label}
//                 </p>
//                 <div className={`px-3 rounded-full text-sm mb-2 ${
//                   selectedTab === tab.id
//                     ? "bg-purple-50 text-purple-800"
//                     : "bg-gray-200 text-purple-800"
//                 }`}>
//                   {tab.count.toString().padStart(2, "0")}
//                 </div>
//                 {selectedTab === tab.id && (
//                   <div className="absolute bottom-[-6px] w-3 h-3 bg-purple-50 border-b-2 border-purple-800 rotate-45"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Menu Items - All with proper click handlers */}
//         <div className="my-2"></div>
        
//         <Link
//           to="/premium"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsProfileOpen(false);
//           }}
//           className="hover:bg-purple-300 flex rounded-md"
//         >
//           <IoDiamondOutline className="mt-3 ml-3" size={20} />
//           <span className="block px-4 py-2 text-purple-800 hover:text-black">
//             Zero Brokerage properties
//           </span>
//         </Link>

//         <Link
//           to="/profile?tab=myTransactions"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsProfileOpen(false);
//           }}
//           className="hover:bg-purple-300 flex rounded-md"
//         >
//           <FaRegFileAlt size={20} className="mt-3 ml-3" />
//           <span className="block px-5 py-2 text-purple-800 hover:text-black">
//             My Transactions
//           </span>
//         </Link>

//         <Link
//           to="/profile?tab=myTransactions"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsProfileOpen(false);
//           }}
//           className="hover:bg-purple-300 flex rounded-md"
//         >
//           <SlStar className="mt-3 ml-3" size={20} />
//           <span className="block px-4 py-2 text-purple-800 hover:text-black">
//             My Review
//           </span>
//           <img src={news} className="w-6 h-6 ml-2 mt-2" alt="" />
//         </Link>

//         {/* Quick Search Section */}
//         <div className={`transition-all duration-300 ${
//           isQuickSearchOpen ? "mb-24" : "mb-0"
//         }`}>
//           <div 
//             className="relative hover:bg-purple-300 rounded-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsQuickSearchOpen(!isQuickSearchOpen);
//               }}
//               className="text-lg mt-2 transition flex items-center w-83 ml-2 text-black-800 hover:text-black cursor-pointer"
//             >
//               <img src={cursor} alt="" className="w-6" />
//               <span className="px-4 py-2 text-[16px] mr-40 text-purple-800 hover:text-black">
//                 Quick Link
//               </span>
//               <MdOutlineKeyboardArrowUp
//                 size={16}
//                 className={`${
//                   isQuickSearchOpen ? "rotate-180" : ""
//                 } transition-transform ml-5`}
//               />
//             </button>
//           </div>

//           {isQuickSearchOpen && (
//             <div 
//               className="mt-2 w-80 h-22 rounded-md py-2 flex flex-wrap gap-2 p-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Quick search links with click handlers */}
//               {quickLinks.map(link => (
//                 <Link
//                   key={link.to}
//                   to={link.to}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setIsProfileOpen(false);
//                   }}
//                   className="flex flex-col items-center p-2 hover:border-purple-800 border-3 hover:bg-purple-50 rounded"
//                 >
//                   {link.icon}
//                   <span className="text-sm text-center text-black-800">
//                     {link.label}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Other sections (Housing Edge, Services) follow same pattern */}

//         {/* Logout Button */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleLogout();
//             setIsProfileOpen(false);
//           }}
//           className="block w-80 ml-3 rounded-md text-left px-4 py-2 mt-3 text-purple-800 hover:text-black hover:border-purple-800 hover:bg-purple-300 flex items-center cursor-pointer border"
//         >
//           <LogOut size={16} className="mr-2 text-purple-800" /> Logout
//           <RiArrowRightSLine className="mr-1 ml-48" size={19} />
//         </button>

//         {/* App Download Section */}
//         <div 
//           className="bg-white p-4 md:p-6 rounded-xl w-full max-w-md mx-auto"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* ... existing app download content ... */}
//         </div>
//       </div>
//     )}
//   </div>
// ) : (
//   /* Non-authenticated menu */
//   <div className="relative" ref={authMenuRef}>
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         setIsAuthMenuOpen(!isAuthMenuOpen);
//       }}
//       className="text-white font-semibold text-2xl"
//     >
//       Create Account
//     </button>
//     {isAuthMenuOpen && (
//       <div 
//         className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) {
//             setIsAuthMenuOpen(false);
//           }
//         }}
//       >
//         <Link
//           to="/signup"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsAuthMenuOpen(false);
//           }}
//           className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
//         >
//           Sign Up
//         </Link>
//         <Link
//           to="/login"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsAuthMenuOpen(false);
//           }}
//           className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
//         >
//           Login
//         </Link>
//       </div>
//     )}
//   </div>
// )}
//   </div>