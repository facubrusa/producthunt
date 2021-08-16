import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

function useAuthentication() {
    const [userAuthenticated, setUserAuthenticated] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(user => {
            if( user ) {
                setUserAuthenticated(user);
            } else {
                setUserAuthenticated(null);
            }
        });
        return () => unsuscribe();
    }, []);

    return userAuthenticated;
}

export default useAuthentication;