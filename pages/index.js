import React from 'react';
import { withTheme } from '../vendor/styled-components';
import getIndexStyled from '../styles/index.styles';

const Index = ({ className }) => (
  <div className={`index-page ${className}`}>
    <div className="inner-block">
      This is index page
    </div>
  </div>
);

const IndexStyled = getIndexStyled(Index);

IndexStyled.getInitialProps = () => ({});

export default withTheme(IndexStyled);
