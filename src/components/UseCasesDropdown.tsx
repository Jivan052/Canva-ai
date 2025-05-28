import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function UseCasesDropdown(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (): void => setOpen(!open);
  const closeDropdown = (): void => setOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="block text-sm  hover:scale-105 hover:font-bold hover:text-black/80"
      >
        Use cases
      </button>

      {open && (
        <div className="absolute mt-2 bg-white border rounded shadow-md z-10">
          <ul className="w-48 text-sm">
            <li>
              <Link
                to="/product-sales"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Product Sales
              </Link>
            </li>
            <li>
              <Link
                to="/hr-operation"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                HR Operation
              </Link>
            </li>
            <li>
              <Link
                to="/finance"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Finance
              </Link>
            </li>
            <li>
              <Link
                to="/marketing"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Marketing
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
