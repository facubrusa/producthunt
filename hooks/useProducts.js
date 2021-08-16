import React, { useEffect, useState, useContext} from 'react';
import { FirebaseContext } from '../firebase';

const useProducts = order => {
    const [products, setProducts] = useState([]);

    const { firebase } = useContext(FirebaseContext);
  
    useEffect(() => {
      const getProducts = () => {
        // Get the products from firebase
        firebase.db.collection('products').orderBy(order, 'desc').onSnapshot(handleProducts)
      }
      getProducts();
    }, []);
  
    function handleProducts(snapshot) {
      const products = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      setProducts(products);
    }

    return {
      products
    };
}
 
export default useProducts;