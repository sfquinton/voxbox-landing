import Script from "next/script";

const META_PIXEL_ID = "232948958848613";

export default function MetaPixel() {
  return (
    <>
      <Script src="/fb-pixel.js" strategy="beforeInteractive" />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
