import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from './config';

class Firebase {
    constructor() {
        if(!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    // Register a user
    async register(name, email, password) {
        // Create a user in firebase
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
        // Set name to created user 
        return await newUser.user.updateProfile({
            displayName: name
        });
    }

    // Login
    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    //Log out
    async logout() {
        console.log('entre logout');
        await this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;