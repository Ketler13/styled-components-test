import styled from '../vendor/styled-components';

export default Component => styled(Component)`
  .inner-block {
    color: red;
    font-size: ${p => p.theme.fonSize || '36px'};
  }
`;
