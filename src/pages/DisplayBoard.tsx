// ==== BLOK 1: IMPORT KOMPONEN & FUNGSI ====
import { useQueue } from '@/contexts/QueueContext';
import { Card } from '@/components/ui/card';
import { Monitor, Clock, Users } from 'lucide-react';

// ==== BLOK 2: DEFINISI KOMPONEN DISPLAYBOARD ====
const DisplayBoard = () => {
  // Mengambil HANYA 'queues' dari Context. Ini adalah satu-satunya sumber data kita.
  const { queues } = useQueue();

  // ==== BLOK 3: PENGHITUNGAN DATA (BAGIAN YANG DIPERBAIKI) ====
  // Sama seperti di TellerPage, kita hitung semua nilai yang dibutuhkan
  // langsung dari array 'queues' yang selalu ter-update.
  const servingQueue = queues.find(q => q.status === 'serving');
  const waitingCount = queues.filter(q => q.status === 'waiting').length;
  const completedCount = queues.filter(q => q.status === 'completed').length;
  
  // Mengambil 5 antrean yang baru saja selesai untuk ditampilkan.
  const recentlyServed = queues
    .filter(q => q.status === 'completed')
    .sort((a, b) => new Date(b.servedAt!).getTime() - new Date(a.servedAt!).getTime()) // Urutkan dari yang terbaru
    .slice(0, 5);

  // Mengambil 5 antrean berikutnya yang sedang menunggu.
  const upcomingQueues = queues
    .filter(q => q.status === 'waiting')
    .slice(0, 5);

  // ==== BLOK 4: RENDER TAMPILAN (JSX) ====
  // Di bawah ini adalah kode untuk menampilkan seluruh halaman.
  // Semua nilai statistik sekarang menggunakan variabel yang kita hitung di BLOK 3.
  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-primary-foreground space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Monitor className="w-12 h-12 text-accent animate-shine" />
          </div>
          <h1 className="text-5xl font-bold">BANK ANTRIAN SYSTEM</h1>
          <p className="text-xl text-primary-foreground/80">Display Board</p>
        </div>

        {/* Tampilan Nomor yang Sedang Dilayani */}
        <Card className="p-12 bg-card/95 backdrop-blur-sm border-accent/30">
          <div className="text-center space-y-4">
            <p className="text-2xl text-muted-foreground font-medium">
              NOMOR ANTRIAN YANG DILAYANI
            </p>
            {servingQueue ? (
              <div className="gradient-gold rounded-3xl p-12 shadow-gold">
                <p className="text-9xl font-bold text-accent-foreground animate-pulse-slow">
                  {servingQueue.number}
                </p>
              </div>
            ) : (
              <div className="p-12 bg-muted/50 rounded-3xl">
                <p className="text-4xl text-muted-foreground">
                  Menunggu Panggilan Berikutnya...
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daftar "Baru Saja Dilayani" */}
          <Card className="p-8 bg-card/95 backdrop-blur-sm border-green-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-foreground">
              <Clock className="mr-3 text-green-500" />
              Baru Saja Dilayani
            </h2>
            <div className="space-y-3">
              {recentlyServed.length > 0 ? (
                recentlyServed.map((queue, index) => (
                  <div
                    key={queue.id}
                    className={`p-4 rounded-lg transition-smooth ${
                      index === 0
                        ? 'bg-green-500/20 border-2 border-green-500/30'
                        : 'bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {queue.number}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {queue.servedAt
                          ? new Date(queue.servedAt).toLocaleTimeString('id-ID')
                          : '-'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Belum ada yang dilayani</p>
                </div>
              )}
            </div>
          </Card>

          {/* Daftar "Antrian Berikutnya" */}
          <Card className="p-8 bg-card/95 backdrop-blur-sm border-primary/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-foreground">
              <Users className="mr-3 text-primary" />
              Antrian Berikutnya ({waitingCount})
            </h2>
            <div className="space-y-3">
              {upcomingQueues.length > 0 ? (
                upcomingQueues.map((queue, index) => (
                  <div
                    key={queue.id}
                    className={`p-4 rounded-lg transition-smooth ${
                      index === 0
                        ? 'gradient-primary border-2 border-primary/30'
                        : 'bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${
                          index === 0 ? 'text-primary-foreground' : 'text-foreground'
                        }`}
                      >
                        {queue.number}
                      </span>
                      <span
                        className={`text-sm ${
                          index === 0
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {new Date(queue.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Tidak ada antrian menunggu</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Footer Info Statistik */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-accent/10">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
              Antrian Menunggu: {waitingCount}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Total Dilayani: {completedCount}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DisplayBoard;
