import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import Login from "@/pages/login";
import Beranda from "@/pages/public/home";
import Pendaftaran from "@/pages/public/pendaftaran";
import ProgramStudi from "@/pages/public/program-studi";
import Beasiswa from "@/pages/public/beasiswa";
import Galeri from "@/pages/public/galeri";
import Pengumuman from "@/pages/public/pengumuman";
import InformasiPMB from "@/pages/public/informasi-pmb";

import MahasiswaDashboard from "@/pages/dashboard/mahasiswa/index";
import MahasiswaJadwal from "@/pages/dashboard/mahasiswa/jadwal";
import MahasiswaKrs from "@/pages/dashboard/mahasiswa/krs";
import MahasiswaNilai from "@/pages/dashboard/mahasiswa/nilai";
import MahasiswaAbsensi from "@/pages/dashboard/mahasiswa/absensi";
import MahasiswaDiskusi from "@/pages/dashboard/mahasiswa/diskusi";

import DosenDashboard from "@/pages/dashboard/dosen/index";
import DosenJadwal from "@/pages/dashboard/dosen/jadwal";
import DosenNilai from "@/pages/dashboard/dosen/nilai";
import DosenAbsensi from "@/pages/dashboard/dosen/absensi";
import DosenDiskusi from "@/pages/dashboard/dosen/diskusi";
import DosenAbsensiDosen from "@/pages/dashboard/dosen/absensi-dosen";

import AdminDashboard from "@/pages/dashboard/admin/index";
import AdminMahasiswa from "@/pages/dashboard/admin/mahasiswa";
import AdminDosen from "@/pages/dashboard/admin/dosen";
import AdminMataKuliah from "@/pages/dashboard/admin/mata-kuliah";
import AdminJadwal from "@/pages/dashboard/admin/jadwal";
import AdminContent from "@/pages/dashboard/admin/content";
import AdminSystem from "@/pages/dashboard/admin/system";
import AdminKrs from "@/pages/dashboard/admin/krs";

import RektorDashboard from "@/pages/dashboard/rektor/index";
import RektorAkademik from "@/pages/dashboard/rektor/akademik";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

const InDevelopment = () => (
  <div className="p-8 text-center text-muted-foreground">
    <p className="text-lg font-medium">Modul dalam pengembangan</p>
    <p className="text-sm mt-2">Fitur ini akan segera tersedia</p>
  </div>
);

function Router() {
  return (
    <Switch>
      {/* PUBLIC PAGES */}
      <Route path="/" component={Beranda} />
      <Route path="/pendaftaran" component={Pendaftaran} />
      <Route path="/program-studi" component={ProgramStudi} />
      <Route path="/beasiswa" component={Beasiswa} />
      <Route path="/galeri" component={Galeri} />
      <Route path="/pengumuman" component={Pengumuman} />
      <Route path="/informasi-pmb" component={InformasiPMB} />
      <Route path="/login" component={Login} />

      {/* MAHASISWA */}
      <Route path="/dashboard/mahasiswa*">
        <DashboardLayout>
          <Switch>
            <Route path="/dashboard/mahasiswa" component={MahasiswaDashboard} />
            <Route path="/dashboard/mahasiswa/jadwal" component={MahasiswaJadwal} />
            <Route path="/dashboard/mahasiswa/krs" component={MahasiswaKrs} />
            <Route path="/dashboard/mahasiswa/nilai" component={MahasiswaNilai} />
            <Route path="/dashboard/mahasiswa/absensi" component={MahasiswaAbsensi} />
            <Route path="/dashboard/mahasiswa/diskusi" component={MahasiswaDiskusi} />
            <Route component={InDevelopment} />
          </Switch>
        </DashboardLayout>
      </Route>

      {/* DOSEN */}
      <Route path="/dashboard/dosen*">
        <DashboardLayout>
          <Switch>
            <Route path="/dashboard/dosen" component={DosenDashboard} />
            <Route path="/dashboard/dosen/jadwal" component={DosenJadwal} />
            <Route path="/dashboard/dosen/nilai" component={DosenNilai} />
            <Route path="/dashboard/dosen/absensi" component={DosenAbsensi} />
            <Route path="/dashboard/dosen/absensi-dosen" component={DosenAbsensiDosen} />
            <Route path="/dashboard/dosen/diskusi" component={DosenDiskusi} />
            <Route component={InDevelopment} />
          </Switch>
        </DashboardLayout>
      </Route>

      {/* ADMIN */}
      <Route path="/dashboard/admin*">
        <DashboardLayout>
          <Switch>
            <Route path="/dashboard/admin" component={AdminDashboard} />
            <Route path="/dashboard/admin/mahasiswa" component={AdminMahasiswa} />
            <Route path="/dashboard/admin/dosen" component={AdminDosen} />
            <Route path="/dashboard/admin/mata-kuliah" component={AdminMataKuliah} />
            <Route path="/dashboard/admin/jadwal" component={AdminJadwal} />
            <Route path="/dashboard/admin/krs" component={AdminKrs} />
            <Route path="/dashboard/admin/content" component={AdminContent} />
            <Route path="/dashboard/admin/sistem" component={AdminSystem} />
            <Route component={InDevelopment} />
          </Switch>
        </DashboardLayout>
      </Route>

      {/* REKTOR */}
      <Route path="/dashboard/rektor*">
        <DashboardLayout>
          <Switch>
            <Route path="/dashboard/rektor" component={RektorDashboard} />
            <Route path="/dashboard/rektor/akademik" component={RektorAkademik} />
            <Route component={InDevelopment} />
          </Switch>
        </DashboardLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kampus-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
