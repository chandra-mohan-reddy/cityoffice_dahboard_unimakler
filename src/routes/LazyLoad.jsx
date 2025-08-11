import React from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/common/Loader';

const LazyLoad = () => {

  // * Auth pages

  const Login = lazy(() => import(`../auth/Login.jsx`));
  const Otp = lazy(() => import(`../auth/Otp.jsx`));

  // * Common pages for all Roles
  const Dashboard = lazy(() => import(`../pages/common/Dashboard`));
  const Profile = lazy(() => import(`../pages/common/Profile`));
  const AssignProjects = lazy(() => import(`../pages/common/Projects.jsx`));


  // * City Office role Pages
  const AddsalesExecutive = lazy(() => import(`../pages/SaleExecutive/AddsalesExecutive`));
  const AddCitymanager = lazy(() => import(`../pages/SaleExecutive/AddCitymanager`));
  const AddGenaralmanager = lazy(() => import(`../pages/SaleExecutive/AddGenaralmanager`));

  const AddTeamleader = lazy(() => import(`../pages/Teamleader/AddTeamleader.jsx`));

  const AddChannelPartner = lazy(() => import(`../pages/ChannelPartner/AddChannelPartner`));


  const CreateFranchise = lazy(() => import(`../pages/Franchise/CreateFranchise`));
  const AssociateLists = lazy(() => import(`../pages/Franchise/FranchiseList.jsx`));
  const RemovedFranchises = lazy(() => import(`../pages/Franchise/RemovedFranchises.jsx`));

  const FranchiseDetails = lazy(() => import(`../pages/Franchise/FranchiseDetails`));
  const AllFranchises = lazy(() => import(`../pages/Franchise/AllFranchises`));
  const AllFranchisesmonthList = lazy(() => import(`../pages/Franchise/AllFranchisesmonthList`));


  const InternalTransfer = lazy(() => import(`../pages/LeadTransfer/InternalTransfer`));
  const ExternalTransfer = lazy(() => import(`../pages/LeadTransfer/ExternalTransfer`));
  const OutBox = lazy(() => import(`../pages/LeadTransfer/OutBox`));

  const ProjectLeadlist = lazy(() => import(`../pages/LeadManagement/ProjectLeadlist`));
  const ProjectLeadlistmonth = lazy(() => import(`../pages/LeadManagement/ProjectLeadlistmonth`));
  const AddLead = lazy(() => import(`../pages/LeadManagement/AddLead`));
  const DropoutLead = lazy(() => import(`../pages/LeadManagement/DropoutLead`));
  const DeletedLeads = lazy(() => import(`../pages/LeadManagement/DeletedLeads`));
  const FranInternalTransfer = lazy(() => import(`../pages/FranchiseleadTransfer/FranInternalTransfer`));
  const FranExternalTransfer = lazy(() => import(`../pages/FranchiseleadTransfer/FranExternalTransfer`));

  const TeamLeaderList = lazy(() => import(`../pages/TeamleadLead/TeamLeaderList`));
  const TeamLeaderdetails = lazy(() => import(`../pages/TeamleadLead/TeamLeaderdetails`));
  const SalesExecutiveslist = lazy(() => import(`../pages/SalesExecutives/SalesExecutiveslist`));
  const SalesExecutivesdetails = lazy(() => import(`../pages/SalesExecutives/SalesExecutivesdetails`));

  const SalesLeadMonthlyLeads = lazy(() => import('../pages/SaleExecutive/MonthlyLeads'));
  const Leadregistration = lazy(() => import('../pages/ChannelPartner/Leadregistration'));
  const DealClosed = lazy(() => import('../pages/ChannelPartner/DealClosed'));


  // sub-pages

  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        // * Auth Routes

        <Route path="/" element={<Login />} />
        <Route path="Otp" element={<Otp />} />

        // * Common Page Routes for all Roles

        <Route path="/home" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/projects" element={<AssignProjects />} />

        // * Leads Routes

        <Route path="/leads/add" element={<AddLead />} />
        <Route path="/leads/list" element={<ProjectLeadlist />} />
        <Route path="/leads/projecteadlistmonth" element={<ProjectLeadlistmonth />} />
        <Route path="/leads/dropout" element={<DropoutLead />} />
        <Route path="/leads/delete" element={<DeletedLeads />} />

        // * City Office Role Routes

        <Route path="/executive" element={<AddsalesExecutive />} />
        <Route path="/citymanager" element={<AddCitymanager />} />
        <Route path="/teamleader" element={<AddTeamleader />} />
        <Route path="/generalmanager" element={<AddGenaralmanager />} />
        <Route path="/channel-partner" element={<AddChannelPartner />} />

        <Route path="/franchise/create" element={<CreateFranchise />} />
        <Route path="/franchise/list" element={<AssociateLists />} />
        {/* <Route path="/franchise/details/:id" element={<FranchiseDetails />} /> */}
        <Route path="/franchise/details" element={<FranchiseDetails />} />

        <Route path="/franchise/allfranchises" element={<AllFranchises />} />
        <Route path="/franchise/:id/leads/:month" element={<AllFranchisesmonthList />} />

        <Route path="/internal-transfer" element={<InternalTransfer />} />
        <Route path="/external-transfer" element={<ExternalTransfer />} />
        <Route path="/outbox" element={<OutBox />} />
        <Route path="/fran-internal" element={<FranInternalTransfer />} />
        <Route path="/fran-external" element={<FranExternalTransfer />} />

        {/* <Route path="/teamleaderlist" element={<TeamLeaderlist />} />
        <Route path="/teamleaderdetails" element={<TeamLeaderdetails />} />
        <Route path="/salesexecutivelist" element={<SalesExecutivelist />} />
        <Route path="/salesexecutivedetails" element={<SalesExecutivedetails />} /> */}
        <Route path="/teamleaderlist" element={<TeamLeaderList />} />
        <Route path="/team-leader/:id" element={<TeamLeaderdetails />} />
        <Route path="/saleexecutiveslist" element={<SalesExecutiveslist />} />
        <Route path="/sales-executive/details/:id" element={<SalesExecutivesdetails />} />
        <Route path='/salesexecutive/:id/leads/:month' element={<SalesLeadMonthlyLeads />} /> 
        <Route path='/lead-registration' element={<Leadregistration />} /> 
        <Route path='/deal-closed' element={<DealClosed />} /> 
        {/* <Route path='/lead-registration' element={<Leadregistration />} />  */}
          {/* <Route path="/teamleaderdetails" element={<TeamLeaderList />} />
        <Route path="/teamleaderdetails" element={<TeamLeaderList />} />
        <Route path="/teamleaderdetails" element={<TeamLeaderList />} /> */}
      </Routes>
    </Suspense>
  );
};

export default LazyLoad;
