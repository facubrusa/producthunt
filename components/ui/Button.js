import styled from "@emotion/styled";

const Button = styled.a`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .8rem 2rem;
    margin: 2rem auto;
    text-align: center;
    background-color: ${props => props.bgColor ? '#FA552F' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000000'};

    &::last-of-type { // Apply to the last item (in this case to a button)
        margin-right: 0;
    }

    &:hover {
        cursor: pointer;
    }
`;

export default Button;