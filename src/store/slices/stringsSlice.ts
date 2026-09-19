import { createSlice, PayloadAction,createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STRINGS_STORAGE_KEY='@bachtuner_strings_inventory';

export interface ViolinStringProduct {
  id: string;
  brand: string;
  note: string; // G,D,A,E
installedDate:string;
type:'single' |'full_set';

}

interface StringsState {
  inventory: ViolinStringProduct[];
  loading:boolean;
}

const initialState: StringsState = {
  inventory: [],
  loading:false,
};

export const loadSavedStrings = createAsyncThunk(
  'strings/loadSavedStrings',
  async () => {
    const data = await AsyncStorage.getItem(STRINGS_STORAGE_KEY);
    return data ? (JSON.parse(data) as ViolinStringProduct[]) : [];
  }
);

export const saveStringsToStorage = createAsyncThunk(
  'strings/saveStringsToStorage',
  async (newInventory: ViolinStringProduct[]) => {
    await AsyncStorage.setItem(STRINGS_STORAGE_KEY, JSON.stringify(newInventory));
    return newInventory;
  }
);

const stringsSlice = createSlice({
  name: 'strings',
  initialState,
  reducers: {
    addStringProduct: (state, action: PayloadAction<ViolinStringProduct>) => {
      state.inventory.unshift(action.payload);
      AsyncStorage.setItem(STRINGS_STORAGE_KEY, JSON.stringify(state.inventory));
      console.log('[Redux Persistente] Cuerda guardada en disco: ', action.payload);
    },
    removeStringProduct: (state, action: PayloadAction<string>) => {
      state.inventory = state.inventory.filter((item) => item.id !== action.payload);
      AsyncStorage.setItem(STRINGS_STORAGE_KEY, JSON.stringify(state.inventory));
      console.log('[Redux Persistente] Cuerda eliminada, ID: ', action.payload);
    },
    clearInventory: (state) => {
      state.inventory = [];
      AsyncStorage.removeItem(STRINGS_STORAGE_KEY);
      console.log(' [Redux Persistente] Inventario limpiado por cierre de sesion');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadSavedStrings.fulfilled, (state, action) => {
      state.inventory = action.payload;
    });
  },
});

export const { addStringProduct,removeStringProduct,clearInventory } = stringsSlice.actions;
export default stringsSlice.reducer;