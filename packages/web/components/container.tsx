import Head from "next/head";
import { ReactNode } from "react";
import { Reset } from "styled-reset";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    min-height: 100vh;

    // https://coolors.co/141115-ff5154-d1d2f9-f5ff90-f9c784
    --rich-black-fogra-39: #141115ff;
    --tart-orange: #ff5154ff;
    --lavender-blue: #d1d2f9ff;
    --key-lime: #f5ff90ff;
    --gold-crayola: #f9c784ff;

    --font-sans: 'Poppins', sans-serif;
    --font-mono: 'Roboto Mono', monospace;

    --font-light: 300;
    --font-normal: 400;
    --font-bold: 500;
    --font-extra-bold: 700;

    font-size: 14px;
    font-family: var(--font-sans);
    font-weight: var(--font-normal);
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
  }
`;

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;800&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Reset />
      <GlobalStyle />

      {children}
    </>
  );
};
