import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Logos from "@/pages/Logos";
import { useSounds } from "@/hooks/useSounds";

const queryClient = new QueryClient();

function Effects() {
  useSounds();
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/logos" component={Logos} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Effects />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
