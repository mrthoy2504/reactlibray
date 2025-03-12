import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <div>
      <div className="containerbill">
        <div className="text-center"></div>
        <div className=""></div>
        <div className="text-center">
          <span>.....................................................</span>
          <p className="mt-1">
            <p className="">ผู้รับเงิน</p>
          </p>
          <p className="mt-2">........../............/..........</p>
        </div>
      </div>
    </div>
  );
}
);



