import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPERTOIRE_STORAGE_KEY = '@bachtuner_repertoire';

export interface SongItem {
  id: string;
  title: string;
  composer: string;
  tutorialUrl?: string;
  notes?: string;
}

interface RepertoireState {
  songs: SongItem[];
  loading: boolean;
}

const initialState: RepertoireState = {
  songs: [
    {
      id: '1',
      title: 'Merry Go Round of Life',
      composer: 'Joe Hisaishi',
      tutorialUrl: 'https://youtu.be/BrOjFXM-1qw?si=hlpl4Nur0VCO9-8P',
      notes: 'Tocar en Sol menor, cuidar afinación en cuerdas dobles.',
    },
    {
      id: '2',
      title: 'Minuet 1',
      composer: 'J.S. Bach',
      tutorialUrl: 'https://youtu.be/PO69MCdCzU0?si=fD565f4cA5FwJWXj',
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