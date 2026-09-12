import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Leaf size={30} />
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
