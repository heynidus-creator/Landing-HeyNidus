import { Switch, Route, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";

import ProjectDetail from "./pages/ProjectDetail";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/not-found";
import AdminPage from "./pages/admin/AdminPage";

import { useAnalytics } from "./hooks/useAnalytics";

const Blog = lazy(() => import("./components/Blog"));
const Testimonials = lazy(() => import("./components/Testimonials"));

const LoadingFallback = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
  </div>
);

function HomePage() {
  return (
    <main className="pt-16">
      <section id="inicio">
        <Hero />
      </section>

      <section id="quienes-somos" className="py-16">
        <About />
      </section>

      <section id="proyectos" className="py-16 bg-white dark:bg-slate-900">
        <Projects />
      </section>

      <section id="blog" className="py-16">
        <Suspense fallback={<LoadingFallback />}>
          <Blog />
        </Suspense>
      </section>

      <section id="testimonios" className="py-16 bg-white dark:bg-slate-900">
        <Suspense fallback={<LoadingFallback />}>
          <Testimonials />
        </Suspense>
      </section>

      <section id="contacto" className="py-16">
        <ContactSection />
      </section>
    </main>
  );
}

export default function App() {
  const { trackPageView } = useAnalytics();
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location, trackPageView]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Switch>
        {/* ✅ Admin (incluye subrutas) */}
        <Route path="/admin/:rest*" component={AdminPage} />

        {/* ✅ Sitio público */}
        <Route>
          <Navbar />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/proyecto/:id" component={ProjectDetail} />
            <Route path="/blog" component={BlogList} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route component={NotFound} />
          </Switch>
          <BackToTopButton />
          <Footer />
        </Route>
      </Switch>
    </div>
  );
}
