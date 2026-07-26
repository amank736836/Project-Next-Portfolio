export default function Resume() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--body-color)",
      }}
    >
      <div
        className="resumeFile"
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          src="/assets/Aman_Resume.pdf"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        ></iframe>
      </div>
    </div>
  );
}
