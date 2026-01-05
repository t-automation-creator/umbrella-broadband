import { useEffect } from "react";

export default function StudentCribsFaultReport() {
  const redirectUrl = "https://wkf.ms/4dfAxf7";

  useEffect(() => {
    // Add meta refresh tag to head
    const meta = document.createElement("meta");
    meta.httpEquiv = "refresh";
    meta.content = `0;url=${redirectUrl}`;
    document.head.appendChild(meta);

    // Also redirect via JavaScript as fallback
    window.location.href = redirectUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Redirecting...</h1>
        <p className="text-foreground/80 mb-6">
          You will be redirected shortly, please click{" "}
          <a
            href={redirectUrl}
            className="text-blue-500 hover:text-blue-600 underline font-semibold"
          >
            this link
          </a>
          {" "}if this isn't working.
        </p>
      </div>
    </div>
  );
}
