import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <span className="ms-1">Prolifics &copy; 2023, All Rights Reserved.</span>
    </CFooter>
  )
}

export default React.memo(AppFooter)
