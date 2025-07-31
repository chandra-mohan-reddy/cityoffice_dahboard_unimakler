import React from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/common/Loader';

const LazyLoad = () => {

  // * Auth pages

  const Advertise = lazy(() => import(`../auth/Advertise.jsx`));
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
  const AddTeamleader = lazy(() => import(`../pages/SaleExecutive/AddTeamleader`));
  const AddChannelPartner = lazy(() => import(`../pages/ChannelPartner/AddChannelPartner`));
  // const SalesLists = lazy(() => import(`../pages/SaleExecutive/SalesLists`));

  // -------------------//

  // const ChannelProfile = lazy(() => import(`../pages/ChannelProfile`));



  //-------------------- premium -listings----------//

  // const EditProject = lazy(() => import(`../pages/projects/ProjectEdit`))
  //---------------------

  const SalesLists = lazy(() => import(`../pages/SaleExecutive/SalesLists`));

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
        <Route path="/addchannelpartner" element={<AddChannelPartner />} />



        {/* -------------------- premium -listings---------- */}
        {/* <Route path="/projects" element={<ProjectsList />} />
        <Route path='/editProject' element={<EditProject />} /> */}

        {/* -------------------- premium -listings---------- */}
        {/* <Route path='/AddListing' element={<AddMetaListing />} />
        <Route path="/projects" element={<ProjectsList />} />

        <Route path="/buysalepackage" element={<BuysalePakage />} />
        <Route path="/activesalepackage" element={<Activesalepakage />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/buyrentalspackages" element={<Buyrentpackages />} />
        <Route path="/activerentpackages" element={<Activerentpackage />} />
        <Route path="/postnewrentals" element={<Postnewrentals />} />
        <Route path="/packageresponse/:id" element={<PackageResponsive />} />
        <Route path="/meta-activepackage" element={<Activepakage />} />
        
        
        <Route path="/removesale" element={<RemovesaleExe />} />

        

        

        {/* <Route path="/importleads" element={<ImportLeads />} /> */}
        {/* <Route path="/channelprofile" element={<ChannelProfile />} /> */}

        <Route path="/salesexe" element={<SalesLists />} />
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
      </Routes>
    </Suspense>
  );
};

export default LazyLoad;
