import Document, { Html, Head, Main, NextScript } from 'next/document'

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/dodgerblue.png"></link>
        <meta name="theme-color" content="white" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default MyDocument
