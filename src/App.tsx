import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./layouts/AppLayout";
import SSBDashboard from "./pages/ssb/Dashboard";
import Players from "./pages/ssb/Players";
import PlayerDetail from "./pages/ssb/PlayerDetail";
import Schedule from "./pages/ssb/Schedule";
import Attendance from "./pages/ssb/Attendance";
import Finance from "./pages/ssb/Finance";
import EODashboard from "./pages/eo/Dashboard";
import Tournaments from "./pages/eo/Tournaments";
import Teams from "./pages/eo/Teams";
import Fixtures from "./pages/eo/Fixtures";
import Standings from "./pages/eo/Standings";
import ParentDashboard from "./pages/parent/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/ssb" element={<AppLayout />}>
                <Route index element={<SSBDashboard />} />
                <Route path="players" element={<Players />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="finance" element={<Finance />} />
              </Route>

              <Route path="/eo" element={<AppLayout />}>
                <Route index element={<EODashboard />} />
                <Route path="tournaments" element={<Tournaments />} />
                <Route path="teams" element={<Teams />} />
                <Route path="fixtures" element={<Fixtures />} />
                <Route path="standings" element={<Standings />} />
              </Route>

              <Route path="/parent" element={<AppLayout />}>
                <Route index element={<ParentDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
