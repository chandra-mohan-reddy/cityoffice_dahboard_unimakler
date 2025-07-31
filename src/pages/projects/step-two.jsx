import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loader from '../../components/common/Loader';
import { masterClient } from '../../utils/httpClient';
import { Offcanvas } from 'react-bootstrap';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleImages3 } from '../../utils/S3Handler';
import Dropzone from 'react-dropzone';

const StepTwo = ({ nextStep, prevStep, type, subType }) => {
  console.log('subType', subType);
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.projectManagement['project']);

  const [approvals, setApprovals] = useState([]);
  const [approvalTypes, setApprovalTypes] = useState([]);
  const [communitis, setCommunities] = useState([]);
  const [saleableAres, setSaleableArea] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState([]);
  const [bhkSize, setBhkSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ipInfo } = useContext(IpInfoContext);
  const [form, setForm] = useState({ unitDetails: [], ...formState });
  const [formError, setFormError] = useState({});
  const [propertySize, setPropertySize] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [carParking, setCarParking] = useState([]);
  const [balconies, setBalconies] = useState([]);
  const [bathrooms, setBathrooms] = useState([]);
  const [unitClone, setUnitClone] = useState(1);
  const [unitDetails, setUnitDetails] = useState([]);
  // console.log('form===', form);
  // ---------------------------- static --------------------------------------

  const [showApprovals, setShowApprovals] = useState(false);
  const [addApprovalCount, setAddApprovalCount] = useState(0);
  const maxAddApprovalCount = 3; // Set the maximum limit here

  const handleAddApprovalClick = () => {
    setAddApprovalCount((prevCount) => prevCount + 1);

    if (addApprovalCount < maxAddApprovalCount) {
      setShowApprovals(true);
      const newApprovals = [...approvals, { key: approvals.length + 1 }];
      setApprovals(newApprovals);
    }
  };

  // ---------------------------- static --------------------------------------

  //get Approval Authority
  const getApprovalAuthority = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('approval-authority');
      console.log('get approval-authority===', res);
      if (res?.data?.status) {
        const filter = res?.data?.data.filter((item) => item.city_code == formState.city_code);
        console.log('filter', filter);
        setApprovalTypes(filter);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  //get Community Types
  const getCommunityTypes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('communityTypes');
      console.log('get Community Types===', res);
      if (res?.data?.status) {
        setCommunities(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  //get Saleable Area Representation
  const getSaleableArea = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('saleable-area-representation');
      console.log('get Saleable Areas=====', res);
      if (res?.data?.status) {
        setSaleableArea(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  //get Property Facing
  const getPropertyFacing = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertyfacing');
      console.log('get Property Facings===', res);
      if (res?.data?.status) {
        setPropertyFacing(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  //get BHK Sizes
  const getBHKsizes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('bhksizes');
      console.log('get BHK sizes===', res);
      if (res?.data?.status) {
        setBhkSize(res?.data?.data);

      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  // get property sizes

  const getPropertySizes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('/propertysizes');
      if (res.data?.status) {
        setPropertySize(res.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, formIndex) => {
    const { name, value } = e.target;
    console.log('form', form);
    console.log('e.target.dataset.id', e.target.dataset.id);

    if (e.target.dataset.id === 'unitDetailsData') {
      // if (e.target.name == 'floor_plan_path') {
      // }
      let updatedUnitDetails;
      if (unitDetails.length === 0 || formIndex >= unitDetails.length) {
        updatedUnitDetails = [...unitDetails, { [name]: value }];
      } else {
        updatedUnitDetails = unitDetails.map((item, index) => {
          if (index === formIndex) {
            return { ...item, [name]: value };
          }
          return item;
        });
      }
      setUnitDetails(updatedUnitDetails);
      setForm((prevForm) => ({ ...prevForm, unitDetails: updatedUnitDetails }));
      console.log('unitDetails===', unitDetails);
    } else {
      console.log('name, value ', name, value);
      setForm((prev) => ({ ...prev, [name]: value }));
      // setForm({ ...form, [name]: value });
    }
  };

  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    console.log('resFromMiddleware===', resFromMiddleware);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        console.log('index===', index);
        setForm((prev) => ({
          ...prev,
          unitDetails: prev.unitDetails.map((unit, i) =>
            i == index
              ? { ...unit, [e.target.name]: resFromMiddleware.data.original_image_url }
              : unit
          )
        }));
        setUnitDetails(
          unitDetails.map((unit, i) =>
            i == index
              ? { ...unit, [e.target.name]: resFromMiddleware.data.original_image_url }
              : unit
          )
        );
      } else {
        setForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.original_image_url
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  };

  console.log('form', form);

  const handleCalEstPr = (i) => {
    console.log('form?.unitDetails[i]', form?.unitDetails);
    const updatedUnitDetails = calculateTotalEstimatePrice(form?.unitDetails);
    setForm((prevForm) => ({ ...prevForm, ...formState, unitDetails: updatedUnitDetails }));
  };

  const calculateTotalEstimatePrice = useCallback((unitDetails) => {
    console.log();
    console.log('its a function to make arithmetic', unitDetails);
    console.log('its a function to make arithmetic', typeof unitDetails);

    const updatedUnitDetails = unitDetails.map((unit) => {
      const totalBasePrice = Number(unit.total_base_price) || 0;
      const amenitiesCharges = Number(unit.amenities_charges) || 0;
      const carParkingCharges = Number(unit.car_parking_charges) || 0;
      const clubHouseCharges = Number(unit.club_house_charges) || 0;
      const corpusFund = Number(unit.corpus_fund) || 0;
      const advanceMaintenanceCharges = Number(unit.advance_maintenance_charges) || 0;
      const legalCharges = Number(unit.legal_charges) || 0;
      const others1Charges = Number(unit.others_1_charges) || 0;
      const others2Charges = Number(unit.others_2_charges) || 0;

      const totalEstimatePrice =
        totalBasePrice +
        amenitiesCharges +
        carParkingCharges +
        clubHouseCharges +
        corpusFund +
        advanceMaintenanceCharges +
        legalCharges +
        others1Charges +
        others2Charges;

      const percentage = Math.round(totalEstimatePrice * 0.05);
      const registrationChargePercentage = Math.round(totalEstimatePrice * 0.061);

      // Return the updated unit object
      return {
        ...unit,
        estimated_total_price: totalEstimatePrice,
        registration_charges: registrationChargePercentage,
        gst_charges: percentage
      };
    });

    // Return the updated unit details array
    return updatedUnitDetails;
  }, []);

  useEffect(() => {
    if (form.unitDetails.length > 0) {
      // Calculate the updated unit details array
      console.log('form.unitDetails', form.unitDetails);
      const updatedUnitDetails = calculateTotalEstimatePrice(form.unitDetails);

      // Update the state with the calculated values
      // setForm((prevForm) => ({ ...prevForm, ...formState, unitDetails: updatedUnitDetails }));
    }
  }, [form.unitDetails, formState]);

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (form.approval_authority === 'default' || !form.approval_authority) {
      errors.approval_authority = 'Approval Authority is required';
      isValid = false;
    }

    if (!form.approval_number) {
      errors.approval_number = 'Approval Number is required';
      isValid = false;
    }
    if (!form.approval_year) {
      errors.approval_year = 'Approval Year is required';
      isValid = false;
    }
    if (!form.approval_document_path) {
      errors.approval_document_path = 'Approval Document is required';
      isValid = false;
    }
    if (!form.real_estate_authority) {
      errors.real_estate_authority = 'Real Estate Authority is required';
      isValid = false;
    }
    if (!form.real_estate_approval_number) {
      errors.real_estate_approval_number = 'Real Estate Approval Number is required';
      isValid = false;
    }
    if (!form.real_estate_approval_year) {
      errors.real_estate_approval_year = 'Real Estate Approval Year is required';
      isValid = false;
    }
    if (!form.real_estate_approval_document_path) {
      errors.real_estate_approval_document_path = 'Real Estate Approval Document is required';
      isValid = false;
    }
    if (!form.total_project_land_area) {
      errors.total_project_land_area = 'Total Project Land Area is required';
      isValid = false;
    }
    if (!form.total_project_land_area_size_id) {
      errors.total_project_land_area_size_id = 'Total Project Land Area Size is required';
      isValid = false;
    }
    if (!form.totalNumberOfBlocks && subType == '7') {
      errors.totalNumberOfBlocks = 'Total Number Of Blocks is required';
      isValid = false;
    }
    if (!form.numberOfFloorsBlocks && subType == '7') {
      errors.numberOfFloorsBlocks = 'Number Of Floors/Block is required';
      isValid = false;
    }
    if (!form.totalNumberOfUnits && subType == '7') {
      errors.totalNumberOfUnits = 'Total Number Of Units is required';
      isValid = false;
    }
    if (!form.project_layout_document_path) {
      errors.project_layout_document_path = 'Project Layout Plan is required';
      isValid = false;
    }
    if (!form.community_type_id && (subType !== "13" && subType !== "15")) {
      errors.community_type_id = 'Community Type is required';
      isValid = false;
    }
    if (!form.property_size_representation_id && subType != "9") {
      errors.property_size_representation_id = 'Property Size Representation is required';
      isValid = false;
    }
    if (!form.property_min_size) {
      errors.property_min_size = 'Property Min Size is required';
      isValid = false;
    }
    if (!form.property_max_size) {
      errors.property_max_size = 'Property Max Size is required';
      isValid = false;
    }
    if (!form.sizeRepresentation) {
      errors.sizeRepresentation = 'Size Representation is required';
      isValid = false;
    }
    if (!form.project_description) {
      errors.project_description = 'Project Description is required';
      isValid = false;
    }
    if (!form.unitDetails || form.unitDetails.length === 0) {
      errors.unitDetailsError = 'UnitDetails is Required';
      isValid = false;
    }

    if (form.unitDetails) {
      errors.unitDetails = []; // Initialize as an array

      form.unitDetails.forEach((unit, index) => {
        let unitErrors = {};

        if (!unit.property_facing_id || unit.property_facing_id === 'default') {
          unitErrors['property_facing_id'] = 'Property Facing is required';
          isValid = false;
        }
        if (!unit.property_bhk_size_id && subType == '7') {
          unitErrors['property_bhk_size_id'] = 'Property BHK Size is required';
          isValid = false;
        }
        if (!unit.super_built_up_area && subType !== "9") {
          unitErrors['super_built_up_area'] = 'Super Built Up Area is required';
          isValid = false;
        }
        if (!unit.carpet_area && subType !== "9") {
          unitErrors['carpet_area'] = 'Carpet Area is required';
          isValid = false;
        }
        if (!unit.car_parkings && subType !== "9") {
          unitErrors['car_parkings'] = 'Car Parking is required';
          isValid = false;
        }
        if (!unit.balconies && subType !== "9") {
          unitErrors['balconies'] = 'Balconies are required';
          isValid = false;
        }
        if (!unit.bathrooms && subType !== "9") {
          unitErrors['bathrooms'] = 'Bathrooms are required';
          isValid = false;
        }
        if (!unit.uds && subType == '7') {
          unitErrors['uds'] = 'UDS is required';
          isValid = false;
        }
        if (!unit.property_uds_size_id && subType == '7') {
          unitErrors['property_uds_size_id'] = 'UDS Unit is required';
          isValid = false;
        }
        if (!unit.floor_plan_path) {
          unitErrors['floor_plan_path'] = 'Floor Plan is required';
          isValid = false;
        }
        if (!unit.villatype && subType == '8') {
          unitErrors['villa_type'] = 'Villa Type is required';
          isValid = false;
        }
        if (!unit.plot_size && (subType == '8' || subType == "9")) {
          unitErrors['plot_size'] = 'Plot Size is required';
          isValid = false;
        }
        if (!unit.plot_length && (subType == '8' || subType == "9")) {
          unitErrors['plot_length'] = 'Plot length is required';
          isValid = false;
        }
        if (!unit.plot_breadth && (subType == '8' || subType == "9")) {
          unitErrors['plot_breadth'] = 'Plot breadth is required';
          isValid = false;
        }

        if (!unit.base_price) {
          unitErrors['base_price'] = 'Base Price is required';
          isValid = false;
        }
        if (!unit.total_base_price) {
          unitErrors['total_base_price'] = 'Total Base Price is required';
          isValid = false;
        }

        if (!unit.car_parking_charges && subType !== "9") {
          unitErrors['car_parking_charges'] = 'Car Parking Charges are required';
          isValid = false;
        }
        if (!unit.club_house_charges && (subType !== "13" && subType !== "15")) {
          unitErrors['club_house_charges'] = 'Club House Charges are required';
          isValid = false;
        }
        if (!unit.corpus_fund) {
          unitErrors['corpus_fund'] = 'Corpus Fund is required';
          isValid = false;
        }
        if (!unit.advance_maintenance_charges) {
          unitErrors['advance_maintenance_charges'] = 'Advance Maintenance Charges are required';
          isValid = false;
        }
        if (!unit.advance_maintenance_for_months) {
          unitErrors['advance_maintenance_for_months'] =
            'Advance Maintenance For Months is required';
          isValid = false;
        }

        if (Object.keys(unitErrors).length > 0) {
          errors.unitDetails[index] = unitErrors;
        }
      });
    }

    if (!form.floorRaising && !subType == '8') {
      errors.floorRaising = 'Floor Raising is required';
      isValid = false;
    }
    if (!form.preffered_location_charges_facing_per_sft) {
      errors.preffered_location_charges_facing_per_sft =
        'Preferred Location Charges (Facing per sqft) are required';
      isValid = false;
    }
    if (!form.preffered_location_charges_corner_per_sft) {
      errors.preffered_location_charges_corner_per_sft =
        'Preferred Location Charges (Corner per sqft) are required';
      isValid = false;
    }
    if (!form.months && subType == '7') {
      errors.months = 'Months are required';
      isValid = false;
    }

    console.log('errors', errors);
    console.log('errors', JSON.stringify(errors, null, 2));
    setFormError(errors);
    return isValid;
  };

  const blurValidation = (e, i) => {
    let newErrors = {};
    if (e.target.name === 'property_max_size') {
      console.log('blurred on max size');
      let minSizeValue = form.property_min_size;
      if (Number(e.target.value) < Number(minSizeValue)) {
        newErrors = { ...newErrors, property_max_size: 'Max size should be greater than min size' };
      } else {
        newErrors = { ...newErrors, property_max_size: '' };
      }
    }

    if (e.target.name === 'property_bhk_size_id') {
      let bhkValue = bhkSize.find((item) => item.id == e.target.value);
      setAttributes({
        minSize: bhkValue?.min_size,
        maxSize: bhkValue?.max_size,
        bathrooms: bhkValue?.no_of_bathrooms,
        balconies: bhkValue?.no_of_balconies,
        car_parkings: bhkValue?.no_of_parkings
      });
    }

    if (e.target.name == 'plot_size') {


      if (!(
        Number(e.target.value) >= Number(form.property_min_size) &&
        Number(e.target.value) <= Number(form.property_max_size)
      )) {

        newErrors = {
          ...newErrors,
          plot_size: `The value is not within the range specified by property min and max sizes`
        };

      } else {

        newErrors = {
          ...newErrors,
          plot_size: ""
        };
      }
    }



    if (e.target.name == 'super_built_up_area') {
      let minSize = attributes.minSize;
      let maxSize = attributes.maxSize;

      console.log('super', minSize, maxSize);

      if (
        !(Number(e.target.value) >= minSize && Number(e.target.value) <= maxSize) &&
        subType == '7'
      ) {
        newErrors = {
          ...newErrors,
          super_built_up_area: `Super built up area should be between ${minSize} and ${maxSize}`
        };
      } else if (
        !(
          Number(e.target.value) >= Number(form.property_min_size) &&
          Number(e.target.value) <= Number(form.property_max_size)
        )
      ) {
        console.log('form error', Number(form.property_min_size));

        newErrors = {
          ...newErrors,
          super_built_up_area: `The value is not within the range specified by property min and max sizes`
        };
      } else {
        newErrors = {
          ...newErrors,
          super_built_up_area: ''
        };
      }
    }

    if (e.target.name == 'carpet_area') {
      if (Number(form.unitDetails[i].super_built_up_area) < Number(e.target.value)) {
        newErrors = {
          ...newErrors,
          carpet_area: 'Carpet area should be less than super built up area'
        };
      } else {
        newErrors = {
          ...newErrors,
          carpet_area: ''
        };
      }
    }

    if (e.target.name == 'base_price') {
      if (form.property_size_representation_id == 9) {
        let basePrice = e.target.value;
        let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].super_built_up_area);
        setForm((prevForm) => ({
          ...prevForm,
          unitDetails: prevForm.unitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        }));

        setUnitDetails((prevUnitDetails) =>
          prevUnitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        );

        // form.total_base_price = totalBasePrice;
        console.log('total base price===', totalBasePrice);
      } else if (form.property_size_representation_id == 10) {
        let basePrice = e.target.value;
        let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].carpet_area);
        setForm((prevForm) => ({
          ...prevForm,
          unitDetails: prevForm.unitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        }));

        setUnitDetails((prevUnitDetails) =>
          prevUnitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        );

        console.log('total base price===', totalBasePrice);
      } else if (subType == "9") {


        let basePrice = e.target.value;
        let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].plot_size);
        setForm((prevForm) => ({
          ...prevForm,
          unitDetails: prevForm.unitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        }));

        setUnitDetails((prevUnitDetails) =>
          prevUnitDetails.map((unit, index) =>
            index === i ? { ...unit, total_base_price: totalBasePrice } : unit
          )
        );


      }
    }

    setFormError({ ...formError, ...newErrors });
  };

  const handleSubmit = () => {
    if (validate()) {
      dispatch(setProject(form));
      nextStep();
    } else {
      console.log(formError);
      toastError('Please Enter Mandatory fields');
    }
  };

  useEffect(() => {
    getApprovalAuthority();
    getCommunityTypes();
    getSaleableArea();
    getPropertyFacing();
    getBHKsizes();
    getPropertySizes();

    if (form.unitDetails.length > 0) {
      setUnitDetails(form?.unitDetails);
    }
  }, []);

  return (
    <div>
      {loading && <Loader />}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Approval Authorities</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="approval_authority"
                  required
                  onChange={handleChange}
                  value={form.approval_authority || ''}>
                  <option value="default">Approval Authority</option>
                  {approvalTypes.map((approve, index) => (
                    <option key={index} value={approve.name}>
                      {approve.name}
                    </option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Approval authority
                  <span className='req'>*</span>
                </label>
                {formError.approval_authority && (
                  <p className="text-danger">{formError.approval_authority}</p>
                )}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="approval-number"
                  className="form-control"
                  name="approval_number"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={form.approval_number || ''}
                />
                <label for="approval-number" className="fw-normal">
                  Approval Number
                </label>
              </div>
              {/* {formError.approval_number && (
                <p className="text-danger">{formError.approval_number}</p>
              )} */}
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="date"
                  id="year-of-approval"
                  className="form-control"
                  name="approval_year"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={form.approval_year || ''}
                />
                <label for="year-of-approval" className="fw-normal">
                  Year Of Approval
                </label>
              </div>
              {/* {formError.approval_year && <p className="text-danger">{formError.approval_year}</p>} */}
            </div>
            <div className="col">
              {form?.approval_document_path === undefined ? (
                <div className="form-floating">
                  <input
                    type="file"
                    id="bank-logo"
                    className="form-control"
                    name="approval_document_path"
                    accept="image/*"
                    required
                    onChange={handleImage}
                  />

                  <label for="project-type" className="fw-normal">
                    Upload Document
                  </label>
                </div>
              ) : (
                <div className="col-md-12 imgclass">
                  {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                  <img src={form?.approval_document_path} width="150" height="80" />
                  <button className="btn btn-danger removebtn">Delete Image</button>
                </div>
              )}
              {/* {formError.approval_document_path && (
                <p className="text-danger">{formError.approval_document_path}</p>
              )} */}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="real_estate_authority"
                  required
                  onChange={handleChange}
                  value={form.real_estate_authority || ''}>
                  <option value="default">Real Estate Authority</option>
                  <option value="RERA">RERA</option>
                  <option value="RERA 2">RERA 2</option>
                </select>
                <label for="size-representation" className="fw-normal">
                  Real-estate authority
                  <span className='req'>*</span>
                </label>
              </div>
              {formError.real_estate_authority && (
                <p className="text-danger">{formError.real_estate_authority}</p>
              )}
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="approval-number"
                  className="form-control"
                  name="real_estate_approval_number"
                  placeholder="Enter Enter"
                  required
                  value={form.real_estate_approval_number || ''}
                  onChange={handleChange}
                />
                <label for="approval-number" className="fw-normal">
                  Approval Number
                </label>
              </div>
              {/* {formError.real_estate_approval_number && (
                <p className="text-danger">{formError.real_estate_approval_number}</p>
              )} */}
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="date"
                  id="year-of-approval"
                  className="form-control"
                  name="real_estate_approval_year"
                  placeholder="Enter Enter"
                  required
                  value={form.real_estate_approval_year || ''}
                  onChange={handleChange}
                />
                <label htmlFor="year-of-approval" className="fw-normal">
                  Year Of Approval
                </label>
              </div>
              {/* {formError.real_estate_approval_year && (
                <p className="text-danger">{formError.real_estate_approval_year}</p>
              )} */}
            </div>
            <div className="col">
              {form?.real_estate_approval_document_path === undefined ? (
                <div className="form-floating">
                  <input
                    type="file"
                    id="bank-logo"
                    className="form-control"
                    name="real_estate_approval_document_path"
                    accept="image/*"
                    required
                    onChange={handleImage}
                  />
                  <label for="project-type" className="fw-normal">
                    Upload Document
                  </label>
                </div>
              ) : (
                <div className="col-md-12 imgclass">
                  {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                  <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                  <button className="btn btn-danger removebtn">Delete Image</button>
                </div>
              )}
              {/* {formError.real_estate_approval_document_path && (
                <p className="text-danger">{formError.real_estate_approval_document_path}</p>
              )} */}
            </div>
          </div>

          {showApprovals &&
            addApprovalCount == 1 &&
            approvals.map((approval, index) => (
              <div className="row mb-3" key={index}>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="approval-name"
                      className="form-control"
                      name="other_1_approval_name"
                      placeholder="Enter Enter"
                      required
                      onChange={handleChange}
                      value={form.other_1_approval_name || ''}
                    />
                    <label for="approval-name" className="fw-normal">
                      Enter Approval Name
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="approval-number"
                      className="form-control"
                      name="other_1_approval_number"
                      placeholder="Enter Enter"
                      required
                      onChange={handleChange}
                      value={form.other_1_approval_number || ''}
                    />
                    <label for="approval-number" className="fw-normal">
                      Approval Number
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="year-of-approval"
                      className="form-control"
                      name="other_1_approval_year"
                      placeholder="Enter Enter"
                      required
                      onChange={handleChange}
                      value={form.other_1_approval_year || ''}
                    />
                    <label for="year-of-approval" className="fw-normal">
                      Year Of Approval
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="file"
                      id="bank-logo"
                      className="form-control"
                      name="other_1_approval_document_path"
                      accept="image/*"
                      required
                      onChange={handleImage}
                    />
                    <label for="project-type" className="fw-normal">
                      Upload Document
                    </label>
                  </div>
                </div>
              </div>
            ))}
          {showApprovals &&
            addApprovalCount == 2 &&
            approvals.map((approval, index) => (
              <div className="row mb-3" key={index}>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="approval-name"
                      className="form-control"
                      name="other_2_approval_name"
                      placeholder="Enter Enter"
                      required
                      value={form.other_2_approval_name || ''}
                      onChange={handleChange}
                    />
                    <label for="approval-name" className="fw-normal">
                      Enter Approval Name
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="approval-number"
                      className="form-control"
                      name="other_2_approval_number"
                      placeholder="Enter Enter"
                      required
                      value={form.other_2_approval_number || ''}
                      onChange={handleChange}
                    />
                    <label for="approval-number" className="fw-normal">
                      Approval Number
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="year-of-approval"
                      className="form-control"
                      name="other_2_approval_year"
                      placeholder="Enter Enter"
                      required
                      value={form.other_2_approval_year || ''}
                      onChange={handleChange}
                    />
                    <label for="year-of-approval" className="fw-normal">
                      Year Of Approval
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="file"
                      id="bank-logo"
                      className="form-control"
                      name="other_2_approval_document_path"
                      accept="image/*"
                      required
                      onChange={handleImage}
                    />
                    <label for="project-type" className="fw-normal">
                      Upload Document
                    </label>
                  </div>
                </div>
              </div>
            ))}

          {showApprovals &&
            addApprovalCount == 3 &&
            approvals.map((approval, index) => (
              <div className="row mb-3" key={index}>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="approval-name"
                      className="form-control"
                      name="other_3_approval_name"
                      placeholder="Enter Enter"
                      required
                      value={form.other_3_approval_name || ''}
                      onChange={handleChange}
                    />
                    <label for="approval-name" className="fw-normal">
                      Enter Approval Name
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="approval-number"
                      className="form-control"
                      name="other_3_approval_number"
                      placeholder="Enter Enter"
                      required
                      value={form.other_3_approval_number || ''}
                      onChange={handleChange}
                    />
                    <label for="approval-number" className="fw-normal">
                      Approval Number
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="date"
                      id="year-of-approval"
                      className="form-control"
                      name="other_3_approval_year"
                      placeholder="Enter Enter"
                      required
                      value={form.other_3_approval_year || ''}
                      onChange={handleChange}
                    />
                    <label for="year-of-approval" className="fw-normal">
                      Year Of Approval
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="file"
                      id="bank-logo"
                      className="form-control"
                      name="other_3_approval_document_path"
                      accept="image/*"
                      required
                      onChange={handleImage}
                    />
                    <label for="project-type" className="fw-normal">
                      Upload Document
                    </label>
                  </div>
                </div>
                {/* <div className='col'>
                <p className='viewBtn'>View uploaded image</p>
              </div> */}
              </div>
            ))}

          {addApprovalCount < maxAddApprovalCount && (
            <div className="row mb-3">
              <div className="form-floating">
                <button className="btn btn-primary" onClick={handleAddApprovalClick}>
                  Add Other Approval
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Project Details</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-4">
              <div className="form-floating">
                <input
                  type="number"
                  id="total-project-landarea"
                  className="form-control"
                  name="total_project_land_area"
                  placeholder="Enter Enter"
                  required
                  value={form.total_project_land_area || ''}
                  onChange={handleChange}
                />
                <label for="total-project-landarea" className="fw-normal">
                  Total Project Land Area <span className='req'>*</span>
                </label>
              </div>
              {formError.total_project_land_area && (
                <p className="text-danger">{formError.total_project_land_area}</p>
              )}
            </div>
            <div className="col-4">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="total_project_land_area_size_id"
                  required
                  onChange={handleChange}
                  value={form.total_project_land_area_size_id || ''}>
                  <option value="Sq Ft">Select Land area representation</option>
                  {propertySize.map((item, index) => (
                    <option key={index} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Land area representation
                  <span className='req'>*</span>
                </label>
              </div>
              {formError.total_project_land_area_size_id && (
                <p className="text-danger">{formError.total_project_land_area_size_id}</p>
              )}
            </div>
          </div>

          {(subType === '7' || subType === '8' || subType === '9') && (
            <div className="row mb-3">
              <div className="col-4 mb-3">
                <div className="form-floating ">
                  <select
                    className="form-select"
                    name="community_type_id"
                    required
                    onChange={handleChange}
                    value={form.community_type_id || ''}>
                    <option value="default">Select Community Type</option>
                    {communitis.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label for="size-representation" className="fw-normal">
                    Community type
                    <span className='req'>*</span>
                  </label>
                  {formError.community_type_id && (
                    <p className="text-danger">{formError.community_type_id}</p>
                  )}
                </div>
              </div>

              {formError.totalNumberOfUnits && (
                <p className="text-danger">{formError.totalNumberOfUnits}</p>
              )}
            </div>
          )}

          {(subType === '7' || subType === '13' || subType === '15') && (
            <div className="row">
              <div className="col-4 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-no-of-blocks"
                    className="form-control"
                    name="totalNumberOfBlocks"
                    placeholder="Enter Enter"
                    required
                    value={form.totalNumberOfBlocks || ''}
                    onChange={handleChange}
                  />
                  <label for="total-no-of-blocks" className="fw-normal">
                    Total Number Of Blocks <span className='req'>*</span>
                  </label>
                </div>
                {formError.totalNumberOfBlocks && (
                  <p className="text-danger">{formError.totalNumberOfBlocks}</p>
                )}
              </div>
              <div className="col-4 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-no-of-floor-blocks"
                    className="form-control"
                    name="numberOfFloorsBlocks"
                    placeholder="Enter Enter"
                    required
                    value={form.numberOfFloorsBlocks || ''}
                    onChange={handleChange}
                  />
                  <label for="total-no-of-floor-blocks" className="fw-normal">
                    Number Of Floors/Block <span className='req'>*</span>
                  </label>
                </div>
                {formError.numberOfFloorsBlocks && (
                  <p className="text-danger">{formError.numberOfFloorsBlocks}</p>
                )}
              </div>
              <div className="col-4 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-number-of-units"
                    className="form-control"
                    name="totalNumberOfUnits"
                    placeholder="Enter Enter"
                    required
                    value={form.totalNumberOfUnits || ''}
                    onChange={handleChange}
                  />
                  <label for="total-number-of-units" className="fw-normal">
                    Total Number Of Units <span className='req'>*</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {subType === '8' && (
            <div className="row">
              <div className="col-4 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-number-of-units"
                    className="form-control"
                    name="totalNumberOfVillas"
                    placeholder="Enter Enter"
                    required
                    value={form.totalNumberOfVillas || ''}
                    onChange={handleChange}
                  />
                  <label for="total-number-of-units" className="fw-normal">
                    Total Number Of Villas
                  </label>
                </div>
              </div>
            </div>
          )}

          {subType === '9' && (

            <div className="row">
              <div className="col-4 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-number-of-units"
                    className="form-control"
                    name="total_no_of_units"
                    required
                    onChange={handleChange}
                    value={form.total_no_of_units || ''}
                  />
                  <label for="total-number-of-units" className="fw-normal">
                    Total Number Of untis
                  </label>
                </div>
              </div>
            </div>

          )}

          {/* <div className="row mb-3">
           
          </div> */}

          <div class="row">
            <h1 className="card-title mb-3 unitclass"> {subType == 13 ? "Mall Layout Plan" : subType == "15" ? "IT Park Layout Plan" : " Project Layout Plan"}</h1>

            <div class="col-4 mb-3">
              {form?.project_layout_document_path === undefined ? (
                <div className="form-floating mb-3">
                  <input
                    type="file"
                    id="project-layout-plan"
                    className="form-control"
                    name="project_layout_document_path"
                    accept="image/*"
                    required
                    onChange={handleImage}
                  />
                  <label for="project-layout-plan" className="fw-normal">
                    {subType == 13 ? "Mall Layout Plan" : " Project Layout Plan"}
                    <span className='req'>*</span>
                  </label>
                </div>
              ) : (
                <div className="col-md-12 imgclass">
                  {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                  <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                </div>
              )}
              {formError.project_layout_document_path && (
                <p className="text-danger">{formError.project_layout_document_path}</p>
              )}
            </div>
            {/* <div className="col-4 mb-3">
              <div className="form-floating">
                <input
                  type="file"
                  id="ebrochure"
                  className="form-control"
                  name="broucher_path"
                  accept="image/*"
                  required
                  onChange={handleImage}
                />
                <label for="file_path" className="fw-normal">
                  E-Brochure
                </label>
              </div>
            </div> */}
          </div>

          <div className="mb-3">
            <h1 className="card-title mb-3 unitclass">Description</h1>
            <CKEditor
              editor={ClassicEditor}
              name="project_description"
              data={form.project_description}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
              }}
              // value={form.project_description}
              onChange={(event, editor) => {
                const data = editor.getData();
                // projectDescription(data);
                setForm({ ...form, project_description: data });
                console.log({ event, editor, data });
              }}
            />

            {formError.project_description && (
              <p className="text-danger">{formError.project_description}</p>
            )}
          </div>

          <div className="row mb-3">
            <div className="row"></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Unit Sizes</h4>
        </div>
        <div className="card-body">
          {
            subType !== "9" && (


              <div className="row">
                <div className="form-floating mb-3 col-4">
                  <select
                    className="form-select"
                    name="property_size_representation_id"
                    required
                    onChange={handleChange}
                    value={form.property_size_representation_id || ''}>
                    <option value="default">Saleable Area Representation</option>
                    {saleableAres.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label for="size-representation" className="fw-normal">
                    Saleable area representation
                    <span className='req'>*</span>
                  </label>
                  {formError.property_size_representation_id && (
                    <p className="text-danger">{formError.property_size_representation_id}</p>
                  )}
                </div>
              </div>

            )
          }

          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <input
                  type="number"
                  id="flat-min-size"
                  className="form-control"
                  name="property_min_size"
                  placeholder="Enter Enter"
                  required
                  value={form.property_min_size || ''}
                  onChange={handleChange}
                />
                <label for="flat-min-size" className="fw-normal">
                  {subType == 7
                    ? 'Flat Size Min'
                    : subType == 9
                      ? 'Plot Size Min'
                      : subType == 8
                        ? 'Villa Size Min'
                        : 'Unit Size Min'} <span className='req'>*</span>
                </label>
              </div>
              {formError.property_min_size && (
                <p className="text-danger">{formError.property_min_size}</p>
              )}
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="number"
                  id="flat-max-size"
                  className="form-control"
                  name="property_max_size"
                  placeholder="Enter Enter"
                  required
                  value={form.property_max_size || ''}
                  onChange={handleChange}
                  onBlur={blurValidation}
                />
                <label for="flat-max-size" className="fw-normal">
                  {subType == 7
                    ? 'Flat Size Max'
                    : subType == 9
                      ? 'Plot Size Max'
                      : subType == 8
                        ? 'Villa Size Max'
                        : 'Unit Size Max'} <span className='req'>*</span>
                </label>
              </div>
              {formError.property_max_size && (
                <p className="text-danger">{formError.property_max_size}</p>
              )}
            </div>
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="sizeRepresentation"
                  required
                  onChange={handleChange}
                  value={form.sizeRepresentation || ''}>
                  <option value="default">Select Size Representation</option>
                  <option value="sq.ft">sq.ft</option>
                  <option value="sq.yards">sq.yards</option>

                </select>

                <label for="size-representation" className="fw-normal">
                  Size Representation
                  <span className='req'>*</span>
                </label>
              </div>
              {formError.sizeRepresentation && (
                <p className="text-danger">{formError.sizeRepresentation}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Unit Details</h4>
        </div>
        <div className="card-body">
          <Tabs>
            <TabList>
              {Array.from({ length: unitClone }).map((_, i) => (
                <Tab key={i}>{`unit - ${i + 1}`}</Tab>
              ))}
              {formState.listing_type_id == 1 && (
                <Tab className="btn plus-btn" onClick={() => setUnitClone(unitClone + 1)}>
                  Add Unit
                </Tab>
              )}
            </TabList>
            {Array.from({ length: unitClone }).map((_, i) => (
              <TabPanel key={i}>
                <div className="mt-3">
                  <h1 className="card-title mb-3 unitclass">Please enter unit - {i + 1} details</h1>
                  {formError.unitDetailsError && (
                    <p className="text-danger">{formError.unitDetailsError}</p>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-3 mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="property_facing_id"
                        data-id="unitDetailsData"
                        required
                        onChange={(e) => handleChange(e, i)}
                        value={
                          (form.unitDetails[i] && form.unitDetails[i]?.property_facing_id) || ''
                        }>
                        <option value="default">Select Facing</option>
                        {propertyFacing.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <label for="size-representation" className="fw-normal">
                        Select facing
                        <span className='req'>*</span>
                      </label>
                    </div>
                    {formError?.property_facing_id && (
                      <p className="text-danger">{formError?.property_facing_id}</p>
                    )}
                  </div>
                  {subType == '7' && (
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="property_bhk_size_id"
                          required
                          onChange={(e) => handleChange(e, i)}
                          data-id="unitDetailsData"
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.property_bhk_size_id) || ''
                          }
                          onBlur={blurValidation}>
                          <option value="default">Select BHK Size</option>
                          {bhkSize.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <label for="size-representation" className="fw-normal">
                          Select BHK Sizes <span className='req'>*</span>
                        </label>
                      </div>
                      {formError?.property_bhk_size_id && (
                        <p className="text-danger">{formError?.property_bhk_size_id}</p>
                      )}
                    </div>
                  )}
                  {subType == '8' && (
                    <div className="col-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="villatype"
                          required
                          data-id="unitDetailsData"
                          onChange={(e) => handleChange(e, i)}
                          value={(form.unitDetails[i] && form.unitDetails[i]?.villatype) || ''}>
                          <option value="default">Villa Type</option>
                          <option value="Duplex">Duplex</option>
                          <option value="Simplex">Simplex</option>
                          <option value="Triplex">Triplex</option>
                        </select>
                        <label for="size-representation" className="fw-normal">
                          Villa Type <span className='req'>*</span>
                        </label>
                      </div>
                      {formError.unitDetails?.[i]?.villa_type && (
                        <p className="text-danger">{formError.unitDetails?.[i]?.villa_type}</p>
                      )}
                    </div>
                  )}
                  {
                    subType == "8" && (
                      <div className=" row mb-3 ">
                        <div className="form-floating col-3">
                          <select
                            className="form-select"
                            name="property_bhk_size_id"
                            required
                            onChange={(e) => handleChange(e, i)}
                            data-id="unitDetailsData"
                            value={
                              (form.unitDetails[i] && form.unitDetails[i]?.property_bhk_size_id) || ''
                            }
                            onBlur={blurValidation}>
                            <option value="default">Bedrooms</option>
                            {bhkSize.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          <label for="size-representation" className="fw-normal">
                            Select BHK <span className='req'>*</span>
                          </label>
                        </div>
                        {formError?.property_bhk_size_id && (
                          <p className="text-danger">{formError?.property_bhk_size_id}</p>
                        )}
                      </div>
                    )
                  }
                  {(subType == '8' || subType == '9') && (
                    <div className="row mt-3">
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="plot_size"
                            placeholder="Enter Enter"
                            required
                            value={(form.unitDetails[i] && form.unitDetails[i]?.plot_size) || ''}
                            onChange={(e) => handleChange(e, i)}
                            onBlur={blurValidation}
                          />
                          <label for="super-buildup-area" className="fw-normal">
                            Plot Size <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.plot_size && (
                          <p className="text-danger">{formError.plot_size}</p>
                        )}
                      </div>
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            name="plot_size_representation"
                            required
                            onChange={handleChange}
                            value={form.plot_size_representation || ''}>
                            <option value="default">Select Size Representation</option>
                            <option value="sq.ft">sq.ft</option>
                            <option value="sq.yards">sq.yards</option>
                          </select>

                          <label for="size-representation" className="fw-normal">
                            Size Representation <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.plot_size_representation && (
                          <p className="text-danger">
                            {formError.unitDetails?.[i]?.plot_size_representation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(subType == '9' || subType == '8') && (
                    <div className="row">
                      <h5 className="fw-normal">Dimensions</h5>
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="plot_length"
                            placeholder="Enter Enter"
                            required
                            value={(form.unitDetails[i] && form.unitDetails[i]?.plot_length) || ''}
                            onChange={(e) => handleChange(e, i)}
                          />
                          <label for="super-buildup-area" className="fw-normal">
                            Length <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.plot_length && (
                          <p className="text-danger">{formError.unitDetails?.[i]?.plot_length}</p>
                        )}
                      </div>
                      <div className="flex flex-col col-1 ">
                        <h5 className=" ">×</h5>
                      </div>

                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="plot_breadth"
                            placeholder="Enter Enter"
                            required
                            value={(form.unitDetails[i] && form.unitDetails[i]?.plot_breadth) || ''}
                            onChange={(e) => handleChange(e, i)}
                          />
                          <label for="super-buildup-area" className="fw-normal">
                            Breadth
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.plot_breadth && (
                          <p className="text-danger">{formError.unitDetails?.[i]?.plot_breadth}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {(subType !== '9') && (
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="super_built_up_area"
                          placeholder="Enter Enter"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.super_built_up_area) || ''
                          }
                          onChange={(e) => handleChange(e, i)}
                          onBlur={(e) => blurValidation(e, i)}
                        />
                        <label for="super-buildup-area" className="fw-normal">
                          Super Build Up Area <span className='req'>*</span>
                        </label>
                      </div>
                      {formError?.super_built_up_area && (
                        <p className="text-danger">{formError?.super_built_up_area}</p>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="carpet_area"
                          placeholder="Enter Enter"
                          required
                          value={(form.unitDetails[i] && form.unitDetails[i]?.carpet_area) || ''}
                          onChange={(e) => handleChange(e, i)}
                          onBlur={(e) => blurValidation(e, i)}
                        />
                        <label for="carpet-area" className="fw-normal">
                          Carpet Area <span className='req'>*</span>
                        </label>
                      </div>
                      {formError?.carpet_area && (
                        <p className="text-danger">{formError?.carpet_area}</p>
                      )}
                    </div>
                  </div>
                )}

                {
                  subType !== "9" && (



                    <div className="row mb-3">
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            data-id="unitDetailsData"
                            name="car_parkings"
                            required
                            onChange={(e) => handleChange(e, i)}
                            value={(form.unitDetails[i] && form.unitDetails[i]?.car_parkings) || ''}>
                            <option value="default">Car Parking</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3 </option>
                          </select>
                          <label for="size-representation" className="fw-normal">
                            No.of Car Parkings <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.car_parkings && (
                          <p className="text-danger">{formError.unitDetails?.[i]?.car_parkings}</p>
                        )}
                      </div>
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            data-id="unitDetailsData"
                            name="balconies"
                            required
                            onChange={(e) => handleChange(e, i)}
                            value={(form.unitDetails[i] && form.unitDetails[i]?.balconies) || ''}>
                            <option value="default">Balconies</option>

                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                          <label for="size-representation" className="fw-normal">
                            No.of balconies <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.balconies && (
                          <p className="text-danger">{formError.unitDetails[i]?.balconies}</p>
                        )}
                      </div>
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            data-id="unitDetailsData"
                            name="bathrooms"
                            required
                            onChange={(e) => handleChange(e, i)}
                            value={(form.unitDetails[i] && form.unitDetails[i]?.bathrooms) || ''}>
                            <option value="default">Bathrooms</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3 </option>
                          </select>
                          <label for="size-representation" className="fw-normal">
                            No.of bathrooms <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.bathrooms && (
                          <p className="text-danger">{formError.unitDetails?.[i]?.bathrooms}</p>
                        )}
                      </div>
                    </div>
                  )
                }
                {subType == '7' && (
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="uds"
                          placeholder="Enter Enter"
                          required
                          onChange={(e) => handleChange(e, i)}
                          value={(form.unitDetails[i] && form.unitDetails[i]?.uds) || ''}
                        />
                        <label for="uds" className="fw-normal">
                          UDS
                        </label>
                      </div>
                      {formError.unitDetails?.[i]?.uds && (
                        <p className="text-danger">{formError?.unitDetails?.uds}</p>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          data-id="unitDetailsData"
                          name="property_uds_size_id"
                          required
                          onChange={(e) => handleChange(e, i)}
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.property_uds_size_id) || ''
                          }>
                          <option value="1">UDS Unit</option>
                          <option value="2">Sq</option>
                          <option value="3">Sq Meter</option>
                          <option value="4">Sq Yard</option>
                        </select>
                        <label for="size-representation" className="fw-normal">
                          Select Uds Units
                        </label>
                      </div>
                      {formError.property_uds_size_id && (
                        <p className="text-danger">{formError.property_uds_size_id}</p>
                      )}
                    </div>
                    {/* <div className="col-3 mb-3">
                    <div className="form-floating">
                      <input
                        type="file"
                        data-id="unitDetailsData"
                        className="form-control"
                        name="floor_plan_path"
                        accept="image/*"
                        required
                        onChange={(e) => handleImage(e, i)}
                      />
                      <label for="project-type" className="fw-normal">
                        Floor Plan
                      </label>
                    </div>
                    {formError.floor_plan_path && (
                      <p className="text-danger">{formError.floor_plan_path}</p>
                    )}
                  </div> */}
                  </div>
                )}

                <div className="Subcard">
                  <div>
                    <h1 class="unitclass">
                      {subType == '7' || subType == '8'
                        ? '(Floor Plan)'
                        : subType == '9'
                          ? 'Plot Dimension Plan'
                          : 'Unit Plan'}{' '}
                    </h1>
                  </div>
                  {form.unitDetails[i]?.floor_plan_path === undefined ? (
                    <div className="row mb-3">
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="file"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="floor_plan_path"
                            accept="image/*"
                            required
                            onChange={(e) => handleImage(e, i)}
                          />
                          <label for="project-type" className="fw-normal">
                            {subType == '7' || subType == '8'
                              ? '(Floor Plan)'
                              : subType == '9'
                                ? 'Plot Plan'
                                : 'Unit Plan'}
                          </label>
                        </div>
                        {formError.unitDetails?.[i]?.floor_plan_path && (
                          <p className="text-danger">
                            {formError.unitDetails?.[i]?.floor_plan_path}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-12 imgclass">
                      {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                      <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                    </div>
                  )}
                </div>

                <div className="Subcard mt-3">
                  <div>
                    <h1 class="unitclass">Unit Pricing</h1>
                  </div>

                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          data-id="unitDetailsData"
                          name="currency"
                          required
                          onChange={(e) => handleChange(e, i)}
                          value={(form.unitDetails[i] && form.unitDetails[i]?.currency) || ''}>
                          <option value="default">Currency</option>
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    {/* {formError.currency && <p className="text-danger">{formError.currency}</p>} */}
                  </div>
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="base_price"
                          placeholder="Enter Base Price"
                          required
                          value={(form.unitDetails[i] && form.unitDetails[i]?.base_price) || ''}
                          onChange={(e) => handleChange(e, i)}
                          onBlur={(e) => blurValidation(e, i)}
                        />
                        <label for="base-price" className="fw-normal">
                          Base Price {subType == '7' || subType == '8' ? '(Per Sq Ft)' : ''} <span className='req'>*</span>
                        </label>
                      </div>
                      {formError.base_price && (
                        <p className="text-danger">{formError.base_price}</p>
                      )}
                    </div>
                    <div className="col-3 mb-3"></div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control clrinput clrinputlabel"
                          name="total_base_price"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.total_base_price) || ''
                          }
                          // onChange={(e) => handleChange(e, i)}
                          readOnly
                        />
                        <label for="total-base-price" className="fw-normal clrinputlabel">
                          Total Base Price
                        </label>
                      </div>
                      {formError.total_base_price && (
                        <p className="text-danger">{formError.total_base_price}</p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    {/* <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="amenities_charges"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.amenities_charges) || ''
                          }
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                        />
                        <label for="base-price" className="fw-normal">
                          Amenities Charges
                        </label>
                      </div>
                      {formError.amenities_charges && (
                        <p className="text-danger">{formError.amenities_charges}</p>
                      )}
                    </div> */}

                    <div>
                      <h1 class="unitclass mb-3">Amenities and other charges</h1>
                    </div>
                    {(subType !== "9") && (
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="car_parking_charges"
                            placeholder="Enter Base Price"
                            required
                            value={
                              (form.unitDetails[i] && form.unitDetails[i]?.car_parking_charges) ||
                              ''
                            }
                            onChange={(e) => handleChange(e, i)}
                            onBlur={handleCalEstPr}
                          />
                          <label for="car-parking-chargers" className="fw-normal">
                            Car Parking Charges <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.car_parking_charges && (
                          <p className="text-danger">{formError.car_parking_charges}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="row mb-3">
                    {(subType == '7' || subType == '8' || subType == '9') && (
                      <div className="col-3 mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control"
                            name="club_house_charges"
                            placeholder="Enter Base Price"
                            required
                            value={
                              (form.unitDetails[i] && form.unitDetails[i]?.club_house_charges) || ''
                            }
                            onChange={(e) => handleChange(e, i)}
                            onBlur={handleCalEstPr}
                          />
                          <label for="club-house-charges" className="fw-normal">
                            Club House Charges <span className='req'>*</span>
                          </label>
                        </div>
                        {formError.club_house_charges && (
                          <p className="text-danger">{formError.club_house_charges}</p>
                        )}
                      </div>
                    )}

                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="corpus_fund"
                          placeholder="Enter Base Price"
                          required
                          value={(form.unitDetails[i] && form.unitDetails[i]?.corpus_fund) || ''}
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                        />
                        <label for="corpus-fund" className="fw-normal">
                          Corpus Fund <span className='req'>*</span>
                        </label>
                      </div>
                      {formError.corpus_fund && (
                        <p className="text-danger">{formError.corpus_fund}</p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="advance_maintenance_charges"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] &&
                              form.unitDetails[i]?.advance_maintenance_charges) ||
                            ''
                          }
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                        />
                        <label for="maintenance-charges" className="fw-normal">
                          Maintenance Charges <span className='req'>*</span>
                        </label>
                      </div>
                      {formError.advance_maintenance_charges && (
                        <p className="text-danger">{formError.advance_maintenance_charges}</p>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          data-id="unitDetailsData"
                          name="advance_maintenance_for_months"
                          required
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                          value={
                            (form.unitDetails[i] &&
                              form.unitDetails[i]?.advance_maintenance_for_months) ||
                            ''
                          }>
                          <option value="1">For Months</option>
                          <option value="12">12 Months</option>
                          <option value="24">24 Months</option>
                          <option value="36">36 Months</option>
                        </select>
                        <label for="size-representation" className="fw-normal">
                          For Months <span className='req'>*</span>
                        </label>
                      </div>
                    </div>
                    {formError.advance_maintenance_for_months && (
                      <p className="text-danger">{formError.advance_maintenance_for_months}</p>
                    )}
                  </div>
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="others_1_charges_name"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.others_1_charges_name) ||
                            ''
                          }
                          onChange={(e) => handleChange(e, i)}
                        />
                        <label for="otherCharges1" className="fw-normal">
                          Other Charges 1
                        </label>
                      </div>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="others_1_charges"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.others_1_charges) || ''
                          }
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                        />
                        <label for="amount" className="fw-normal">
                          Amount
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="others_2_charges_name"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.others_2_charges_name) ||
                            ''
                          }
                          onChange={(e) => handleChange(e, i)}
                        />
                        <label for="otherCharges2" className="fw-normal">
                          Other Charges 2
                        </label>
                      </div>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="others_2_charges"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.others_2_charges) || ''
                          }
                          onChange={(e) => handleChange(e, i)}
                          onBlur={handleCalEstPr}
                        />
                        <label for="amount" className="fw-normal">
                          Amount
                        </label>
                      </div>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control clrinput"
                          name="estimated_total_price"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.estimated_total_price) ||
                            ''
                          }
                        />
                        <label for="legalCharges" className="fw-normal clrinputlabel">
                          Total Estimated Price
                        </label>
                      </div>
                      {formError.estimated_total_price && (
                        <p className="text-danger">{formError.estimated_total_price}</p>
                      )}
                    </div>
                    {/* <div className="col-3 mb-3">
                      <div className="form-floating">
                        <button className="btn btn-primary" onClick={handleCalEstPr}>
                          Calculate Price
                        </button>
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="row mb-3">
                    <div>
                      <h1 class="unitclass mb-3">Estimated GST and Other Statutory Charges</h1>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="gst_charges"
                          placeholder="Enter Base Price"
                          required
                          value={(form.unitDetails[i] && form.unitDetails[i]?.gst_charges) || ''}
                          onChange={(e) => handleChange(e, i)}
                        />
                        <label for="otherCharges2" className="fw-normal">
                          GST (Taxes)
                        </label>
                      </div>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="registration_charges"
                          placeholder="Enter Base Price"
                          required
                          value={
                            (form.unitDetails[i] && form.unitDetails[i]?.registration_charges) || ''
                          }
                          onChange={(e) => handleChange(e, i)}
                        />
                        <label for="amount" className="fw-normal">
                          Registration Charges
                        </label>
                      </div>
                    </div>
                    <div className="col-3 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
                          data-id="unitDetailsData"
                          className="form-control"
                          name="legal_charges"
                          placeholder="Enter Base Price"
                          required
                          value={(form.unitDetails[i] && form.unitDetails[i]?.legal_charges) || ''}
                          onChange={(e) => handleChange(e, i)}
                        />
                        <label for="legalCharges" className="fw-normal">
                          Legal Charges
                        </label>
                      </div>
                      {formError.legal_charges && (
                        <p className="text-danger">{formError.legal_charges}</p>
                      )}
                    </div>
                  </div> */}
                </div>
              </TabPanel>
            ))}
            <TabList>
              {Array.from({ length: unitClone }).map((_, i) => (
                <Tab key={i}>{`unit - ${i + 1}`}</Tab>
              ))}
              {formState.listing_type_id == 1 && (
                <Tab className="btn plus-btn" onClick={() => setUnitClone(unitClone + 1)}>
                  Add Unit
                </Tab>
              )}
            </TabList>
          </Tabs>
        </div>
      </div>

      {/* {Array.from({ length: unitClone }).map((_, i) =>
        <>
          <div>
            <h6>Unit #1</h6>
          </div>

          <div className="row mb-3">
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="property_facing_id" required onChange={handleChange}
                  value={form.property_facing_id || ''}
                >
                  <option value="default">Select Facing</option>
                  {propertyFacing.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Select facing
                </label>
              </div>
              {formError.property_facing_id && (
                <p className="text-danger">{formError.property_facing_id}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="property_bhk_size_id" required onChange={handleChange}
                  value={form.property_bhk_size_id || ''}
                  onBlur={blurValidation}
                >
                  <option value="default">Select BHK Size</option>
                  {bhkSize.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Select BHK Sizes
                </label>
              </div>
              {formError.property_bhk_size_id && (
                <p className="text-danger">{formError.property_bhk_size_id}</p>
              )}
            </div>

            <div className="col mb-3">
              <div className="form-floating">
                <input
                  type="number"
                  id="super-buildup-area"
                  className="form-control"
                  name="super_built_up_area"
                  placeholder="Enter Enter"
                  required
                  value={form.super_built_up_area || ''}
                  onChange={handleChange}
                  onBlur={blurValidation}
                />
                <label for="super-buildup-area" className="fw-normal">
                  Super Build Up Area
                </label>
              </div>
              {formError.super_built_up_area && (
                <p className="text-danger">{formError.super_built_up_area}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <input
                  type="number"
                  id="carpet-area"
                  className="form-control"
                  name="carpet_area"
                  placeholder="Enter Enter"
                  required
                  value={form.carpet_area || ''}
                  onChange={handleChange}
                  onBlur={blurValidation}
                />
                <label for="carpet-area" className="fw-normal">
                  Carpet Area
                </label>
              </div>
              {formError.carpet_area && (
                <p className="text-danger">{formError.carpet_area}</p>
              )}
            </div>

            <div className="col mb-3">
              <div className="form-floating">

                <select className="form-select" name="car_parkings" required onChange={handleChange}
                  value={form.car_parkings || ''}
                >
                  <option value="default">Car Parking</option>
                  {
                    Array.from({ length: attributes?.car_parkings }).map((_, i) =>
                      <option key={i} value={i + 1}>{i + 1}</option>
                    )
                  }
                </select>
                <label for="size-representation" className="fw-normal">
                  No.of Car Parkings
                </label>
              </div>
              {formError.car_parkings && (
                <p className="text-danger">{formError.car_parkings}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="balconies" required onChange={handleChange}
                  value={form.balconies || ''}
                >
                  <option value="default">Balconies</option>
                  {
                    Array.from({ length: attributes?.balconies }).map((_, i) =>
                      <option key={i} value={i + 1}>{i + 1}</option>
                    )
                  }
                </select>
                <label for="size-representation" className="fw-normal">
                  No.of balconies
                </label>
              </div>
              {formError.balconies && (
                <p className="text-danger">{formError.balconies}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="bathrooms" required onChange={handleChange}
                  value={form.bathrooms || ''}
                >
                  <option value="default">Bathrooms</option>
                  {
                    Array.from({ length: attributes?.bathrooms }).map((_, i) =>
                      <option key={i} value={i + 1}>{i + 1}</option>
                    )
                  }
                </select>
                <label for="size-representation" className="fw-normal">
                  No.of bathrooms
                </label>
              </div>
              {formError.bathrooms && (
                <p className="text-danger">{formError.bathrooms}</p>
              )}
            </div>

            <div className="col mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  id="uds"
                  className="form-control"
                  name="uds"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={form.uds || ''}
                />
                <label for="uds" className="fw-normal">
                  UDS
                </label>
              </div>
              {formError.uds && (
                <p className="text-danger">{formError.uds}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="property_uds_size_id" required onChange={handleChange}
                  value={form.property_uds_size_id || ''}
                >
                  <option value="1">UDS Unit</option>
                  <option value="2">Sq</option>
                  <option value="3">Sq Meter</option>
                  <option value="4">Sq Yard</option>
                </select>
                <label for="size-representation" className="fw-normal">
                  Select Uds Units
                </label>
              </div>
              {formError.property_uds_size_id && (
                <p className="text-danger">{formError.property_uds_size_id}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <input
                  type="file"
                  id="bank-logo"
                  className="form-control"
                  name="floor_plan_path"
                  accept="image/*"
                  required
                  onChange={handleImage}
                />
                <label for="project-type" className="fw-normal">
                  Floor Plan
                </label>
              </div>
              {formError.floor_plan_path && (
                <p className="text-danger">{formError.floor_plan_path}</p>
              )}
            </div>
            <div className="col mb-3">
              <div className="form-floating">
                <select className="form-select" name="currency" required onChange={handleChange}
                  value={form.currency || ''}
                >
                  <option value="default">Currency</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            {formError.currency && (
              <p className="text-danger">{formError.currency}</p>
            )}
          </div>

          <div className='Subcard'>
            <div>
              <h6>Unit Pricing</h6>
            </div>


            <div className="row mb-3">
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="base-price"
                    className="form-control"
                    name="base_price"
                    placeholder="Enter Base Price"
                    required
                    value={form.base_price || ''}
                    onChange={handleChange}
                    onBlur={blurValidation}
                  />
                  <label for="base-price" className="fw-normal">
                    Base Price (Per Sq Ft)
                  </label>
                </div>
                {formError.base_price && (
                  <p className="text-danger">{formError.base_price}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="total-base-price"
                    className="form-control"
                    name="total_base_price"
                    placeholder="Enter Base Price"
                    required
                    value={form.total_base_price || ''}
                    onChange={handleChange}
                    readOnly
                  />
                  <label for="total-base-price" className="fw-normal">
                    Total Base Price
                  </label>
                </div>
                {formError.total_base_price && (
                  <p className="text-danger">{formError.total_base_price}</p>
                )}
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="base-price"
                    className="form-control"
                    name="amenities_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.amenities_charges || ''}
                    onChange={handleChange}

                  />
                  <label for="base-price" className="fw-normal">
                    Amenities Charges
                  </label>
                </div>
                {formError.amenities_charges && (
                  <p className="text-danger">{formError.amenities_charges}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="car-parking-chargers"
                    className="form-control"
                    name="car_parking_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.car_parking_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="car-parking-chargers" className="fw-normal">
                    Car Parking Charges
                  </label>
                </div>
                {formError.car_parking_charges && (
                  <p className="text-danger">{formError.car_parking_charges}</p>
                )}
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="club-house-charges"
                    className="form-control"
                    name="club_house_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.club_house_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="club-house-charges" className="fw-normal">
                    Club House Charges
                  </label>
                </div>
                {formError.club_house_charges && (
                  <p className="text-danger">{formError.club_house_charges}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="corpus-fund"
                    className="form-control"
                    name="corpus_fund"
                    placeholder="Enter Base Price"
                    required
                    value={form.corpus_fund || ''}
                    onChange={handleChange}
                  />
                  <label for="corpus-fund" className="fw-normal">
                    Corpus Fund
                  </label>
                </div>
                {formError.corpus_fund && (
                  <p className="text-danger">{formError.corpus_fund}</p>
                )}
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="maintenance-charges"
                    className="form-control"
                    name="advance_maintenance_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.advance_maintenance_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="maintenance-charges" className="fw-normal">
                    Maintenance Charges
                  </label>
                </div>
                {formError.advance_maintenance_charges && (
                  <p className="text-danger">{formError.advance_maintenance_charges}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <select className="form-select" name="advance_maintenance_for_months" required onChange={handleChange}
                    value={form.advance_maintenance_for_months || ''}
                  >
                    <option value="1">For Months</option>
                    <option value="2">12 Months</option>
                    <option value="3">24 Months</option>
                    <option value="4">36 Months</option>
                  </select>
                  <label for="size-representation" className="fw-normal">
                    For Months
                  </label>
                </div>
              </div>
              {formError.advance_maintenance_for_months && (
                <p className="text-danger">{formError.advance_maintenance_for_months}</p>
              )}

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="legalCharges"
                    className="form-control"
                    name="legal_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.legal_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="legalCharges" className="fw-normal">
                    Legal Charges
                  </label>
                </div>
                {formError.legal_charges && (
                  <p className="text-danger">{formError.legal_charges}</p>
                )}
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    id="legalCharges"
                    className="form-control"
                    name="others_1_charges_name"
                    placeholder="Enter Base Price"
                    required
                    value={form.others_1_charges_name || ''}
                    onChange={handleChange}
                  />
                  <label for="otherCharges1" className="fw-normal">
                    Other Charges 1
                  </label>
                </div>

              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    name="others_1_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.others_1_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="amount" className="fw-normal">
                    Amount
                  </label>
                </div>
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    id="legalCharges"
                    className="form-control"
                    name="others_2_charges_name"
                    placeholder="Enter Base Price"
                    required
                    value={form.others_2_charges_name || ''}
                    onChange={handleChange}
                  />
                  <label for="otherCharges2" className="fw-normal">
                    Other Charges 2
                  </label>
                </div>
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    name="others_2_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.others_2_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="amount" className="fw-normal">
                    Amount
                  </label>
                </div>
              </div>

              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="legalCharges"
                    className="form-control"
                    name="gst_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.gst_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="otherCharges2" className="fw-normal">
                    GST (Taxes)
                  </label>
                </div>
                {formError.gst_charges && (
                  <p className="text-danger">{formError.gst_charges}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    name="registration_charges"
                    placeholder="Enter Base Price"
                    required
                    value={form.registration_charges || ''}
                    onChange={handleChange}
                  />
                  <label for="amount" className="fw-normal">
                    Registration Charges
                  </label>
                </div>
                {formError.registration_charges && (
                  <p className="text-danger">{formError.registration_charges}</p>
                )}
              </div>
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    id="legalCharges"
                    className="form-control"
                    name="estimated_total_price"
                    placeholder="Enter Base Price"
                    required
                    value={form.estimated_total_price || ''}
                  />
                  <label for="legalCharges" className="fw-normal">
                    Total Estimated Price
                  </label>
                </div>
                {formError.estimated_total_price && (
                  <p className="text-danger">{formError.estimated_total_price}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )} */}

      <div className="card">
        <div className="card-header">
          <h6>Preferred Location Charges</h6>
        </div>
        <div className="card-body">
          {(subType !== '8' && subType !== "9") && (
            <div className="row mb-3">
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="text"
                    id="floor-raising"
                    className="form-control"
                    name="floorRaising"
                    placeholder="Enter Base Price"
                    required
                    value={form.floorRaising || ''}
                    onChange={handleChange}
                  />
                  <label for="floor-raising" className="fw-normal">
                    Floor Raising Charges per sft
                  </label>
                </div>
                {formError.floorRaising && <p className="text-danger">{formError.floorRaising}</p>}
              </div>

              <div className="col-3">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="months"
                    required
                    onChange={handleChange}
                    value={form.months || ''}>
                    <option value="default">Valid From</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <label for="size-representation" className="fw-normal">
                    Valid from floor
                  </label>
                </div>
                {formError.months && <p className="text-danger">{formError.months}</p>}
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-3">
              <div className="form-floating">
                <input
                  type="text"
                  id="east-facing"
                  className="form-control"
                  name="preffered_location_charges_facing_per_sft"
                  placeholder="Enter Base Price"
                  required
                  value={form.preffered_location_charges_facing_per_sft || ''}
                  onChange={handleChange}
                />
                <label for="east-facing" className="fw-normal">
                  East Facing Charges Per sft
                </label>
              </div>
              {formError.preffered_location_charges_facing_per_sft && (
                <p className="text-danger">{formError.preffered_location_charges_facing_per_sft}</p>
              )}
            </div>
            <div className="col-3">
              <div className="form-floating">
                <input
                  type="text"
                  id="corner"
                  className="form-control"
                  name="preffered_location_charges_corner_per_sft"
                  placeholder=""
                  required
                  value={form.preffered_location_charges_corner_per_sft || ''}
                  onChange={handleChange}
                />
                <label for="corner" className="fw-normal">
                  Corner Unit Charges per sft
                </label>
              </div>
              {formError.preffered_location_charges_corner_per_sft && (
                <p className="text-danger">{formError.preffered_location_charges_corner_per_sft}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mb-3">
        <button className="btn btn-primary">Add PLC</button>
      </div> */}
      <div className="btnParent">
        <button className="btn customBtn" onClick={prevStep}>
          Previous
        </button>
        <button className="btn customBtn" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
