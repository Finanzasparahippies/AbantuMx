import { createSlice } from "@reduxjs/toolkit";

export const solicitudDataSlice = createSlice({
    name: "solicitudData",
    initialState: {
        campo: "",
        id: "",
        cantidad: "",
        folio: "",
        asociadosReq: [],
        fecha: "",
    },
    reducers: {
       setData: (state, action) => {
           state.campo = action.payload.campo;
           state.id = action.payload.id;
           state.cantidad = action.payload.cantidad;
           state.folio = action.payload.folio;
           state.asociadosReq = action.payload.asociadosReq;
           state.fecha = action.payload.fecha;
       },
       unsetData: (state) => {
        state.campo = "";
        state.id = "";
        state.cantidad = "";
        state.folio = "";
        state.asociadosReq = [];
        state.fecha = "";
    },
    },
});


export const { setData, unsetData } = solicitudDataSlice.actions;

export default solicitudDataSlice.reducer;