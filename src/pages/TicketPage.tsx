// ==== BLOK 1: IMPORT & SETUP ====
import { useState } from 'react';
import { useQueue } from '@/contexts/QueueContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ticket, Users, Clock, Play, Square, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const TicketPage = () => {
  // ==== BLOK 2: MENGAMBIL DATA DARI CONTEXT ====
  const { queues, isSimulating, addToQueue, startSimulation, stopSimulation, resetQueue } = useQueue();
  
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  
  const waitingCount = queues.filter(q => q.status === 'waiting').length;

  // ==== BLOK 3: FUNGSI HANDLER ====
  const handleGetTicket = async () => {
    const ticketNumber = await addToQueue();
    if (ticketNumber) {
      setLastTicket(ticketNumber);
      setShowTicket(true);
      toast.success(`Tiket ${ticketNumber} berhasil diambil!`);
      
      setTimeout(() => {
        setShowTicket(false);
      }, 5000);
    } else {
      toast.error('Antrian penuh atau terjadi error.');
    }
  };

  const handleResetQueue = () => {
    resetQueue();
    toast.warning("Semua data antrian telah direset.");
  }

  // ==== BLOK 4: RENDER TAMPILAN (JSX) ====
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
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

        {/* Kartu Statistik */}
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

        {/* Kartu Tiket (dengan perbaikan warna final) */}
        {showTicket && lastTicket && (
          <Card className="p-8 bg-card shadow-gold border-accent/30 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">Nomor Antrian Anda</p>
              {/* ==== INI BAGIAN PERBAIKANNYA ==== */}
              {/* 1. Membuat wadah dengan background gradien emas. */}
              {/* 2. Menempatkan teks di dalamnya dengan warna kontras (putih) dan bayangan agar mudah dibaca. */}
              <div className="gradient-gold rounded-xl p-4">
                  <p className="text-7xl font-bold text-center text-primary-foreground [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
                      {lastTicket}
                  </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Mohon tunggu panggilan Anda di display board
              </p>
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

