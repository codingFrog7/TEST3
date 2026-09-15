import React from "react";
import { Route, Switch, Redirect, useLocation } from "wouter";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FirebaseProvider, useFirebase } from "./context/FirebaseContext.jsx";

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
        background: "var(--background, #eff0eb)",
        padding: "24px",
      }}
    >
      <div className="agro-splash-card">
        <div className="agro-splash-emblem-stage">
          <div className="agro-splash-glow-ring" aria-hidden="true" />
          <div className="agro-splash-orbit-ring" aria-hidden="true" />
          <div className="agro-splash-logo-box">
            <img
              src="/agro-sathi-icon.png"
              alt="AGRO SATHI"
              className="agro-splash-logo-img"
            />
          </div>
        </div>
        <div className="agro-splash-title">
          <span className="part-agro">AGRO</span>
          <span className="part-sathi">SATHI</span>
        </div>
        <div className="agro-splash-progress-track" aria-hidden="true">
          <div className="agro-splash-progress-bar" style={{ width: "65%" }} />
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
      <Route path="/team" component={TeamPage} />
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
