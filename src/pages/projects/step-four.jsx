import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { masterClient } from '../../utils/httpClient';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';

import { setProject } from '../../store/slices/ProjectManagementSlice';
import { handleImages3 } from '../../utils/S3Handler';
import { FaFilePdf } from "react-icons/fa6";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const StepFour = ({ nextStep, prevStep, type, subType }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.projectManagement['project']);

  const [loading, setLoading] = useState(false);
  const [sgalleryHeader, setgalleryHeader] = useState([]);
  const [formError, setFormError] = useState({});
  const [form, setForm] = useState({ ...formState });
  const [fileArray, setFileArray] = useState([]);
  const [imgarr, setimageArray] = useState(null);
  // const [imagesObj, setImagesObj] = useState({});
  const [imgView, setImgView] = useState([]);

  // image preview start
  const [file, setFile] = useState(null);
  function handleFileChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }


  const [file1, setFile1] = useState();
  function handleFileChange1(e) {
    console.log(e.target.files);
    setFile1(URL.createObjectURL(e.target.files[0]));
  }

  const [file2, setFile2] = useState();
  function handleFileChange2(e) {
    console.log(e.target.files);
    setFile2(URL.createObjectURL(e.target.files[0]));
  }

  const [file3, setFile3] = useState();
  function handleFileChange3(e) {
    console.log(e.target.files);
    setFile3(URL.createObjectURL(e.target.files[0]));
  }

  const [file4, setFile4] = useState();
  function handleFileChange4(e) {
    console.log(e.target.files);
    setFile4(URL.createObjectURL(e.target.files[0]));
  }

  const [file5, setFile5] = useState();
  function handleFileChange5(e) {
    console.log(e.target.files);
    setFile5(URL.createObjectURL(e.target.files[0]));
  }

  const [file6, setFile6] = useState();
  function handleFileChange6(e) {
    console.log(e.target.files);
    setFile6(URL.createObjectURL(e.target.files[0]));
  }

  const [file7, setFile7] = useState();
  function handleFileChange7(e) {
    console.log(e.target.files);
    setFile7(URL.createObjectURL(e.target.files[0]));
  }

  // image preview end

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const dynamicImagesUploads = async (e, type, imageNum) => {
  //   setLoading(true);
  //   let resFromMiddleware = await handleImages3(e);
  //   console.log('jhvjhgh', resFromMiddleware);
  //   if (resFromMiddleware.clientStatus) {
  //     setImagesObj({
  //       ...imagesObj,
  //       [type + imageNum]: resFromMiddleware.data.original_image_url
  //     });
  //   }
  //   setLoading(false);
  // };
  // console.log('=======', imagesObj);



  const handleImage = async (e, headerName) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    console.log('resFromMiddleware===', resFromMiddleware);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      // let fileArrayData = [...fileArray];
      if (e.target.name === 'broucher_path') {
        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: resFromMiddleware.data.original_file_url
        }));
      } else {
        let fileArrayData = [
          ...fileArray,
          { headId: e.target.id, id: resFromMiddleware.data.original_image_url }
        ];
        // fileArrayData.push({ headId: e.target.id, id: resFromMiddleware.data.original_image_url });
        // setFileArray(fileArrayData);
        setFileArray(fileArrayData);
        // setFileArray(())
        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: fileArrayData
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  };

  const getImageUrls = (id) => {
    const matchedItems = fileArray.filter((item) => item.headId === id);
    console.log(
      'imageUrls',
      matchedItems.map((item) => item.id)
    );
    setImgView((prevState) => ({
      ...prevState,
      [id]: matchedItems.map((item) => item.id)
    }));
    console.log('imgView', imgView);
  };

  // const removeImage = (e, id, imageNum) => {
  //   console.log('=======', imagesObj);

  //   console.log('resimagurl----------------', id + imageNum);
  //   setImagesObj({
  //     ...imagesObj,
  //     [id + imageNum]: ''
  //   });
  // };

  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form?.file_path?.[0]?.id) {
      error.file_path0 = 'Image is required';
      isValid = false;
    }
    if (!form?.broucher_path) {
      error.broucher_path = 'Broucher is required';
      isValid = false;
    }
    // if (!form?.file_path?.[1]?.id) {
    //   error.file_path1 = 'Image is required';
    //   isValid = false;
    // }
    // if (!form?.file_path?.[2]?.id) {
    //   error.file_path2 = 'Image is required';
    //   isValid = false;
    // }
    // if (!form?.file_path?.[3]?.id) {
    //   error.file_path3 = 'Image is required';
    //   isValid = false;
    // }
    setFormError(error);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      dispatch(setProject(form));
      nextStep();
    } else {
      console.log(formError);
      toastError('Please Enter Mandatory fields')
    }
  };

  //get Gallery Headers
  const getgalleryHeaders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('galleryheaders');
      console.log('get Gallery Headers====', res);
      if (res?.data?.status) {
        setgalleryHeader(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getgalleryHeaders();
    if (form.id) {
      getProjectImages();
    }
    console.log('formData=====', fileArray);
  }, [fileArray]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...formState
    }));
  }, [formState]);

  const handleDeleteImage = (headId) => {
    const updatedFileArray = fileArray.filter((item) => item.headId !== headId.toString());

    setFileArray(updatedFileArray);

    setForm((prevState) => ({
      ...prevState,
      file_path: updatedFileArray
    }));
  };

  const images = Array.from({ length: 8 }, (_, index) => ({
    id: `${index}`,
    image: fileArray.filter((item) => item.headId === `${index}`)?.[0]?.id
  }));

  const ImageUpload = ({ id, image, onImageChange, onDeleteImage }) => {
    return (
      <div className="col-md-3">
        {/* {images[id].id > 0 && images[id]?.image !== undefined && */}
        <div className="form-floating mb-3">
          {id == 0 ? <h1>Display Image</h1> : <></>}
          <input
            type="file"
            id={id}
            className="w-103"
            name="file_path"
            accept="image/*"
            required
            onChange={(e) => onImageChange(e)}
          />
        </div>
        {/* } */}
        {image && (
          <div className="col-12 imgclass">
            <img src={image} width="100%" height="140" />
            <button className="btn btn-danger removebtn" onClick={() => onDeleteImage(id)}>
              Delete Image
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {loading && <Loader />}

      {/* <div>
        <h6 className="mb-3">Project Gallary</h6>
      </div> */}

      {/* <div className="row mb-3">
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              <span className='text-primary'>Upload Profile Image</span>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="file"
              id="file_path"
              className="form-control"
              name="file_path"
              accept="image/*"
              required
              onChange={s3}
            />
            <label for="file_path" className="fw-normal">
              Upload Image
            </label>
          </div>
        </div>
      </div> */}

      {/* <div>
        <h6 className="mb-3">Gallary</h6>
      </div> */}

      {/* <div className='card'>
        <div className='card-header'>
          <h4 className="card-title">Gallery</h4>
        </div>
        <div className='card-body'>
          {sgalleryHeader.map((header, index) => (

            <div className="row mb-3">
              <div className="row">
                <div>
                  <h6 className="mb-3">{header.name}</h6>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={handleImage}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={handleImage}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Gallery</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="row mb-5">
              <h4 className='disp_titl'>Display Image <span className='req'>*</span></h4>
              {images.map(({ id, image }) => (
                <ImageUpload
                  key={id}
                  id={id}
                  image={image}
                  onImageChange={handleImage}
                  onDeleteImage={handleDeleteImage}
                />
              ))}
            </div>

            {(subType == '7' || subType == '8' || subType == '13' || subType == '15') && (
              <div>
                <h1 class="unitclass">Unit Gallery</h1>

                <Tabs>
                  <TabList>
                    {sgalleryHeader.map((header, index) => (
                      <Tab>{header.name}</Tab>
                    ))}
                  </TabList>
                  {sgalleryHeader.map((header, index) => (
                    <TabPanel>
                      <div className="mb-50">
                        <div className="row justify-content-center mb-20">
                          <p>Upload images for {header.name}</p>
                          <div className="col-md-4">
                            <div className="row">
                              <div className="col-md-8">
                                <div className="form-floating mb-3">
                                  <input
                                    type="file"
                                    id={header.id}
                                    className="w-103"
                                    accept="image/*"
                                    required
                                    onChange={(e) => {
                                      handleImage(e, header.name);
                                    }}
                                  />
                                </div>
                              </div>
                              {/* <div className="col-md-2">
                                <button
                                  className="btn"
                                  onClick={(e) => {
                                    handleDeleteImage(header.id);
                                  }}>
                                  {' '}
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div> */}
                            </div>

                            <div className="col-md-12 imgclass">
                              {/* {console.log(
                                `image1 for header ${header.id}`,
                                fileArray.filter((item) => item.headId == header.id)?.[0]?.id
                              )} */}
                              {fileArray?.filter((item) => item.headId == header.id)?.[0]?.id ? (
                                <img
                                  src={
                                    fileArray?.filter((item) => item.headId == header.id)?.[0]?.id
                                  }
                                  width="225"
                                  height="140"
                                  className="auth-logo logo-dark mx-auto"
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="row">
                              <div className="col-md-8">
                                <div className="form-floating mb-3">
                                  <input
                                    type="file"
                                    id={header.id}
                                    className="w-103"
                                    name="file_path"
                                    accept="image/*"
                                    required
                                    onChange={(e) => {
                                      handleImage(e, header.name);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12 imgclass">
                              {/* {console.log(
                                `image2 for header ${header.id}`,
                                fileArray.filter((item) => item.headId == header.id)?.[1]?.id
                              )} */}
                              {fileArray.filter((item) => item.headId == header.id)?.[1]?.id ? (
                                <img
                                  src={
                                    fileArray.filter((item) => item.headId == header.id)?.[1]?.id
                                  }
                                  width="225"
                                  height="140"
                                  className="auth-logo logo-dark mx-auto"
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="col-md-2">
                            <button
                              className="btn"
                              onClick={(e) => {
                                handleDeleteImage(header.id);
                              }}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </Tabs>
              </div>
            )}

            {/* 
            {sgalleryHeader.map((header, index) => (
              <div className="row mb-5 align-items-center justify-content-center gapclass">
                <div className="row">
                  <div>
                    <h6 className="mb-3 chnageclr">{header.name}</h6>
                  </div>
                </div>
                <div className="col-2">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control fileclass"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        dynamicImagesUploads(e, header.name, 'image1');
                      }}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
                <div className="col-3 imgclass">
                  <label className="fw-normal imgprevclass">Image Preview</label>

                  <img
                    src={
                      imagesObj?.[header.name + 'image1']
                        ? imagesObj?.[header.name + 'image1']
                        : ''
                    }
                    id={header.id}
                    alt=""
                    width="225"
                    height="140"
                    className="auth-logo logo-dark mx-auto"
                  />{' '}
                  <button className='btn btn-danger removebtn' onClick={(e) => { removeImage(e, header.name, 'image1') }}>Delete Image</button>
                </div>
                <div className="col-2">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control fileclass"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        dynamicImagesUploads(e, header.name, 'image2');
                      }}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
                <div className="col-3">
                  <label className="fw-normal imgprevclass">Image Preview</label>

                  <img
                    src={imagesObj?.[header.name + 'image2']
                      ? imagesObj?.[header.name + 'image2']
                      : ''}
                    alt=""
                    width="225"
                    height="140"
                    className="auth-logo logo-dark mx-auto"
                  />{' '}
                  <button className='btn btn-danger removebtn' onClick={(e) => { removeImage(e, header.name, 'image2') }}>Delete Image</button>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
      <div className="row video_broucher_row">
        <div className="card col-md-6">
          <div className="card-header ">
            <h4 className="card-title">Videos</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col">
                <div className="form-floating">
                  <input
                    type="url"
                    id="video1"
                    className="form-control"
                    name="video1"
                    placeholder="Enter Enter"
                    required
                    onChange={handleChange}
                    value={form.video1 || ''}
                  />
                  <label for="video1" className="fw-normal">
                    Video 1 URL
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-floating">
                  <input
                    type="url"
                    id="video2"
                    className="form-control"
                    name="video2"
                    placeholder="Enter Enter"
                    required
                    onChange={handleChange}
                    value={form.video2 || ''}
                  />
                  <label for="video2" className="fw-normal">
                    Video 2 URL
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card col-md-6">
          <div className="card-header ">
            <h4 className="card-title">E-Brochure</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col">
                <div className="form-floating">
                  {form.broucher_path == null ?
                    <>
                      <input
                        type="file"
                        id="ebrochure"
                        className="form-control"
                        name="broucher_path"
                        accept="image/*,application/pdf"
                        required
                        onChange={handleImage}
                      />
                      <label htmlFor="file_path" className="fw-normal">
                        E-Brochure
                      </label>
                    </>
                    :
                    <a href={form.broucher_path} target='_blank'>
                      <button className='btn btn-primary'>View PDF <FaFilePdf />
                      </button>
                    </a>
                  }
                  {formError.broucher_path && (
                    <p className="text-danger">{formError.broucher_path}</p>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="card">
        <div className="card-header">
          <h4 className="card-title">Location View</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <input
                  type="url"
                  id="streetViewurl"
                  className="form-control"
                  name="streetViewurl"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={form.streetViewurl}
                />
                <label for="streetViewurl" className="fw-normal">
                  Street View URL
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="url"
                  id="droneViewurl"
                  className="form-control"
                  name="droneViewurl"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={form.droneViewurl}
                />
                <label for="droneViewurl" className="fw-normal">
                  Drone View URL
                </label>
              </div>
            </div>
          </div>
        </div>
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

export default StepFour;
