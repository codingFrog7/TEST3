import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: "#caeb80",
          boxShadow: "0 8px 20px rgba(35, 83, 48, 0.22)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <img
          src="/agro-sathi-icon.png"
          alt="AGRO SATHI"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <span className="eyebrow">AGRO SATHI</span>
      <h1>That page is not here.</h1>
      <p>Try returning to the home page and choose another section.</p>
      <Link className="button button-primary" href="/">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </main>
  );
}
