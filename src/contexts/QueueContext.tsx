// ==== BLOK 1: SETUP & IMPORT ====
import React from 'react';
// FIX: Memperbaiki jalur import agar sesuai dengan struktur folder Anda
import { supabase } from '@/integrations/supabase/client';

// Mendefinisikan 'bentuk' atau tipe data dari sebuah antrean.
export interface Queue {
  id: number;
  number: string;
  status: 'waiting' | 'serving' | 'completed';
  timestamp: string;
  servedAt?: string | null;
}

// Mendefinisikan semua data dan fungsi yang akan disediakan oleh Context ini.
interface QueueContextType {
  queues: Queue[];
  isSimulating: boolean;
  addToQueue: () => Promise<string | null>;
  callNext: () => void;
  completeServing: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetQueue: () => void;
}

const QueueContext = React.createContext<QueueContextType | undefined>(undefined);


// ==== BLOK 2: KOMPONEN PROVIDER (OTAK APLIKASI) ====
export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queues, setQueues] = React.useState<Queue[]>([]);
  const [isSimulating, setIsSimulating] = React.useState(false);
  
  const addingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const processingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Fungsi untuk mengambil semua data antrean dari Supabase.
  const fetchQueues = async () => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error) console.error('Error fetching queues:', error);
    else setQueues(data || []);
  };

  // Mengambil data awal dan setup listener realtime.
  React.useEffect(() => {
    fetchQueues();
    const channel = supabase
      .channel('queues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues' }, fetchQueues)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fungsi untuk menambahkan satu tiket antrean baru.
  const addToQueue = async (): Promise<string | null> => {
    const { count, error: countError } = await supabase
      .from('queues')
      .select('*', { count: 'exact', head: true });
    if (countError) { console.error("Error getting queue count:", countError); return null; }
    const lastNumber = count ?? 0;
    if (lastNumber >= 200) { if (isSimulating) stopSimulation(); return null; }
    const queueNumber = `A${String(lastNumber + 1).padStart(3, '0')}`;
    const newQueue = { number: queueNumber, status: 'waiting' as const, timestamp: new Date().toISOString() };
    const { error } = await supabase.from('queues').insert(newQueue);
    if (error) { console.error('Error adding to queue:', error); return null; }
    return queueNumber;
  };

  // Fungsi untuk memanggil antrean berikutnya.
  const callNext = async () => {
    const { data: servingData } = await supabase.from('queues').select('id').eq('status', 'serving').limit(1).single();
    if(servingData) return; // Jangan panggil jika sudah ada yang dilayani

    const { data, error } = await supabase
        .from('queues')
        .select('id')
        .eq('status', 'waiting')
        .order('timestamp', {ascending: true})
        .limit(1)
        .single();
    if (error || !data) return;
    await supabase.from('queues').update({ status: 'serving', servedAt: new Date().toISOString() }).eq('id', data.id);
  };

  // Fungsi untuk menyelesaikan layanan.
  const completeServing = async () => {
    const { data, error } = await supabase
        .from('queues')
        .select('id')
        .eq('status', 'serving')
        .limit(1)
        .single();
    if (error || !data) return;
    await supabase.from('queues').update({ status: 'completed' }).eq('id', data.id);
  };
  
  // ==== INI BAGIAN PERBAIKANNYA: SIMULASI YANG LEBIH CERDAS ====
  
  // Fungsi ini adalah satu siklus kerja "teller otomatis".
  const runSimulationStep = async () => {
      console.log("Simulasi: Menjalankan satu langkah pemrosesan...");
      // Pertama, selesaikan yang sedang dilayani (jika ada).
      await completeServing();
      // Kemudian, beri jeda singkat agar database sempat update, lalu panggil berikutnya.
      setTimeout(() => {
        callNext();
      }, 500); // jeda 0.5 detik
  };

  // Fungsi untuk memulai simulasi.
  const startSimulation = async () => {
    setIsSimulating(true);

    // LANGKAH 1: PANGGIL TIKET PERTAMA SECARA LANGSUNG
    console.log("Simulasi: Memulai... Memeriksa antrian awal.");
    // Periksa apakah sudah ada yang menunggu. Jika belum, tambahkan satu.
    const { data: waitingData } = await supabase.from('queues').select('id').eq('status', 'waiting').limit(1).single();
    if (!waitingData) {
      console.log("Simulasi: Tidak ada yang menunggu, menambahkan tiket pertama.");
      await addToQueue();
    }
    // Langsung panggil antrian pertama tanpa menunggu.
    console.log("Simulasi: Langsung memanggil antrian pertama.");
    setTimeout(() => callNext(), 500); // Beri jeda 0.5 detik

    // LANGKAH 2: MULAI PROSES REGULER
    // Mulai menambahkan tiket baru setiap 2 detik.
    addingIntervalRef.current = setInterval(addToQueue, 2000);
    // Mulai memproses (menyelesaikan & memanggil) antrean setiap 5 detik.
    processingIntervalRef.current = setInterval(runSimulationStep, 5000);
  };

  // Fungsi untuk menghentikan SEMUA proses simulasi.
  const stopSimulation = () => {
    setIsSimulating(false);
    // Hentikan kedua timer dengan aman
    if (addingIntervalRef.current) clearInterval(addingIntervalRef.current);
    if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
    // Reset ref agar tidak ada proses yang berjalan di latar belakang
    addingIntervalRef.current = null;
    processingIntervalRef.current = null;
  };

  // Fungsi untuk mereset/menghapus semua antrean.
  const resetQueue = async () => {
    stopSimulation();
    await supabase.from('queues').delete().neq('id', -1);
  };

  // ==== BLOK 4: MENYEDIAKAN DATA & FUNGSI ====
  return (
    <QueueContext.Provider
      value={{ queues, isSimulating, addToQueue, callNext, completeServing, startSimulation, stopSimulation, resetQueue }}
    >
      {children}
    </QueueContext.Provider>
  );
};

// Hook kustom untuk mempermudah penggunaan context.
export const useQueue = () => {
  const context = React.useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

