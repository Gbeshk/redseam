import { useEffect } from "react";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CartOverlay({
  isOpen,
  onClose,
  children,
}: CartOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(16, 21, 31, 0.3)" }}
        onClick={onClose}
      />
      {children}
    </div>
  );
}
