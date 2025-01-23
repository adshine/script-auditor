export function Logo() {
  return (
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-100">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-800"
      >
        <path
          d="M20 6L3 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 10L3 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <path
          d="M20 14L3 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
        <path
          d="M15 18L3 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.2"
        />
        <path
          d="M17.5 21C19.9853 21 22 18.9853 22 16.5C22 14.0147 19.9853 12 17.5 12C15.0147 12 13 14.0147 13 16.5C13 18.9853 15.0147 21 17.5 21Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M16.5 14.5L18.5 16.5L16.5 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
} 