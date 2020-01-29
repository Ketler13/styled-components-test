import { createGlobalStyle } from '../vendor/styled-components';

const GlobalStyle = createGlobalStyle`
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  td,
  button,
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6 {
    display: block;
    font-size: ${p => p.theme.fonSize || '36px'};
  }
}`;

export default GlobalStyle;
