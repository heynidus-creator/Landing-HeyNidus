import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import About from "./components/About.tsx";
import Projects from "./components/Projects.tsx";
import ContactSection from "./components/ContactSection.tsx";
import Footer from "./components/Footer.tsx";
import BackToTopButton from "./components/BackToTopButton.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import NotFound from "./pages/not-found.tsx";

const Blog = lazy(() => import("./components/Blog.tsx"));
const Testimonials = lazy(() => import("./components/Testimonials.tsx"));

const LoadingFallback = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
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

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/proyecto/:id" component={ProjectDetail} />
        <Route component={NotFound} />
      </Switch>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default App;
