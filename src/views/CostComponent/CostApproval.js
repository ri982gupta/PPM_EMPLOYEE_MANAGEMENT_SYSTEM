import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { environment } from '../../environments/environment';
import CostApprovalFilters from './CostApprovalFilters'
import RoleWiseComputedCostTable from './RoleWiseComputedCostTable';

function CostApproval(props) {
  const { country, departments, selectedDepartments, setSelectedDepartments,
     roleTypes, selectedRoleTypes, setSelectedRoleTypes,formData,setFormData,
     getRoleWiseComputedCost,roleWiseComputedCostData,validator,setLoader } = props;

  const baseUrl = environment.baseUrl;

  const costApprovalButtonHandler = () => {
    getRoleWiseComputedCost();
  }

  return (
    <div >
      <CostApprovalFilters
        country={country}
        departments={departments}
        selectedDepartments={selectedDepartments}
        setSelectedDepartments={setSelectedDepartments}
        roleTypes={roleTypes}
        formData={formData}
        setFormData={setFormData}
        selectedRoleTypes={selectedRoleTypes}
        setSelectedRoleTypes={setSelectedRoleTypes}
        costApprovalButtonHandler={costApprovalButtonHandler}
        validator = { validator }
      />

      <RoleWiseComputedCostTable
        roleWiseComputedCostData={roleWiseComputedCostData}
        getRoleWiseComputedCost = {getRoleWiseComputedCost}
        setLoader = { setLoader }
      />

    </div>
  )
}

export default CostApproval