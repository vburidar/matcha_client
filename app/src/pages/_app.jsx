/* eslint react/jsx-props-no-spreading: 0 */
import 'pure-react-carousel/dist/react-carousel.es.css';

import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';

import { StoreProvider } from '../store/Store';
import { ApiProvider } from '../stores/Api';
import { SocketProvider } from '../stores/Socket';
import { SettingsProvider } from '../stores/Settings';

import Layout from '../components/Layout';

export default class MyApp extends App {
  componentDidMount() {
    /** Remove the server-side injected CSS. */
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>See You</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <StoreProvider>
          <ApiProvider>
            <SocketProvider>
              <SettingsProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ThemeProvider>
              </SettingsProvider>
            </SocketProvider>
          </ApiProvider>
        </StoreProvider>
      </>
    );
  }
}
