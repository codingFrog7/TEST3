import React from "react";
import { Route, Switch, Redirect, useLocation } from "wouter";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FirebaseProvider, useFirebase } from "./context/FirebaseContext.jsx";
import { Sprout } from "lucide-react";

class AppErrorBoundary extends React.Component {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unknown application error",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found-page">
          <span className="eyebrow">AGRO SATHI</span>
          <h1>Something went wrong.</h1>
          <p>{this.state.message}</p>
          <a className="button button-primary" href="/">
            Return home
          </a>
        </main>
      );
    }

    return this.props.children;
  }
}

function AuthLoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background, #f7f9f5)",
        color: "var(--foreground, #183628)",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #1c563d 0%, #2f7a57 100%)",
          display: "grid",
          placeItems: "center",
          color: "#ffffff",
          boxShadow: "0 8px 20px rgba(28, 86, 61, 0.25)",
        }}
      >
        <Sprout size={28} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "800",
            letterSpacing: "-0.01em",
          }}
        >
          AGRO SATHI
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground, #64748b)",
            marginTop: "4px",
          }}
        >
          Connecting to Kisan Portal...
        </div>
      </div>
    </div>
  );
}

// Route table allowing public access to website and features with user/login/signup pages
function AppRoutes() {
  return (
    <Switch>
      <Route path="/login">
        <AuthPage mode="login" />
      </Route>
      <Route path="/signup">
        <AuthPage mode="signup" />
      </Route>
      <Route path="/user" component={Home} />
      <Route path="/profile" component={Home} />
      <Route path="/" component={Home} />
      <Route path="/detect" component={Home} />
      <Route path="/mandi" component={Home} />
      <Route path="/guides" component={Home} />
      <Route path="/weather" component={Home} />
      <Route path="/advisory" component={Home} />
      <Route path="/about" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FirebaseProvider>
        <AppErrorBoundary>
          <AppRoutes />
        </AppErrorBoundary>
      </FirebaseProvider>
    </ThemeProvider>
  );
}
