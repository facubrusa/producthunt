import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/Error404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FormDiv, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';

const ProductConteiner = styled.div`
    @media(min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreatorComment = styled.p`
    padding: .5rem 2rem;
    background-color: #D1552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Product = () => {

    // State of the component
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});
    const [consultBD, setConsultBD] = useState(true);

    // Get the actual product id
    const router = useRouter();
    const { query: { pid } } = router;

    // Firebase context
    const { firebase, user } = useContext(FirebaseContext);
    useEffect(() => {
        if(pid && consultBD){
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(pid);
                const product = await productQuery.get();
                if(product.exists){
                    setProduct(product.data());
                } else {
                    setError(true);
                }
                setConsultBD(false);
            }
            getProduct();
        }
        // eslint-disable-next-line 
    }, [pid])

    if(Object.keys(product).length === 0 && !error) return (
        <Layout>
            <h1 css={css`
                text-align: center;
                margin: 25rem 0;
            `}>Loading Product...</h1>
        </Layout>
    )
    const { name, business, imageurl, url, description, created, comments, votes, creator, haveVoted } = product;

    const handleVote = () => {
        if(!user) return router.push('/login');

        // Get and sum +1 vote
        const newVotes = votes + 1;

        // Verify if the user has voted
        if(haveVoted.includes(user.uid)) return;

        // Update the list of user voted
        const newHaveVoted = [...haveVoted, user.uid];

        // Update the votes in bd
        firebase.db.collection('products').doc(pid).update({ 
            votes: newVotes, 
            haveVoted: newHaveVoted
        });

        // Update the state
        setProduct({
            ...product,
            votes: newVotes
        });

        // Consult BD
        setConsultBD(true);
    }

    const handleComment = e => {
        setComment({
            ...comment,
            [e.target.name] : e.target.value
        });
    }

    const submitComment = e => {
        e.preventDefault();

        if(!user) return router.push('/login');

        // Add extra information in the comment
        comment.userId = user.uid;
        comment.userName = user.displayName;

        // Update the list of comments
        const newComments = [...comments, comment];

        // Update the comments in bd
        firebase.db.collection('products').doc(pid).update({ 
            comments: newComments,
        });

        // Update the state
        setProduct({
            ...product,
            comments: newComments
        });

        // Consult BD
        setConsultBD(true);
    }

    const isCreator = id => {
        return (id === creator.id) ? true : false;
    }

    // Verify if the user can delete the actual product
    const canDelete = () => {
        if(!user) return;
        if(creator.id === user.uid) return true;
    }

    // Delete product
    const deleteProduct = async () => {
        if(!user) router.push('/login');
        if(creator.id !== user.uid) router.push('/');

        try {
            await firebase.db.collection('products').doc(pid).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
            { error ? <Error404 /> : (
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}>{name}</h1>

                    <ProductConteiner>
                        <div>
                            <p>Posted {formatDistanceToNow(new Date(created)) } ago </p>
                            <p>By: {creator.name} of {business}</p>
                            <img src={imageurl} alt="Product image"/>
                            <p>{description}</p>

                            { user && (
                                <>
                                <h2>Add your comment</h2>
                                <form
                                    onSubmit={submitComment}
                                >
                                    <FormDiv>
                                        <input 
                                            type="text"
                                            name="message"
                                            onChange={handleComment}
                                        />
                                    </FormDiv>
                                    <InputSubmit 
                                        type="submit"
                                        value="Add comment"
                                    />
                                </form>
                                </>
                            )}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comments</h2>
                            { comments.length === 0 ? 'No comments yet :c' : (
                                <ul>
                                    {comments.map((comment, i)=> (
                                        <li
                                            key={`${comment.userId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: .5rem 2rem;
                                            `}
                                        >
                                            <p>{comment.message}</p>
                                            <p>Written by: 
                                                <span css={css`
                                                    font-weight: bold;
                                                `}>{''} {comment.userName}</span>
                                            </p>
                                            { isCreator(comment.userId) && <CreatorComment>Creator</CreatorComment>}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                        
                        <aside>
                            <div css={css`
                                margin-top: 5rem;
                            `}>
                                <p css={css`
                                    text-align: center;
                                    font-weight: 700;
                                `}>{votes} Votes</p>

                                { user && (
                                    <Button
                                        onClick={handleVote}
                                    >Vote</Button>
                                )}

                                <Button
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visit URL</Button>
                            </div>
                        </aside>
                    </ProductConteiner>
                    { canDelete() && 
                        <Button
                            onClick={deleteProduct}
                        >
                            Delete Product
                        </Button> }
                </div>
            )}
            </>
        </Layout>
    );
}

export default Product;