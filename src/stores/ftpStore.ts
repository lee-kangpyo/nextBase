import { create } from 'zustand';

interface FtpStore {
  selectedAttachId: number | null;
  setSelectedAttachId: (attachId: number | null) => void;
  resetSelectedAttachId: () => void;
}

export const useFtpStore = create<FtpStore>((set) => ({
  selectedAttachId: null,
  setSelectedAttachId: (attachId: number | null) =>
    set({ selectedAttachId: attachId }),
  resetSelectedAttachId: () => set({ selectedAttachId: null }),
}));
