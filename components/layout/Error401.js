import React from 'react';
import { css } from '@emotion/react';

const Error401 = () => {
    return ( 
        <h1
            css={css`
                margin: 25rem 0;
                text-align: center;
            `}
        >Ups! You can't be here</h1>
    );
}
 
export default Error401;