import React from 'react'
import VendorManagementFilters from './VendorManagementFilters'

function VendorManagement({ urlState, buttonState, setButtonState, setUrlState }) {
  return (
    <div>
      <VendorManagementFilters
        urlState={urlState}
        buttonState={buttonState}
        setButtonState={setButtonState}
        setUrlState={setUrlState}
      />
    </div>
  );
}

export default VendorManagement
