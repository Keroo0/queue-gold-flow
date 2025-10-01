import { useState } from 'react';
import { useQueue } from '@/contexts/QueueContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ticket, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

const TicketPage = () => {
  const { addToQueue, getWaitingCount } = useQueue();
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);

  const handleGetTicket = () => {
    const ticketNumber = addToQueue();
    if (ticketNumber) {
      setLastTicket(ticketNumber);
      setShowTicket(true);
      toast.success('Tiket berhasil diambil!');
      
      // Hide ticket after 5 seconds
      setTimeout(() => {
        setShowTicket(false);
      }, 5000);
    } else {
      toast.error('Antrian penuh! Maksimum 200 orang.');
    }
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Antrian Menunggu</p>
                <p className="text-3xl font-bold text-foreground">{getWaitingCount()}</p>
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
                  {Math.ceil(getWaitingCount() / 6)} min
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Ticket Display */}
        {showTicket && lastTicket && (
          <Card className="p-8 bg-card shadow-gold border-accent/30 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">Nomor Antrian Anda</p>
              <div className="text-7xl font-bold gradient-gold bg-clip-text text-transparent">
                {lastTicket}
              </div>
              <p className="text-sm text-muted-foreground">
                Mohon tunggu panggilan Anda di display board
              </p>
            </div>
          </Card>
        )}

        {/* Get Ticket Button */}
        <div className="flex justify-center">
          <Button
            variant="gold"
            size="lg"
            onClick={handleGetTicket}
            className="text-lg h-16 px-12 rounded-2xl"
          >
            <Ticket className="w-6 h-6 mr-2" />
            Ambil Nomor Antrian
          </Button>
        </div>

        {/* Info */}
        <Card className="p-6 bg-card/70 backdrop-blur-sm border-primary/10">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
              Waktu pemrosesan: 10 detik per nasabah
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
              Kapasitas maksimal: 200 antrian
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
              Simpan nomor antrian Anda dengan baik
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketPage;
