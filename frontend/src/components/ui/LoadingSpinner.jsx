// src/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };
  return (
    <span className={`loading loading-spinner ${sizes[size] || sizes.md} text-primary`}></span>
  );
}
