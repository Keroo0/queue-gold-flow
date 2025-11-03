// ==== BLOK 1: IMPORT & SETUP ====
import { useParams, Link } from 'react-router-dom';
import { useQueue } from '@/contexts/QueueContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users, Check, Hourglass, PhoneOutgoing, AlertTriangle } from 'lucide-react';

// ==== BLOK 2: KOMPONEN HALAMAN STATUS ====
const StatusPage = () => {
  // Mengambil nomor tiket dari URL (contoh: /status/A005 -> ticketNumber = "A005")
  const { ticketNumber } = useParams<{ ticketNumber: string }>();
  
  // Mengambil data antrian real-time dari Context
  const { queues } = useQueue();

  // ==== BLOK 3: MENCARI DATA TIKET PENGGUNA ====
  // Cari data lengkap untuk tiket ini
  const myTicket = queues.find(q => q.number === ticketNumber);
  
  // Hitung jumlah orang yang menunggu *sebelum* tiket ini
  const waitingAhead = queues.filter(
    q => q.status === 'waiting' && new Date(q.timestamp) < new Date(myTicket?.timestamp || 0)
  ).length;

  // Cari tahu siapa yang sedang dilayani
  const servingQueue = queues.find(q => q.status === 'serving');

  // ==== BLOK 4: FUNGSI UNTUK MENAMPILKAN KONTEN ====
  const renderStatusContent = () => {
    // KASUS 1: Tiket tidak ditemukan
    if (!myTicket) {
      return (
        <div className="text-center space-y-4 p-8">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-3xl font-bold">Tiket Tidak Ditemukan</h2>
          <p className="text-muted-foreground">Nomor tiket "{ticketNumber}" tidak valid atau sudah terhapus.</p>
        </div>
      );
    }

    // KASUS 2: Tiket sedang menunggu
    if (myTicket.status === 'waiting') {
      return (
        <div className="text-center space-y-6 p-8">
          <div className="p-4 bg-primary/10 rounded-full inline-block">
            <Hourglass className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Nomor Antrian Anda</h2>
          <p className="text-8xl font-bold text-primary">{myTicket.number}</p>
          <p className="text-3xl font-semibold">{waitingAhead} Antrian di Depan Anda</p>
          <p className="text-muted-foreground">Estimasi waktu tunggu: ~{Math.ceil(((waitingAhead + 1) * 15) / 60)} menit</p>
          <hr/>
          <p className="text-lg font-semibold">Sedang Dilayani: {servingQueue ? servingQueue.number : "-"}</p>
        </div>
      );
    }

    // KASUS 3: Tiket sedang dipanggil
    if (myTicket.status === 'serving') {
      return (
        <div className="text-center space-y-6 p-8 animate-pulse">
          <div className="p-4 bg-accent/10 rounded-full inline-block">
            <PhoneOutgoing className="w-16 h-16 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-accent">Nomor Anda Sedang Dipanggil!</h2>
          <p className="text-8xl font-bold text-accent">{myTicket.number}</p>
          <p className="text-2xl font-semibold">Silakan Menuju ke Loket Teller</p>
        </div>
      );
    }

    // KASUS 4: Tiket sudah selesai
    if (myTicket.status === 'completed') {
      return (
        <div className="text-center space-y-6 p-8">
          <div className="p-4 bg-green-500/10 rounded-full inline-block">
            <Check className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">Selesai Dilayani</h2>
          <p className="text-6xl font-bold text-muted-foreground">{myTicket.number}</p>
          <p className="text-muted-foreground">Terima kasih telah menggunakan layanan kami.</p>
        </div>
      );
    }

    return null; // Fallback
  };

  // ==== BLOK 5: RENDER TAMPILAN (JSX) ====
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm">
        {renderStatusContent()}
      </Card>
      <Button asChild variant="ghost" className="mt-6 text-primary-foreground/70 hover:text-primary-foreground">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Menu Utama
        </Link>
      </Button>
    </div>
  );
};

export default StatusPage;
