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
import Siakad from "@/pages/public/siakad";
import PendaftaranOnline from "@/pages/public/pendaftaran-online";
import Perpustakaan from "@/pages/public/perpustakaan";
import EJournal from "@/pages/public/ejournal";

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

function DashboardPage({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

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
      <Route path="/siakad" component={Siakad} />
      <Route path="/pendaftaran-online" component={PendaftaranOnline} />
      <Route path="/perpustakaan" component={Perpustakaan} />
      <Route path="/e-journal" component={EJournal} />
      <Route path="/login" component={Login} />

      {/* MAHASISWA */}
      <Route path="/dashboard/mahasiswa">
        <DashboardPage><MahasiswaDashboard /></DashboardPage>
      </Route>
      <Route path="/dashboard/mahasiswa/jadwal">
        <DashboardPage><MahasiswaJadwal /></DashboardPage>
      </Route>
      <Route path="/dashboard/mahasiswa/krs">
        <DashboardPage><MahasiswaKrs /></DashboardPage>
      </Route>
      <Route path="/dashboard/mahasiswa/nilai">
        <DashboardPage><MahasiswaNilai /></DashboardPage>
      </Route>
      <Route path="/dashboard/mahasiswa/absensi">
        <DashboardPage><MahasiswaAbsensi /></DashboardPage>
      </Route>
      <Route path="/dashboard/mahasiswa/diskusi">
        <DashboardPage><MahasiswaDiskusi /></DashboardPage>
      </Route>

      {/* DOSEN */}
      <Route path="/dashboard/dosen">
        <DashboardPage><DosenDashboard /></DashboardPage>
      </Route>
      <Route path="/dashboard/dosen/jadwal">
        <DashboardPage><DosenJadwal /></DashboardPage>
      </Route>
      <Route path="/dashboard/dosen/nilai">
        <DashboardPage><DosenNilai /></DashboardPage>
      </Route>
      <Route path="/dashboard/dosen/absensi">
        <DashboardPage><DosenAbsensi /></DashboardPage>
      </Route>
      <Route path="/dashboard/dosen/absensi-dosen">
        <DashboardPage><DosenAbsensiDosen /></DashboardPage>
      </Route>
      <Route path="/dashboard/dosen/diskusi">
        <DashboardPage><DosenDiskusi /></DashboardPage>
      </Route>

      {/* ADMIN */}
      <Route path="/dashboard/admin">
        <DashboardPage><AdminDashboard /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/mahasiswa">
        <DashboardPage><AdminMahasiswa /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/dosen">
        <DashboardPage><AdminDosen /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/mata-kuliah">
        <DashboardPage><AdminMataKuliah /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/jadwal">
        <DashboardPage><AdminJadwal /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/krs">
        <DashboardPage><AdminKrs /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/content">
        <DashboardPage><AdminContent /></DashboardPage>
      </Route>
      <Route path="/dashboard/admin/sistem">
        <DashboardPage><AdminSystem /></DashboardPage>
      </Route>

      {/* REKTOR */}
      <Route path="/dashboard/rektor">
        <DashboardPage><RektorDashboard /></DashboardPage>
      </Route>
      <Route path="/dashboard/rektor/akademik">
        <DashboardPage><RektorAkademik /></DashboardPage>
      </Route>

      <Route path="/dashboard/*">
        <DashboardPage><InDevelopment /></DashboardPage>
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
