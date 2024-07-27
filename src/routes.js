import React from "react";
import VendorManagement from "./views/VendorComponent/VendorManagement";
import Performance from "./views/VendorComponent/VendorPerformanceFilters";
import NonBillableWork4Weeks from "./views/UtilisationMetrics/NonBillableWork4weeksfilters";
import ProjectHealth from "./views/DeliveryComponent/ProjectHealth";
import BillableUtilisationTrend from "./views/UtilisationMetrics/BillableUtilisationTrendFilter";
import Hierarchy from "./views/Teams/Hierarchy";
import UtilisationFY from "./views/UtilisationMetrics/UtilisationFY";
import PyramidIndex from "./views/UtilisationMetrics/PyramidIndex";
import Profile from "./views/Teams/Profile";
import CustomDashboard from "./views/Dashboard/CustomDashboard";
import ExpenseStackView from "./views/TimeAndExpenses/Expenses/ExpenseStackView";
import SalaryBand from "./views/SalaryBand/SalaryBand";

// MasterData Config
const Pipeline = React.lazy(() =>
  import("./views/PipeLineComponent/PipelineTrending")
);
const MyDashboard = React.lazy(() => import("./views/Dashboard/MyDashboard"));
const SavedSearch = React.lazy(() => import("./views/Dashboard/SavedSearch"));
const Reviews = React.lazy(() => import("./views/ReveiwsComponent/Reviews"));
const ScoreCard = React.lazy(() =>
  import("./views/ScoreCardComponent/ScoreCard")
);
const Opportunities = React.lazy(() =>
  import("./views/SalesOpportunityComponent/Opportunities")
);

const OpportunityEdit = React.lazy(() =>
  import("./views/SalesforceComponent/OpportunityEdit")
);

const sfReports = React.lazy(() =>
  import("./views/SalesforceComponent/Reports")
);

const Attainment = React.lazy(() =>
  import("./views/AttainmentComponent/Attainment")
);
const InsideSales = React.lazy(() =>
  import("./views/InsideSalesComponent/InsideSales")
);
const Progress = React.lazy(() => import("./views/ProgressComponent/Progress"));
const SelectSEDialogBox = React.lazy(() =>
  import("./views/SelectSE/SelectSEDialogBox")
);
const RoleView = React.lazy(() => import("./views/CostComponent/RoleView"));
const Software = React.lazy(() => import("./views/SoftwareComponent/Software"));
const richtext = React.lazy(() => import("./views/RichText/RichText"));
const Service = React.lazy(() => import("./views/ServiceComponent/Service"));
const vt = React.lazy(() => import("./views/ServiceComponent/SfPipeline"));
const viewAndUpload = React.lazy(() =>
  import("./views/CostComponent/ViewAndUpload")
);
const roleApprovals = React.lazy(() =>
  import("./views/CostComponent/RoleApprovals")
);
const costRoleGrid = React.lazy(() =>
  import("./views/CostComponent/CostRoleGrid")
);
const vendor = React.lazy(() => import("./views/VendorComponent/Vendor"));
const create = React.lazy(() => import("./views/VendorComponent/VendorCreate"));
const OpenTopMenu = React.lazy(() =>
  import("./views/VendorComponent/OpenTopMenu")
);
const VendorPerformance = React.lazy(() =>
  import("./views/VendorComponent/VendorPerformance")
);

const vendorDoc = React.lazy(() =>
  import("./views/VendorComponent/ParentVendor")
);
const loginHistory = React.lazy(() =>
  import("./views/CostComponent/LoginHistory")
);
const project = React.lazy(() => import("./views/ProjectComponent/Project"));
const Overview = React.lazy(() => import("./views/ProjectComponent/Project"));
const projectOpen = React.lazy(() =>
  import("./views/ProjectComponent/ParentProject")
);

const Enagagement = React.lazy(() =>
  import("./views/DeliveryComponent/Delivery")
);

const projectInvoiceDetails = React.lazy(() =>
  import("./views/ProjectInvoiceDetailsComponent/ProjectInvoiceDetails")
);

const RevenueMarginVariance = React.lazy(() =>
  import("./views/RevenueMetrices/RevenueVariance")
);
const HeadcountMarginTrend = React.lazy(() =>
  import("./views/RevenueMetrices/HeadCount.js")
);
const MonthlyPRChangesByDay = React.lazy(() =>
  import("./views/RevenueMetrices/MonthlyPRChangesByDay.js")
);
const MonthlyRevenueForecastment = React.lazy(() =>
  import("./views/RevenueMetrices/RevenueForecast")
);
const RevenueMarginAnalysis = React.lazy(() =>
  import("./views/RevenueMetrices/MarginAnalysis.js")
);
const MonthlyRevenueTrend = React.lazy(() =>
  import("./views/RevenueMetrices/MonthlyRevenueTrend")
);
const RevenueByIndustry = React.lazy(() =>
  import("./views/RevenueMetrices/RevenueIndustry.js")
);
const RevenueProjections = React.lazy(() =>
  import("./views/RevenueMetrices/RevenueProjections.js")
);
const RolesPermission = React.lazy(() =>
  import("./views/Administration/RolesPermissions.js")
);
const ContractDocuments = React.lazy(() =>
  import("./views/Administration/ContractDocuments")
);
const JobDailyStatus = React.lazy(() =>
  import("./views/Administration/JobsDailyStatus.js")
);
const RoleCosts = React.lazy(() => import("./views/Administration/RoleCosts"));

const search = React.lazy(() =>
  import("./views/Customer/InitialCustomerComponent")
);

const QBR = React.lazy(() => import("./views/Customer/QBR"));
const searchM = React.lazy(() => import("./views/Customer/Search.js"));
const financialplanservice = React.lazy(() =>
  import("./views/Customer/FinancialPlanService.js")
);
const rolemapping = React.lazy(() => import("./views/Customer/RoleMapping.js"));
const edit = React.lazy(() => import("./views/Customer/Edit.js"));
const cuscreate = React.lazy(() => import("./views/Customer/CusCreate.js"));
const financials = React.lazy(() => import("./views/Customer/Financials.js"));
const accountplan = React.lazy(() => import("./views/Customer/AccountPlan.js"));
const ContractorCosts = React.lazy(() =>
  import("./views/Customer/ContractorCosts")
);

const InnovationDashboard = React.lazy(() =>
  import("./views/Customer/InnovationDashboard")
);

const UploadRoleCost = React.lazy(() =>
  import("./views/Customer/UploadRoleCost")
);
const SolutionMapping = React.lazy(() =>
  import("./views/Customer/SolutionMapping")
);
const View = React.lazy(() => import("./views/Customer/View"));
const ProjectInvoiceDetails = React.lazy(() =>
  import("./views/Customer/ProjectInvoiceDetails")
);
const ProjectStatusReport = React.lazy(() =>
  import("./views/Customer/ProjectStatusReport")
);
const EngagementAllocations = React.lazy(() =>
  import("./views/Customer/EngagementAllocations")
);
const Documents = React.lazy(() => import("./views/Customer/Documents"));
const forecastSupply = React.lazy(() =>
  import("./views/FullfimentComponent/ResourceForcastSupply")
);
const benchMatrix = React.lazy(() =>
  import("./views/FullfimentComponent/BenchMatrics")
);
const resourceRequest = React.lazy(() =>
  import("./views/FullfimentComponent/ResourceRequest")
);
const demandAndSupply = React.lazy(() =>
  import("./views/FullfimentComponent/DemandAndSupply")
);
const staffingGM = React.lazy(() =>
  import("./views/FullfimentComponent/StaffingGM")
);
const subkconversiontrend = React.lazy(() =>
  import("./views/FullfimentComponent/SubkConversionTrend")
);

const reports = React.lazy(() => import("./views/ReportsComponent/Report"));
const ReporteeReport = React.lazy(() =>
  import("./views/ReportsComponent/ReporteeReport")
);
const AllocatedandBilledhoursReport = React.lazy(() =>
  import("./views/ReportsComponent/AllocatedandBilledhoursReport")
);
const ResourceEntryReport = React.lazy(() =>
  import("./views/ReportsComponent/ResourceEntryReport")
);
const TimesheetDetailedReport = React.lazy(() =>
  import("./views/ReportsComponent/TimesheetDetailedReport")
);
const UnApprovedTime = React.lazy(() =>
  import("./views/ReportsComponent/UnApprovedTime")
);
const FinanceBillingTimesheetReport = React.lazy(() =>
  import("./views/ReportsComponent/FinanceBillingTimesheetReport")
);
const FinanceReport = React.lazy(() =>
  import("./views/ReportsComponent/FinanceReport")
);
const RevenueReport = React.lazy(() =>
  import("./views/ReportsComponent/RevenueReport")
);
const BillingReport = React.lazy(() =>
  import("./views/ReportsComponent/BillingReport")
);
const ProjectResourceReport = React.lazy(() =>
  import("./views/ReportsComponent/ProjectResourceReport")
);
const ResourceList = React.lazy(() =>
  import("./views/ReportsComponent/ResourceList")
);
const ResourceUtilizationReport = React.lazy(() =>
  import("./views/ReportsComponent/ResourceUtilizationReport")
);
const ProjectListForCSAT = React.lazy(() =>
  import("./views/ReportsComponent/ProjectListForCSAT")
);
const BUAllocationReport = React.lazy(() =>
  import("./views/ReportsComponent/BUAllocationReport")
);
const ResourceAllocationReport = React.lazy(() =>
  import("./views/ReportsComponent/ResourceAllocationReport")
);
const ExpenseReport = React.lazy(() =>
  import("./views/ReportsComponent/ExpenseReport")
);

const csat = React.lazy(() => import("./views/GovernanceComponent/CSAT"));
const auditcpsetup = React.lazy(() =>
  import("./views/GovernanceComponent/AuditCpSetup")
);
const pcqa = React.lazy(() => import("./views/GovernanceComponent/PCQA"));
const nps = React.lazy(() => import("./views/GovernanceComponent/NPS"));
const qms = React.lazy(() => import("./views/GovernanceComponent/QMS"));

const NPSSurveyQuestions = React.lazy(() =>
  import("./views/GovernanceComponent/NPSSurveyQuestions")
);
const CSATSurveyQuestions = React.lazy(() =>
  import("./views/GovernanceComponent/CSATSurveyQuestions")
);

const teams = React.lazy(() =>
  import("./views/ResourceSkillsComponent/ResourceSkills")
);
const teamsProfile = React.lazy(() => import("./views/Teams/Profile"));
const fixedPriceCreate = React.lazy(() =>
  import("./views/TimeAndExpenses/FixedPriceCreate")
);
const fixedPriceOpen = React.lazy(() =>
  import("./views/TimeAndExpenses/FixedPriceOpen")
);
const fillTimesheets = React.lazy(() =>
  import("./views/TimeAndExpenses/FillTimesheets")
);
const tnmOpen = React.lazy(() => import("./views/TimeAndExpenses/T&MOpen"));
const shiftAllowances = React.lazy(() =>
  import("./views/TimeAndExpenses/ShiftAllownces")
);
const lockTimesheets = React.lazy(() =>
  import("./views/TimeAndExpenses/LockTimesheets")
);
const expenses = React.lazy(() =>
  import("./views/TimeAndExpenses/Expenses/Expenses")
);
const DashboardAllocation = React.lazy(() =>
  import("./views/Dashboard/DashboardAllocation.js")
);
const helpcontents = React.lazy(() =>
  import("./views/HelpComponent/HelpContents")
);
const salaryBand = React.lazy(() => import("./views/SalaryBand/SalaryBand"));
const releasenotes = React.lazy(() =>
  import("./views/HelpComponent/ReleaseNotes")
);
const CompetencyDashboard = React.lazy(() =>
  import("./views/Dashboard/Competency.js")
);
const engDashbord = React.lazy(() =>
  import("./views/DeliveryComponent/ParentDelivery")
);
const HammerTool = React.lazy(() =>
  import("./views/Administration/HammerTool")
);
const customerDashboard = React.lazy(() =>
  import("./views/Customer/CustomersTopMenus")
);

const profileopen = React.lazy(() => import("./views/Teams/Profile"));
const Accounting = React.lazy(() => import("./views/Accounting/Accounting"));
const Tracker = React.lazy(() => import("./views/Administration/Tracker"));
const ErrorLogs = React.lazy(() => import("./views/Administration/ErrorLogs"));
const ReportIdComponent = React.lazy(() =>
  import("./views/ReportsComponent/ReportIdComponent")
);
const Baselines = React.lazy(() =>
  import("./views/ProjectComponent/ProjectCompareBaseline")
);

const projectCreate = React.lazy(() =>
  import("./views/ProjectComponent/ProjectCreate")
);
const customerCreate = React.lazy(() => import("./views/Customer/CusCreate"));
const projectOverViewEdit = React.lazy(() =>
  import("./views/ProjectComponent/ProjectEdit")
);

const Invoice = React.lazy(() => import("./views/InvoiceComponent/Invoice"));

import ProjectCompareBaselineTable from "./views/ProjectComponent/ProjectCompareBaselineTable";
import ProjectCreate from "./views/ProjectComponent/ProjectCreate";

const compareBaseLineNew = React.lazy(() =>
  import("./views/ProjectComponent/ProjectCompareBaselineTable")
);

const SalesPermissions = React.lazy(() =>
  import("./views/Administration/SalesPermissions")
);

const salesUpload = React.lazy(() =>
  import("./views/SalesUpload/SalesUploadParent")
);

const projectEdit = React.lazy(() =>
  import("./views/ProjectComponent/ProjectEdit")
);

// const testCase = React.lazy(()=>import('./views/TestCases/TestCase'))

// const dashboardAllocation = React.lazy(() =>
//   import("./views/DashboardAlComponent/DashboardAllocation.js")
// );

function routes() {
  const routes = {
    routesData: {
      PipelineTrending: Pipeline,
      Reviews: Reviews,
      Management: VendorManagement,
      Performance: Performance,
      MyDashboard: MyDashboard,
      Scorecard: ScoreCard,
      Opportunities: Opportunities,
      OpportunityEdit: OpportunityEdit,
      sfReports: sfReports,
      RevenueAttainmentMetrics: Attainment,
      WeeklyPipelineProgress: Progress,
      "S/WPlan&Review": Software,
      "ServicesPlan&Review": Service,
      Vendors: vendor,
      Projects: projectOpen,
      Engagements: Enagagement,
      Customers: search,
      "FinancialPlan&Review": financialplanservice,
      RoleMapping: rolemapping,
      ContractorCosts: ContractorCosts,
      UploadRoleCosts: UploadRoleCost,
      Investment: InnovationDashboard,
      "Headcount&MarginsTrend": HeadcountMarginTrend,
      "Revenue&MarginAnalysis": RevenueMarginAnalysis,
      MonthlyRevenueTrend: MonthlyRevenueTrend,
      MonthlyRevenueForecast: MonthlyRevenueForecastment,
      MonthlyPRChangesbyDay: MonthlyPRChangesByDay,
      RevenueByIndustry: RevenueByIndustry,
      "Revenue&MarginVariance": RevenueMarginVariance,
      "Rev.Projections": RevenueProjections,
      RolesPermissions: RolesPermission,
      ContractDocuments: ContractDocuments,
      JobsDailyStatus: JobDailyStatus,
      SolutionMapping: SolutionMapping,
      Search: View,
      InvoiceDetails: ProjectInvoiceDetails,
      ProjectStatusReport: ProjectStatusReport,
      EngagementAllocations: EngagementAllocations,
      //ResourceSearch: ResourceSearch,
      "NBWork-4Prev.Weeks": NonBillableWork4Weeks,
      ProjectHealth: ProjectHealth,
      BillableUtilizationTrend: BillableUtilisationTrend,
      StakeholderMapping: Hierarchy,
      "Utilisation-FY": UtilisationFY,
      CustomDashboard: CustomDashboard,
      PyramidIndex: PyramidIndex,
      Documents: Documents,
      SalaryBand: SalaryBand,
      ProjectInvoiceDetails: projectInvoiceDetails,
      "Forecast/Supply": forecastSupply,
      BenchMetrics: benchMatrix,
      SubkConversionTrend: subkconversiontrend,
      ResourceRequest: resourceRequest,
      DemandAndSupply: demandAndSupply,
      "StaffingGM%[Deprecated]": staffingGM,
      Reports: reports,
      PCQA: pcqa,
      NPS: nps,
      CSAT: csat,
      QMS: qms,
      AuditCPSetup: auditcpsetup,
      NPSSurveyQuestions: NPSSurveyQuestions,
      CSATSurveyQuestions: CSATSurveyQuestions,
      // Teams : teams,
      Profile: teamsProfile,
      Skills: teams,
      "FixedPrice-Create": fixedPriceCreate,
      "FixedPrice-Open": fixedPriceOpen,
      FillTimesheets: fillTimesheets,
      "T&M-Open": tnmOpen,
      ShiftAllowances: shiftAllowances,
      LockTimesheets: lockTimesheets,
      Expenses: expenses,
      AllocationDashboard: DashboardAllocation,
      HelpContents: helpcontents,
      CompetencyDashboard: CompetencyDashboard,
      SavedSearches: SavedSearch,
      ReleaseNotes: releasenotes,
      OpenTopMenu: OpenTopMenu,
      VendorPerformance: VendorPerformance,
      HammerTool: HammerTool,
      Tracker: Tracker,
      ErrorLogs: ErrorLogs,
      QBR: QBR,
      RoleCosts: RoleCosts,
      Open: Invoice,
      SalesPermissions: SalesPermissions,
      Upload: salesUpload,
    },
    staticRoutesData: [
      {
        path: "/project/Overview/:projectId",
        name: "project",
        element: Overview,
      },
      {
        path: "/project/taskPlan/:projectId",
        name: "project",
        element: Overview,
      },
      {
        path: "/project/capacityPlan/:projectId",
        name: "project",
        element: Overview,
      },
      {
        path: "/vendor/vendorDoc/:vendorId",
        name: "vendor",
        element: vendorDoc,
      },
      {
        path: "/vendor/reviews/:vendorId",
        name: "vendor",
        element: vendorDoc,
      },
      // { path: "/Cost", name: "Cost", element: Cost },
      {
        path: "/cost/viewUpload",
        name: "viewAndUpload",
        element: viewAndUpload,
      },
      { path: "/cost/roleView", name: "RoleView", element: RoleView },
      {
        path: "/cost/roleApprovals",
        name: "roleApprovals",
        element: roleApprovals,
      },
      { path: "/cost/roleGrid", name: "costRoleGrid", element: costRoleGrid },
      {
        path: "/cost/loginHistory",
        name: "loginHistory",
        element: loginHistory,
      },
      {
        path: "/pmo/OpportunityEdit",
        name: "OpportunityEdit",
        element: OpportunityEdit,
      },
      {
        path: "/pmo/SalesforceReports",
        name: "sfReports",
        element: sfReports,
      },
      {
        path: "/projectInvoiceDetails",
        name: "Project Invoice Details",
        element: projectInvoiceDetails,
      },
      {
        path: "/SalaryBand",
        name: "Salary Band",
        element: SalaryBand,
      },
      {
        path: "/help/helpContents",
        name: "Help Contents",
        element: helpcontents,
      },
      {
        path: "/search/customerSearch/customer/dashboard/:customerId",
        name: "customer",
        element: customerDashboard,
      },
      {
        path: "/customer/engagement/:customerId",
        name: "customer",
        element: customerDashboard,
      },
      {
        path: "/resource/profile/:resourceId",
        name: "teamsProfile",
        element: profileopen,
      },
      {
        path: "/project/compareBaseline",
        name: "Baselines",
        element: Baselines,
      },
      {
        path: "/engagement/Dashboard/:engagementId",
        name: "engagement",
        element: engDashbord,
      },
      {
        path: "/engagement/projects/:engagementId",
        name: "engagement",
        element: engDashbord,
      },
      {
        path: "/help/ReleaseNotes",
        name: "Release Notes",
        element: releasenotes,
      },
      {
        path: "/report/getReport/reportId/:reportId",
        name: "Report",
        element: ReportIdComponent,
      },
      {
        path: "/expense/Create/:id",
        name: "expenses",
        element: expenses,
      },
      {
        path: "/project/create",
        name: "projectCreate",
        element: projectCreate,
      },
      {
        path: "/project/Info/:projectId",
        name: "project",
        element: projectEdit,
      },
      {
        path: "/customer/create",
        name: "customer",
        element: customerCreate,
      },
      {
        path: "project/edit/:projectId",
        name: "project",
        element: projectOverViewEdit,
      },

      /*{
        path: "/report/getReport/reportId=21",
        name: "Report",
        element: AllocatedandBilledhoursReport,
      },
      {
        path: "/report/getReport/reportId=9",
        name: "Report",
        element: ResourceEntryReport,
      },
      {
        path: "/report/getReport/reportId=12",
        name: "Report",
        element: TimesheetDetailedReport,
      },
      {
        path: "/report/getReport/reportId=30",
        name: "Report",
        element: UnApprovedTime,
      },
      {
        path: "/report/getReport/reportId=11",
        name: "Report",
        element: FinanceBillingTimesheetReport,
      },
      {
        path: "/report/getReport/reportId=29",
        name: "Report",
        element: FinanceReport,
      },
      {
        path: "/report/getReport/reportId=31",
        name: "Report",
        element: RevenueReport,
      },
      {
        path: "/report/getReport/reportId=16",
        name: "Report",
        element: BillingReport,
      },
      {
        path: "/report/getReport/reportId=25",
        name: "Report",
        element: ProjectResourceReport,
      },
      {
        path: "/report/getReport/reportId=14",
        name: "Report",
        element: ResourceList,
      },
      {
        path: "/report/getReport/reportId=33",
        name: "Report",
        element: ResourceUtilizationReport,
      },
      {
        path: "/report/getReport/reportId=22",
        name: "Report",
        element: ProjectListForCSAT,
      },
      {
        path: "/report/getReport/reportId=24",
        name: "Report",
        element: BUAllocationReport,
      },
      {
        path: "/report/getReport/reportId=23",
        name: "Report",
        element: ResourceAllocationReport,
      },
      {
        path: "/report/getReport/reportId=32",
        name: "Report",
        element: ExpenseReport,
      },*/
      {
        path: "/accounting/company",
        name: "Accounting",
        element: Accounting,
      },
      // {
      //   path: "/fulfilment/SubkConversionTrend",
      //   name: "SubkConversionTrend",
      //   element: subkconversiontrend,
      // },
      {
        path: "/project/baseline",
        name: "compareBaseLineNew",
        element: compareBaseLineNew,
      },
      {
        path: "/stackView",
        name: "ExpenseStackView",
        element: ExpenseStackView,
      },
    ],
  };

  return routes;
}

export default routes();

// const routes = [
//   { path: "sales/pipeline", name: "pipeline", element: Pipeline, exact: true },
//   { path: "sales/reviews", name: "reviews", element: Reviews, exact: true },
//   { path: "sales/scoreCard", name: "ScoreCard", element: ScoreCard },
//   { path: "sales/attainment", name: "Attainment", element: Attainment },
//   { path: "sales/progress", name: "Progress", element: Progress },
//   {
//     path: "/SelectSEDialogBox",
//     name: "SelectSEDialogBox",
//     element: SelectSEDialogBox,
//   },
//   { path: "sales/insideSales", name: "InsideSales", element: InsideSales },
//   // { path: '/Cost', name: 'Cost', element: Cost },
//   { path: "/cost/viewUpload", name: "viewAndUpload", element: viewAndUpload },
//   { path: "/cost/roleView", name: "RoleView", element: RoleView },
//   {
//     path: "/cost/roleApprovals",
//     name: "roleApprovals",
//     element: roleApprovals,
//   },
//   { path: "/cost/roleGrid", name: "costRoleGrid", element: costRoleGrid },
//   { path: "/cost/loginHistory", name: "loginHistory", element: loginHistory },
//   { path: "sales/software", name: "Software", element: Software },
//   { path: "sales/service", name: "Service", element: Service },
//   // { path: '/testCase', name: 'TestCase', element: testCase },
//   { path: "/richtext", name: "richtext", element: richtext },
//   { path: "/vt", name: "vt", element: vt },
//   { path: "/vendor/vendors", name: "vendor", element: vendor },
//   { path: "/vendor/create", name: "vendor", element: create },
//   { path: "/vendor/management", name: "vendor", element: VendorManagement },
//   { path: "/vendor/performance", name: "vendor", element: Performance },
//   { path: "/vendor/vendorDoc/:vendorId", name: "vendor", element: vendorDoc },
//   { path: "/vendor/reviews/:vendorId", name: "vendor", element: vendorDoc },
//   { path: "/project", name: "Project", element: project },
//   { path: "/project/Overview/:projectId", name: "project", element: Overview },
//   { path: "/project/projectopen", name: "projectOpen", element: projectOpen },
//   { path: "/delivery", name: "Delivery", element: delivery },
//   {
//     path: "/projectInvoiceDetails",
//     name: "Project Invoice Details",
//     element: projectInvoiceDetails,
//   },
// ];

// export default routes;
