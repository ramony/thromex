import '~/style/index.css';
import '~/style/App.css';

import React from "react"

import Container from '~/components/Container';

import { theme } from '~/config/ThromeConfig';
import { ThemeProvider } from '@mui/material/styles';

export default function Home() {

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <div className="App">
          <base></base>
          <Container />
        </div>
      </ThemeProvider>
    </React.StrictMode>
  );

}
