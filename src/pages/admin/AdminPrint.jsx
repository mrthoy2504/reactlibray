import { useRef } from "react";
import ReactToPrint from "react-to-print";

import ComponentToPrint from "./ComponentToPrint.jsx";

const AdminPrint = () => {
  const componentRef = useRef();

  return (
    <div className=" z-99 sticky">
      <ReactToPrint
        trigger={() => (
          <button className=" fixed  top-2 left-72 bg-blue-500 text-white px-4 py-1 rounded print:hidden">
            Print
          </button>
        )}
        content={() => componentRef.current}
      />
      <ComponentToPrint ref={componentRef} />
    </div>
  );
};
export default AdminPrint;
