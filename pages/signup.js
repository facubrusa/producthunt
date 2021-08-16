import React, { useState } from 'react';
import Router from 'next/router';
import { css } from '@emotion/react';
import Layout from '../components/layout/Layout';
import { Form, FormDiv, InputSubmit, Error} from '../components/ui/Form';
import firebase from '../firebase';

// Validations
import useValidation from '../hooks/useValidation';
import validateSignUp from '../validations/validateSignUp';

const SignUp = () => {

  const initialState = {
    name: '',
    email: '',
    password: ''
  }

  const [error, setError] = useState(false);

  const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(initialState, validateSignUp, signUp);

  const { name, email, password } = values;

  async function signUp() {
    try {
      await firebase.register(name, email, password);
      Router.push('/');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Sign Up</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >
            <FormDiv>
                <label htmlFor="name">Name</label>
                <input 
                  type="text"
                  id="name"
                  placeholder="Your name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </FormDiv>

            {errors.name && <Error>{errors.name}</Error>}

            <FormDiv>
                <label htmlFor="email">Email</label>
                <input 
                  type="text"
                  id="email"
                  placeholder="Your email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </FormDiv>

            {errors.email && <Error>{errors.email}</Error>}

            <FormDiv>
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  placeholder="Your password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </FormDiv>

            {errors.password && <Error>{errors.password}</Error>}

            { error && <Error>{error}</Error> }

            <InputSubmit
              type="submit"
              value="Create Acoount"
            />
        </Form>
        </>
      </Layout>
    </div>
  )
}

export default SignUp;