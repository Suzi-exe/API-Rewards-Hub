import Head from "next/head";
import AdblockDetector from "@/components/AdblockDetector";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>API Rewards Hub — Unlock the Power of AI for Free</title>
        <meta
          name="description"
          content="Watch short ads, earn credits, and redeem keys for premium AI APIs like Claude 3.5 Sonnet, GPT-4o, and Gemini 1.5 Pro."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <AdblockDetector />
    </UserProvider>
  );
}
