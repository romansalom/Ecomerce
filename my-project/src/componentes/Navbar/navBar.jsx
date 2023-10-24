import React, { useState } from 'react';

function Navbar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-s-screen">
      <div className="antialiased bg-gray-100 dark-mode:bg-gray-900">
        <div className="w-full text-black bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between p-4">
              <a href="/" className="text-xl font-semibold tracking-widest text-black uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
                Flowtrail UI
              </a>
              <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline" onClick={() => setOpen(!open)}>
                <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                  {open ? (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </div>
            <nav className={`flex-col flex-grow ${open ? '' : 'hidden'} pb-4 md:pb-0 md:flex md:justify-end md:flex-row`}>
              <a
                className="px-4 py-2 mt-2 text-base font-semibold rounded-lg text-black md:mt-0 md:ml-4 text-decoration-none text-reset hover:text-green-500"
                href="/"
              >
                Fume
              </a>
              <a
                className="px-4 py-2 mt-2 text-base font-semibold rounded-lg text-black md:mt-0 md:ml-4 text-decoration-none text-reset hover:text-green-500"
                href="/portfolio"
              >
                Supreme
              </a>
              <a
                className="px-4 py-2 mt-2 text-base font-semibold rounded-lg text-black md:mt-0 md:ml-4 text-decoration-none text-reset hover:text-green-500"
                href="/about"
              >
                Elf Bar
              </a>
              <a
                className="px-4 py-2 mt-2 text-base font-semibold rounded-lg text-black md:mt-0 md:ml-4 text-decoration-none text-reset hover:text-green-500"
                href="/contact"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
