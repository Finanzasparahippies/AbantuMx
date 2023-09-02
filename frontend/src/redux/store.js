import { configureStore } from '@reduxjs/toolkit';
//Reducers
import solicitudDataReducer from '../reducers/viajes/solicitudData';
import viajeDataReducer from '../reducers/viajes/viajeData';


export default configureStore({
    reducer: {
        solicitudData: solicitudDataReducer,
        viajeData: viajeDataReducer
    },
});