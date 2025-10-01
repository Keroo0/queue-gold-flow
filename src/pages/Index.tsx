import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ticket, Monitor, PhoneCall, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 backdrop-blur-sm mb-6">
            <BarChart3 className="w-12 h-12 text-accent animate-shine" />
          </div>
          <h1 className="text-6xl font-bold text-primary-foreground">
            Sistem Antrian Bank
          </h1>
          <p className="text-2xl text-primary-foreground/80 max-w-2xl mx-auto">
            Simulasi pemodelan sistem antrian bank dengan pemrosesan otomatis setiap 10 detik
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/ticket" className="group">
            <Card className="p-8 h-full bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-smooth hover:shadow-elegant">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <Ticket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Ambil Tiket
                </h2>
                <p className="text-muted-foreground">
                  Halaman untuk nasabah mengambil nomor antrian (A001 - A200)
                </p>
                <Button variant="hero" className="w-full mt-4">
                  Mulai →
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/teller" className="group">
            <Card className="p-8 h-full bg-card/90 backdrop-blur-sm border-accent/20 hover:border-accent/50 transition-smooth hover:shadow-gold">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <PhoneCall className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Dashboard Teller
                </h2>
                <p className="text-muted-foreground">
                  Kelola dan panggil antrian nasabah secara efisien
                </p>
                <Button variant="gold" className="w-full mt-4">
                  Buka Dashboard →
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/display" className="group">
            <Card className="p-8 h-full bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-smooth hover:shadow-elegant">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <Monitor className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Display Board
                </h2>
                <p className="text-muted-foreground">
                  Tampilan publik untuk melihat nomor antrian yang sedang dilayani
                </p>
                <Button variant="hero" className="w-full mt-4">
                  Lihat Display →
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Features Info */}
        <Card className="p-8 bg-card/80 backdrop-blur-sm border-accent/10">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Fitur Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Kapasitas 200 Antrian</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistem dapat menangani hingga 200 nomor antrian (A001 - A200)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Pemrosesan Otomatis</h4>
                  <p className="text-sm text-muted-foreground">
                    Setiap antrian diproses dengan interval 10 detik
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Real-time Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Semua halaman tersinkronisasi secara real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Interface Modern</h4>
                  <p className="text-sm text-muted-foreground">
                    Desain profesional dengan warna biru-emas
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Statistik Lengkap</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor antrian menunggu, sedang dilayani, dan selesai
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Responsive Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Dapat diakses dari desktop, tablet, dan mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
