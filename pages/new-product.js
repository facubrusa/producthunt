import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';

import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Form, FormDiv, InputSubmit, Error} from '../components/ui/Form';
import { FirebaseContext } from '../firebase';

// Validations
import useValidation from '../hooks/useValidation';
import validateNewProduct from '../validations/validateNewProduct';
import Error401 from '../components/layout/Error401';

const NewProduct = () => {

  const initialState = {
    name: '',
    business: '',
    //image: '',
    url: '',
    description: '',
  }

  // State of images
  const [imagename, setImageName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(100);
  const [imageurl, setImageUrl] = useState('');


  const [error, setError] = useState(false);

  const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(initialState, validateNewProduct, createProduct);

  const { name, business, url, description } = values;

  // Routing hook for redirect
  const router = useRouter();

  const { user, firebase } = useContext(FirebaseContext);

  async function createProduct() {
    // If the user isn't loged, redirect to login
    if(!user) {
      return router.push('/login');
    }

    // Create the product object
    const product = {
      name, 
      business, 
      url, 
      imageurl,
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName
      },
      haveVoted: []
    }
    firebase.db.collection('products').add(product);

    // Redirect to home
    return router.push('/');
  }

  const handleUploadStart = () => {
    setProgress(0);
    setUploading(true);
  }

  const handleProgress = progress => setProgress({ progress });
  
  const handleUploadError = error => {
    setUploading(error);
    setError(error);
    console.error(error);
  }

  const handleUploadSuccess = name => {
    setProgress(100);
    setUploading(false);
    setImageName(name);
    firebase
        .storage
        .ref('products')
        .child(name)
        .getDownloadURL()
        .then(url => {
          console.log(url);
          setImageUrl(url);
        });
  }

  return (
    <div>
      <Layout>
        {!user ? <Error401 /> : (
          <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >New Product</h1>
          <Form
            onSubmit={handleSubmit}
            noValidate
          >

            <fieldset>
              <legend>General Information</legend>

              <FormDiv>
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
              </FormDiv>

              {errors.name && <Error>{errors.name}</Error>}

              <FormDiv>
                  <label htmlFor="business">Business</label>
                  <input 
                    type="text"
                    id="business"
                    placeholder="Name of Business or Company"
                    name="business"
                    value={business}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
              </FormDiv>

              {errors.business && <Error>{errors.business}</Error>}
              
              <FormDiv>
                  <label htmlFor="name">Image</label>
                  <FileUploader
                    accept="image/*"
                    id="image"
                    name="image"
                    randomizeFilename
                    storageRef={firebase.storage.ref("products")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
              </FormDiv>

              <FormDiv>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url"
                    id="url"
                    placeholder="URL of your product"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
              </FormDiv>

              {errors.url && <Error>{errors.url}</Error>}

            </fieldset>

            <fieldset>
              <legend>About your Product</legend>

              <FormDiv>
                  <label htmlFor="description">URL</label>
                  <textarea 
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
              </FormDiv>

              {errors.description && <Error>{errors.description}</Error>}
            </fieldset>


              { error && <Error>{error}</Error> }

              <InputSubmit
                type="submit"
                value={ progress === 100 ? "Create Product" : `Uploading image ${progress.progress}%` }
                disabled={ progress === 100 ? false : true }
              />
          </Form>
          </>
        )}
        
      </Layout>
    </div>
  )
}

export default NewProduct;