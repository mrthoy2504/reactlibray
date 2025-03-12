export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  size = "md",
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative z-50 w-full ${sizeClasses} rounded-lgshadow-lg`}
      >
        <div>
          {/* <h3 className="text-lg font-semibold text-gray-400">{title}</h3> */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-gray-900"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-4 text-gray-400">{children}</div>
      </div>
    </div>
  );
}
