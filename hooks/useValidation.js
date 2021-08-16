import React, { useState, useEffect } from 'react';

const useValidation = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if(submitForm) {
            const noErrors = Object.keys(errors).length === 0; //Validate if the obj errors isn't empty

            if(noErrors) {
                fn(); // fn = Function executed in the component 
            }
            setSubmitForm(false);
        }
    }, [errors]);
    
    // Funcion that saves the input while typinf
    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name] : e.target.value
        });
    }

    // Funcion executed when the user click submit
    const handleSubmit = e => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setSubmitForm(true);
    }

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidation;