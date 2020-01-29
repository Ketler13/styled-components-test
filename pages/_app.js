import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '../vendor/styled-components';
import { getDataFromTree } from 'react-apollo';

import GlobalStyle from '../styles/globalStyles';

const isBrowser = () => typeof window !== 'undefined';

class MyApp extends App {
  static async getInitialProps() {
    if (!isBrowser()) {
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <GlobalStyle theme={{}} />,
          {}
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error('Error while running `getDataFromTree`', error);
      }

      if (!process.browser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }
    }
    return {};
  }

  render() {
    const { Component } = this.props;
    return (
      <Container>
        <Head>
          <title>Test Component</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <ThemeProvider theme={{}}>
          <GlobalStyle theme={{}} />
          <Component />
        </ThemeProvider>
      </Container>
    );
  }
}
export default MyApp;
