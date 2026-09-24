import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPERTOIRE_STORAGE_KEY = '@bachtuner_repertoire';

export interface SongItem {
  id: string;
  title: string;
  composer: string;
  tutorialUrl?: string;
  notes?: string;
  pdfUri?: string;
  pdfName?: string;
}

interface RepertoireState {
  songs: SongItem[];
  loading: boolean;
}

const initialState: RepertoireState = {
  songs: [
    {
      id: '3',
      title: 'Merry Go Round of Life',
      composer: 'Joe Hisaishi',
      tutorialUrl: 'https://www.youtube.com/watch?v=BrOjFXM-1qw',
      notes: 'Tocar en Sol menor, cuidar afinación en cuerdas dobles.',
    },
    {
      id: '4',
      title: 'Minuet 1',
      composer: 'J.S. Bach',
      tutorialUrl: 'https://www.youtube.com/watch?v=PO69MCdCzU0',
      notes: 'Suzuki Libro 1. Arco suave en las corcheas.',
    },
  ],
  loading: false,
};

export const loadSavedSongs = createAsyncThunk(
  'repertoire/loadSavedSongs',
  async () => {
    const data = await AsyncStorage.getItem(REPERTOIRE_STORAGE_KEY);
    return data ? (JSON.parse(data) as SongItem[]) : initialState.songs;
  }
);

const repertoireSlice = createSlice({
  name: 'repertoire',
  initialState,
  reducers: {
    addSong: (state, action: PayloadAction<SongItem>) => {
      state.songs.unshift(action.payload);
      AsyncStorage.setItem(REPERTOIRE_STORAGE_KEY, JSON.stringify(state.songs));
      console.log('[Redux Persistente] Obra agregada al repertorio:', action.payload);
    },
    removeSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter((song) => song.id !== action.payload);
      AsyncStorage.setItem(REPERTOIRE_STORAGE_KEY, JSON.stringify(state.songs));
      console.log('[Redux Persistente] Obra eliminada, ID:', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSavedSongs.fulfilled, (state, action) => {
      state.songs = action.payload;
    });
  },
});

export const { addSong, removeSong } = repertoireSlice.actions;
export default repertoireSlice.reducer;