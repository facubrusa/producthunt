import React from 'react';
import { css } from '@emotion/react';

const Error404 = () => {
    return ( 
        <h1
            css={css`
                margin: 25rem 0;
                text-align: center;
            `}
        >Ups! We don't have this product</h1>
    );
}
 
export default Error404;