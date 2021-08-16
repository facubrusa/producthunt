import React, { useState } from 'react';
import Router from 'next/router';
import { css } from '@emotion/react';
import Layout from '../components/layout/Layout';
import { Form, FormDiv, InputSubmit, Error} from '../components/ui/Form';
import firebase from '../firebase';

// Validations
import useValidation from '../hooks/useValidation';
import validateLogin from '../validations/validateLogin';

const Login = () => {

  const initialState = {
    email: '',
    password: ''
  }

  const [error, setError] = useState(false);

  const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(initialState, validateLogin, logIn);

  const { email, password } = values;

  async function logIn() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    console.log('login');
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
        >Log In</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >
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
              value="Log In"
            />
        </Form>
        </>
      </Layout>
    </div>
  )
}

export default Login;