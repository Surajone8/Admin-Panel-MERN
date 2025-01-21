const OrderStatusDropdown = ({ currentStatus, onStatusChange }) => {
    const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Processing'];

    // Filter out the current status from the options
    const availableOptions = statusOptions.filter(status => status !== currentStatus);

    return (
      <div className="relative inline-block">
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={currentStatus} disabled>
            {currentStatus} (Current)
          </option>
          {availableOptions.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>
    );
  };

  export default OrderStatusDropdown;
