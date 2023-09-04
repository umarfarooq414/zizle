import React, { useEffect, useRef, useState } from 'react';
import styled from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/fontawesome-free-solid';
import { DragList } from './DragList.jsx';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '../../../../../assets/images/navClose.png';
import {
  addImagesToCategory,
  createCategories,
  deleteImage,
  getAllCategories,
  getAllCategoriesImages,
  getImagesByCategory,
} from '../../../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { CircularProgress } from '@mui/material';

const ModGallery = () => {
  const [categories, setCategories] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categoriesFetched = useRef();
  const dispatch = useDispatch();
  const imagePreviewStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fitContent',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
    height: 'auto',
    width: '30%'
  };


  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (categoriesFetched.current) return;
    categoriesFetched.current = true;
    getCategories();
    getAllImages();
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryName.length)
      dispatch(createCategories({ name: categoryName }))
        .then(unwrapResult)
        .then((resullt) => {
          if (resullt.id) {
            getCategories();
            setCategoryName(``);
          }
        });
  };

  const getAllImages = () => {
    dispatch(getAllCategoriesImages())
      .then(unwrapResult)
      .then((resut) => {
        if (resut) {
          setAllImages(resut);
        }
      });
  };

  const getCategories = () => {
    dispatch(getAllCategories())
      .then(unwrapResult)
      .then((results) => {
        setCategories(results);
      });
  };

  const handleAddImageToCategory = (file) => {
    if (selectedCategory !== 'all') {
      setIsLoading(true);
      dispatch(
        addImagesToCategory({
          image: file,
          categoryId: selectedCategory,
        }),
      )
        .then(unwrapResult)
        .then((result) => {
          if (result) {
            setIsLoading(false);
            getAllImages();
          }
        });
    }
  };

  const handleDeleteImage = (id) => {
    dispatch(deleteImage(id))
      .then(unwrapResult)
      .then((resullt) => {
        if (resullt) {
          getAllImages();
        }
      });
  };

  const handleChangeCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      getAllImages();
    } else {
      dispatch(getImagesByCategory(categoryId))
        .then(unwrapResult)
        .then((result) => {
          setAllImages(result);
        });
    }
  };

  return (
    <div className={styled.upperDiv}>
      <div className={styled.categoriesTabs}>
        <form>
          <div className={styled.fromGroup}>
            <label>Category</label>
            <select
              onChange={(e) => {
                handleChangeCategory(e.target.value);
              }}
              value={selectedCategory}
            >
              <option value='all'>All</option>
              {categories?.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          {/* add category */}
          <div className={styled.fromGroup}>
            <label>Add Category</label>
            <input
              type='text'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button>
              <FontAwesomeIcon icon={faPlus} onClick={(e) => handleAddCategory(e)} />
            </button>
          </div>
          {selectedCategory !== 'all' && (
            <div className={styled.fromGroup}>
              <input
                type='file'
                className={styled.fileupload}
                id='upload'
                onChange={(event) => {
                  handleAddImageToCategory(event.target.files[0]);
                  // setImageToUpload(event.target.files[0])
                }}
              />
              <label
                for='upload'
                //  onClick={() => handleAddImageToCategory()}
                onMouseEnter={(e) => {
                  e.target.style.opacity = 0.8;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = 1;
                }}
              >
                Upload images
                {isLoading && (
                  <CircularProgress color='secondary' size={20} style={{ marginLeft: '25px' }} />
                )}
              </label>
            </div>
          )}
          <div className={styled.clear}></div>
        </form>
      </div>
      <div className={styled.contentdata}>
        <div className={styled.contentDataLeft}>
          <div className={styled.mobileView}>
            <table width='100%' cellPadding={0} cellSpacing={0}>
              <tr>
                <th>Media</th>
                <th>Category</th>
                <th>Delete</th>
              </tr>
              {allImages?.map((images) => (
                <tr>
                  <td>
                    <img
                      src={images.url}
                      alt='img'
                      onClick={() => openImageModal(images.url)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>


                  <Modal open={isModalOpen}>
                    <Box sx={imagePreviewStyle}>
                      <Button onClick={closeImageModal} className={styled.imagePreviewCloseBtnModal}>
                        <img src={CloseIcon} alt='cross icon' />
                      </Button>
                      <img src={selectedImage} style={{ height: "100%", width: "100%" }} />
                    </Box>
                  </Modal>
                  <td>{images.categories.name}</td>
                  <td>
                    <FontAwesomeIcon
                      style={{ cursor: 'pointer' }}
                      icon={faTrash}
                      onClick={() => handleDeleteImage(images.id)}
                    />
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <div className={styled.contentDataRight}>
          <h2>Categories</h2>
          <DragList categories={categories} getCategories={getCategories} />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ModGallery;
