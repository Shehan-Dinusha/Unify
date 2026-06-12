import React from "react";

export const ArrowDownIcon = ({ className = "" }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

export const ArrowRightIcon = ({ className = "" }) => (
  <svg
    width="14" height="12" viewBox="0 0 14 12"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M1.1665 6H12.8332M12.8332 6L7.58317 0.75M12.8332 6L7.58317 11.25"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export const BankIcon = ({ className = "" }) => (
  <svg
    className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
  </svg>
);

export const BookIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const CheckIcon = ({ className = "" }) => (
  <svg
    width="100%" height="100%" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
  </svg>
);

export const CheckSmallIcon = ({ className = "" }) => (
  <svg
    width="10" height="8" viewBox="0 0 10 8" fill="none"
    className={className}
  >
    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ className = "" }) => (
  <svg
    width="12" height="8" viewBox="0 0 12 8" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronLeftIcon = ({ className = "" }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon = ({ className = "" }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const CloseIcon = ({ className = "" }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
);

export const CoffeeIcon = ({ className = "" }) => (
  <svg
    width="12" height="13" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="currentColor" />
  </svg>
);

export const HouseIcon = ({ className = "" }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
  </svg>
);

export const InfoCircleIcon = ({ className = "" }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor" />
  </svg>
);

export const MinusCircleIcon = ({ className = "" }) => (
  <svg
    width="36" height="36" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z" fill="currentColor" />
  </svg>
);

export const SaveIcon = ({ className = "" }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3V8H15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShieldCheckFilledIcon = ({ className = "" }) => (
  <svg
    width="100%" height="100%" viewBox="0 0 24 28"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 0L0 5.33333V12C0 18.6667 5.10667 24.8933 12 26.6667C18.8933 24.8933 24 18.6667 24 12V5.33333L12 0ZM9.33333 20L4 14.6667L5.88 12.7867L9.33333 16.2267L18.12 7.44L20 9.33333L9.33333 20Z" fill="currentColor" />
  </svg>
);

export const ShieldCheckIcon = ({ className = "" }) => (
  <svg
    width="24" height="28" viewBox="0 0 24 28"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 26.5C12 26.5 22.5 21.5 22.5 12.5V5L12 1.5L1.5 5V12.5C1.5 21.5 12 26.5 12 26.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 13.5L11 16L16.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = ({ className = "" }) => (
  <svg
    width="100%" height="100%" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
  </svg>
);

export const WarningIcon = ({ className = "" }) => (
  <svg
    width="100%" height="100%" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
  </svg>
);
