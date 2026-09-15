import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ViolinStringProduct {
  id: string;
  brand: string;
  note: string; // G,D,A,E
}

interface StringsState {
  inventory: ViolinStringProduct[];
}

const initialState: StringsState = {
  inventory: [],
};

const stringsSlice = createSlice({
  name: 'strings',
  initialState,
  reducers: {
    addStringProduct: (state, action: PayloadAction<ViolinStringProduct>) => {
      state.inventory.push(action.payload);
      console.log('[Redux -Inventario] Producto agregado:', action.payload);
      console.log('[Redux -Inventario] Total en inventario:', state.inventory.length);
    },
  },
});

export const { addStringProduct } = stringsSlice.actions;
export default stringsSlice.reducer;