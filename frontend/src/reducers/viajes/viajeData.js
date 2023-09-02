import { createSlice } from "@reduxjs/toolkit";

export const viajeDataSlice = createSlice({
    name: "viajeData",
    initialState: {
        viaje: "",
        folio: "",
        campo: "",
        status: "",
        origen: "",
    },
    reducers: {
       setData: (state, action) => {
            state.viaje = action.payload.viaje;
            state.folio = action.payload.folio;
            state.campo = action.payload.campo;
            state.status = action.payload.status;
            state.origen = action.payload.origen;
       },
       unsetData: (state) => {
        state.viaje = "";
        state.folio = "";
        state.campo = "";
        state.status = "";
        state.origen = "";
    },
    },
});


export const { setData, unsetData } = viajeDataSlice.actions;

export default viajeDataSlice.reducer;