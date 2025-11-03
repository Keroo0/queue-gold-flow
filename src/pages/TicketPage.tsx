// ==== BLOK 1: IMPORT & SETUP ====
// Import untuk 'Link' (navigasi), 'QRCode', dan ikon-ikon baru
import { Link } from 'react-router-dom';
// FIX: Mengganti import 'QRCode' dengan 'QRCodeSVG' yang lebih spesifik
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useQueue } from '@/contexts/QueueContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ticket, Users, Clock, Play, Square, RefreshCcw, ArrowLeft, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const TicketPage = () => {
  // ==== BLOK 2: MENGAMBIL DATA DARI CONTEXT (BAGIAN YANG DIPERBAIKI) ====
  // Mengambil 'queues' secara langsung, bukan fungsi 'getWaitingCount'.
  const { queues, isSimulating, addToQueue, startSimulation, stopSimulation, resetQueue } = useQueue();
  
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  
  // State baru untuk menyimpan URL QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Menghitung jumlah antrean menunggu dari data 'queues' yang real-time.
  const waitingCount = queues.filter(q => q.status === 'waiting').length;

  // ==== BLOK 3: FUNGSI HANDLER (BAGIAN YANG DIPERBARUI) ====
  const handleGetTicket = async () => {
    const ticketNumber = await addToQueue();
    if (ticketNumber) {
      // Membuat URL lengkap untuk QR Code
      const baseUrl = `${window.location.origin}/simulasi-antrian-bank`;
      const url = `${baseUrl}/status/${ticketNumber}`;
      
      setQrCodeUrl(url); // Simpan URL untuk ditampilkan
      setLastTicket(ticketNumber); // Simpan nomor tiket untuk ditampilkan
      setShowTicket(true); // Tampilkan kartu tiket
      
      toast.success(`Tiket ${ticketNumber} berhasil diambil!`);
      
      // Waktu tampil 10 detik agar pengguna sempat scan
      setTimeout(() => {
        setShowTicket(false);
      }, 10000); 
    } else {
      toast.error('Antrian penuh atau terjadi error.');
    }
  };
  
  // Menghapus fungsi 'back' yang lama

  const handleResetQueue = () => {
    resetQueue();
    toast.warning("Semua data antrian telah direset.");
  }

  // ==== BLOK 4: RENDER TAMPILAN (JSX) ====
  return (
    // Menambahkan 'relative' agar tombol kembali bisa diposisikan
    <div className="relative min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      {/* Tombol Kembali ke Menu Utama (menggunakan Link) */}
      <div className="absolute top-6 left-6 z-10">
        <Button asChild variant="outline" className="bg-card/80 backdrop-blur-sm hover:bg-card">
            <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Menu
            </Link>
        </Button>
      </div>

      <div className="max-w-2xl w-full space-y-8">
        {/* Header (menghapus onClick={back} dari ikon Ticket) */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 backdrop-blur-sm mb-4">
            <Ticket className="w-10 h-10 text-accent animate-shine" />
          </div>
          <h1 className="text-5xl font-bold text-primary-foreground">
            Sistem Antrian Bank
          </h1>
          <p className="text-xl text-primary-foreground/80">
            Ambil nomor antrian Anda
          </p>
        </div>

        {/* Kartu Statistik (menggunakan variabel 'waitingCount') */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Antrian Menunggu</p>
                <p className="text-3xl font-bold text-foreground">{waitingCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-accent/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimasi Waktu</p>
                <p className="text-3xl font-bold text-foreground">
                  ~{Math.ceil((waitingCount * 15) / 60)} min
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Kartu Tiket (Diperbarui dengan QR Code) */}
        {showTicket && lastTicket && (
          <Card className="p-8 bg-card shadow-gold border-accent/30 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Sisi Kiri: Nomor Tiket */}
              <div className="text-center space-y-4 flex-1">
                <p className="text-lg text-muted-foreground">Nomor Antrian Anda</p>
                <div className="gradient-gold rounded-xl p-4">
                    <p className="text-7xl font-bold text-center text-primary-foreground [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
                        {lastTicket}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mohon tunggu panggilan Anda di display board
                </p>
              </div>
              
              {/* Garis Pemisah */}
              <div className="w-full md:w-px md:h-32 bg-border"></div>

              {/* Sisi Kanan: QR Code */}
              <div className="text-center space-y-3 flex-1">
                 <div className="flex justify-center">
                    {/* FIX: Mengganti tag <QRCode> dengan <QRCodeSVG> */}
                    <QRCodeSVG
                      value={qrCodeUrl} // URL unik dari state
                      size={140}
                      bgColor="#ffffff"
                      fgColor="#0c2f57" // Warna biru bank
                      level="H"
                    />
                 </div>
                 <p className="text-sm text-muted-foreground flex items-center justify-center">
                   <QrCode className="w-4 h-4 mr-2"/>
                   Scan untuk status real-time
                 </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-4 items-center">
            <Button
              variant="gold"
              size="lg"
              onClick={handleGetTicket}
              disabled={isSimulating}
              className="text-lg h-16 px-12 rounded-2xl"
            >
              <Ticket className="w-6 h-6 mr-2" />
              Ambil Nomor Antrian
            </Button>

            <Button
              variant={isSimulating ? "destructive" : "hero"}
              size="lg"
              onClick={isSimulating ? stopSimulation : startSimulation}
              className="text-lg h-16 rounded-2xl"
            >
              {isSimulating ? <Square className="mr-2" /> : <Play className="mr-2" />}
              {isSimulating ? 'Hentikan Simulasi' : 'Mulai Simulasi'}
            </Button>
        </div>
        
        {/* Tombol Reset */}
        <div className="flex justify-center">
             <Button variant="ghost" onClick={handleResetQueue} disabled={isSimulating} className="text-muted-foreground">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset Semua Antrian
             </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

