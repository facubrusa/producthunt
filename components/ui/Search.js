import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import router from 'next/router';

const InputText = styled.input`
    border: 1px solid var(--gray3);
    padding: 1rem;
    min-width: 300px;
`;
const InputSubmit = styled.button`
    height: 2.9rem;
    width: 3rem;
    display: block;
    background-size: 4rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 2px;
    background-color: white;
    border: none;
    text-indent: -9999px; /* hide the word 'Search' */

    &:hover {
        cursor: pointer;
    }
`;

const Search = () => {

    const [search, setSearch] = useState('');

    const searchProduct = e => {
        e.preventDefault();

        if(search.trim() === '') return;

        // Redirect to /search
        router.push({
            pathname: '/search',
            query: { q : search }
        });
    }
    return ( 
        <form
            css={css`
                position: relative;
            `}
            onSubmit={searchProduct}
        >
            <InputText 
                type="text" 
                placeholder="Search Products" 
                onChange={e => setSearch(e.target.value)}
                />
            <InputSubmit type="submit">Search</InputSubmit>
        </form>
    );
}
 
export default Search;
