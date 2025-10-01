import { useEffect } from 'react';
import { useQueue } from '@/contexts/QueueContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PhoneCall, CheckCircle, Users, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const TellerPage = () => {
  const {
    queues,
    currentServing,
    callNext,
    completeServing,
    getWaitingCount,
    getServingCount,
    getTotalServed,
  } = useQueue();

  const handleCallNext = () => {
    if (currentServing) {
      toast.error('Selesaikan pelayanan saat ini terlebih dahulu');
      return;
    }
    
    if (getWaitingCount() === 0) {
      toast.info('Tidak ada antrian menunggu');
      return;
    }
    
    callNext();
    toast.success('Nomor antrian dipanggil');
  };

  const handleComplete = () => {
    if (!currentServing) {
      toast.error('Tidak ada pelayanan yang sedang berlangsung');
      return;
    }
    
    completeServing();
    toast.success('Pelayanan selesai');
  };

  // Auto call next after 10 seconds if no one is being served
  useEffect(() => {
    if (!currentServing && getWaitingCount() > 0) {
      const timer = setTimeout(() => {
        callNext();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [currentServing, getWaitingCount, callNext]);

  const waitingQueues = queues.filter(q => q.status === 'waiting').slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary text-primary-foreground p-6 shadow-elegant">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center">
            <PhoneCall className="mr-3 w-8 h-8" />
            Dashboard Teller
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Kelola antrian nasabah dengan efisien
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="text-3xl font-bold text-primary">{getWaitingCount()}</p>
              </div>
              <Users className="w-10 h-10 text-primary/30" />
            </div>
          </Card>

          <Card className="p-6 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sedang Dilayani</p>
                <p className="text-3xl font-bold text-accent">{getServingCount()}</p>
              </div>
              <Clock className="w-10 h-10 text-accent/30" />
            </div>
          </Card>

          <Card className="p-6 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-3xl font-bold text-green-600">{getTotalServed()}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Antrian</p>
                <p className="text-3xl font-bold text-foreground">{queues.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary/30" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Serving */}
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Clock className="mr-2 text-accent" />
              Sedang Dilayani
            </h2>
            
            {currentServing ? (
              <div className="space-y-6">
                <div className="text-center p-8 gradient-gold rounded-xl">
                  <p className="text-sm text-accent-foreground/70 mb-2">Nomor Antrian</p>
                  <p className="text-7xl font-bold text-accent-foreground animate-pulse-slow">
                    {currentServing}
                  </p>
                </div>
                
                <Button
                  onClick={handleComplete}
                  variant="default"
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  <CheckCircle className="mr-2 w-5 h-5" />
                  Selesai Melayani
                </Button>
              </div>
            ) : (
              <div className="text-center p-12 bg-muted/50 rounded-xl">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada yang sedang dilayani</p>
                <Button
                  onClick={handleCallNext}
                  variant="hero"
                  size="lg"
                  className="mt-6 h-14 text-lg"
                >
                  <PhoneCall className="mr-2 w-5 h-5" />
                  Panggil Antrian Berikutnya
                </Button>
              </div>
            )}
          </Card>

          {/* Waiting List */}
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Users className="mr-2 text-primary" />
              Antrian Menunggu ({getWaitingCount()})
            </h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {waitingQueues.length > 0 ? (
                waitingQueues.map((queue, index) => (
                  <div
                    key={queue.number}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg transition-smooth hover:bg-secondary/70"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{queue.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(queue.timestamp).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
                      Menunggu
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 bg-muted/50 rounded-xl">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Tidak ada antrian menunggu</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TellerPage;
