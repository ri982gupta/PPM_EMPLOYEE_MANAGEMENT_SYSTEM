import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cilPuzzle,
  cilStar,
  cilMoney
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'




const _nav = [
  
  // {
  //   component: CNavItem,
  //   name: 'Pipeline Trending',
  //   to: '/pipeLine',
  //   icon: <CIcon  customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavItem,
  //   name: 'Reviews',
  //   to: '/reviews',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'ScoreCard',
  //   to: '/scoreCard',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Attainment',
  //   to: '/attainment',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: ' Inside Sales',
  //   to: '/insideSales',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Progress',
  //   to: '/progress',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Software',
  //   to: '/software',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Cost',
  //   to: '/cost',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },


  {
    component: CNavGroup,
    name: 'Sales',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Services Plan & Review',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/service',
      },
      {
        component: CNavItem,
        name: 'S/W Plan & Review',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/software',
      },
      {
        component: CNavItem,
        name: 'Weekly Pipeline Progress',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/progress',
      },
      {
        component: CNavItem,
        name: 'Revenue Attainment Metrics',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/attainment',
      },
      {
        component: CNavItem,
        name: 'Scorecard',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/scoreCard',
      },
      {
        component: CNavItem,
        name: 'Pipeline Trending',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/pipeLine',
      },
      {
        component: CNavItem,
        name: 'Reviews',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/reviews',
      },
      {
        component: CNavItem,
        name: 'Inside Sales',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: '/sales/insideSales',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Cost',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View / Upload',
        to: '/cost/viewUpload',
      },
      {
        component: CNavItem,
        name: 'Role View',
        to: '/cost/roleView',
      },
      {
        component: CNavItem,
        name: 'Role Approvals',
        to: '/cost/roleApprovals',
      },
      {
        component: CNavItem,
        name: 'Role Grid',
        to: '/cost/roleGrid',
      },
      {
        component: CNavItem,
        name: 'Login History',
        to: '/cost/loginHistory',
      },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Service',
  //   to: '/service',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },
  
  {
    component: CNavGroup,
    name: 'Vendors',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon"  />,
    items: [
      {
        component: CNavItem,
        name: 'Vendors',
        to: '/vendor/vendors',
      },
      {
        component: CNavItem,
        name: 'Management',
        to: '/vendor/management',
      },
      {
        component: CNavItem,
        name: 'Performance',
        to: '/vendor/performance',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Project',
    icon: <CIcon icon={cilStar} customClassName="nav-icon"  />,
    items: [
      {
        component: CNavItem,
        name: 'Projects',
        to: '/project',
      },
      {
        component: CNavItem,
        name: 'ProjectOpen',
        to: '/project/projectopen',
      },
      
    ],
  },
  {
    component: CNavItem,
    name: 'Project Invoice Details',
    to: '/projectInvoiceDetails',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },

  
  // {
  //   component: CNavItem,
  //   name: 'TestCase',
  //   to: '/testCase',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },

  {
    component: CNavGroup,
    name: 'Revenue Metrices',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon"  />,
    items: [
      {
        component: CNavItem,
        name: 'Monthly Revenue Forecast',
        to: '/revenueMetrices/RevenueForecast',
      },
      {
        component: CNavItem,
        name: 'Monthly PR Changes By Day',
        to: '/revenueMetrices/MonthlyPRChangesByDay',
      },
      {
        component: CNavItem,
        name: 'Revenue & Margin Analysis',
        to: '/revenueMetrices/Revenue&MarginAnalysis',
      },
      {
        component: CNavItem,
        name: 'Revenue By Industry',
        to: '/revenueMetrices/RevenueByIndustry',
      },{
        component: CNavItem,
        name: 'Revenue Projections',
        to: '/revenueMetrices/RevenueProjections',
      }, {
        component: CNavItem,
        name: 'Revenue & Margin Variance',
        to: '/revenueMetrices/RevenueMarginVariance',
      },{
        component: CNavItem,
        name: 'Headcount & Margin Trend',
        to: '/revenueMetrices/HeadcountMarginTrend',
      },
    ],
  },




  {
    component: CNavItem,
    name: 'Delivery',
    to: '/delivery',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/reports',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Fullfilment',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon"  />,
    items: [
      {
        component: CNavItem,
        name: 'Forcast/Supply',
        to: '/fullfilment/forcastSupply',
      },
      {
        component: CNavItem,
        name: 'Bench Matrix',
        to: '/fullfilment/benchMatrix',
      },
      {
        component: CNavItem,
        name: 'Resource Request',
        to: '/fullfilment/resourceRequest',
      },
      {
        component: CNavItem,
        name: 'Demand and Supply',
        to: '/fullfilment/demandAndSupply',
      },
      {
        component: CNavItem,
        name: 'Staffing GM %[Deprecated]',
        to: '/fullfilment/staffingGM',
      },
    ],
  },



]

export default _nav
