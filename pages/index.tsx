"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useState, useEffect } from "react";
import {
  estadosConMunicipios,
  codigosPostales,
} from "../data/estadosMunicipiosCP";

import {
  cargos,
  puestos,
  categorias,
  niveles,
  horarios,
  movimientos,
} from "../data/catalogosCampos";

type FormDataType = {
  [key: string]: any;
  folio: string;
  clavePresupuestal: string;
  dependenciaEntidad: string;
  dependenciaDireccion: string;
  nombreTrabajador: string;
  cargo: string;
  puesto: string;
  categoria: string;
  nivel: string;
  rfc: string;
  curp: string;
  horarioTrabajo: string;
  movIncidencia: string;
  sustituyeA: string;
  numerariaAlta: boolean;
  supernumerariaAlta: boolean;
  eventualAlta: boolean;
  percepcionSugeridaSueldoBase: string;
  percepcionSugeridaCompenExt: string;
  percepcionSugeridaProductividad: string;
  percepcionSugeridaPrestaciones: string;
  percepcionSugeridaNivelTab: string;
  percepcionSugeridaTotal: string;
  altaTipo: string;
  interinato: string;
  interinatoCheckbox: boolean;
  domicilioCalle: string;
  domicilioColonia: string;
  domicilioNumeroExt: string;
  haEstadoAfiliadoIMSS: string;
  numAfiliacionIMSS: string;
  padre: string;
  madre: string;
  lugarNacimientoEstado: string;
  fechaNacimientoIMSS: string;
  numerariaBaja: boolean;
  supernumerariaBaja: boolean;
  renunciaBaja: boolean;
  fallecimientoBaja: boolean;
  despidoJustificadoBaja: boolean;
  invalidezBaja: boolean;
  pensionBaja: boolean;
  otrosBaja: string;
  percepcionActualSueldoBase: string;
  percepcionActualCompenExt: string;
  percepcionActualProductividad: string;
  percepcionActualPrestaciones: string;
  percepcionActualNivelTab: string;
  percepcionActualTotal: string;
  restructuracionMod: boolean;
  percepcionesMod: boolean;
  percepcionSugeridaModSueldoBase: string;
  percepcionSugeridaModCompenExt: string;
  percepcionSugeridaModProductividad: string;
  percepcionSugeridaModPrestaciones: string;
  percepcionSugeridaModNivelTab: string;
  percepcionSugeridaModTotal: string;
  cambioDeClave: boolean;
  reembolsoPorDescuento: boolean;
  reembolsoTotal: string;
  reembolsoMotivo: string;
  pagoPorUnicaVez: boolean;
  pagoUnicaVezTotal: string;
  pagoUnicaVezMotivo: string;
  cambioDeHorario: boolean;
  horarioAnterior: string;
  horarioNuevo: string;
  faltasCheckbox: boolean;
  faltasDiasInicio: string;
  faltasDiasFin: string;
  faltasConGoceSueldo: boolean;
  faltasSinGoceSueldo: boolean;
  permisoCheckbox: boolean;
  permisoDiasInicio: string;
  permisoDiasFin: string;
  permisoMotivo: string;
  permisoConGoceDeSueldo: boolean; // Renombrado de 'conGoceDeSueldo' para mayor claridad si se usa solo en permiso
  permisoSinGoceDeSueldo: boolean; // Renombrado de 'sinGoceDeSueldo' para mayor claridad si se usa solo en permiso
  vacacionesCheckbox: boolean;
  vacacionesDiasInicio: string;
  vacacionesDiasFin: string;
  vacacionesPeriodoDe: string;
  vacacionesPeriodoAl: string;
  retardosCheckbox: boolean;
  retardosCantidadInicio: string;
  retardosCantidadFin: string;
  movimientoCheckbox: boolean;
  movimientoFecha: string;
  movimientoMotivo: string;
  justificar: boolean;
  fechaJustificar: string;
  motivoJustificar: string;
  incapacidadEnfermedad: boolean;
  incapacidadMaternidad: boolean;
  incapacidadRiesgoTrabajo: boolean;
  incapacidadDias: string;
  incapacidadPeriodo: string;
  permisoLactanciaDias: string;
  permisoLactanciaPeriodo: string;
  permisoLactanciaHorario: string;
  suspensionDias: string;
  suspensionPeriodo: string;
  suspensionMotivo: string;
  reanudacionDia: string;
  reanudacionMes: string;
  reanudacionAnio: string;
  reanudacionMotivo: string;
  quinqueniosNumero: string;
  observaciones: string;
  solicitaNombre: string;
  solicitaCargo: string;
  solicitaFecha: string;
  solicitaFirma: string; // Puede que necesites manejar esto como un archivo o URL
  autorizaNombre: string;
  autorizaCargo: string;
  autorizaFecha: string;
  autorizaFirma: string; // Puede que necesites manejar esto como un archivo o URL
  voboNombre: string;
  voboCargo: string;
  voboFecha: string;
  voboFirma: string; // Puede que necesites manejar esto como un archivo o URL
  // Added for ALTA EN / BAJA EN dynamic fields
  altaEn0: string;
  altaEn1: string;
  altaEn2: string;
  altaEn3: string;
  altaEn4: string;
  altaEn5: string;
  altaEn6: string;
  altaEn7: string;
  altaEn8: string;
  altaEn9: string;
  altaEn10: string;
  bajaEn0: string;
  bajaEn1: string;
  bajaEn2: string;
  bajaEn3: string;
  bajaEn4: string;
  bajaEn5: string;
  bajaEn6: string;
  bajaEn7: string;
  bajaEn8: string;
  bajaEn9: string;
  bajaEn10: string;
  // Added for FALTAS, RETARDOS, VACACIONES split days
  faltasDias1: string;
  faltasDias2: string;
  retardosCantidad1: string;
  retardosCantidad2: string;
  vacacionesDias1: string;
  vacacionesDias2: string;
  vacacionesPeriodo: string;
  vacacionesDe: string;
  vacacionesAl: string;
  permisoDias1: string;
  permisoDias2: string;
  // Si 'conGoceDeSueldo' y 'sinGoceDeSueldo' son generales y no solo de permiso,
  // pueden quedarse como estaban, de lo contrario, úsalos como 'permisoConGoceDeSueldo' etc.
  conGoceDeSueldo: boolean;
  sinGoceDeSueldo: boolean;
};

// Componente del modal de mensaje (se mantiene igual, no lo modifiques en tu diseño)
interface MessageModalProps {
  message: string;
  onClose: () => void;
}

// Componente modal
const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
export default function FormularioIncidenciaGEA() {
  // Función para obtener la fecha actual en formatoYYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
const extraerDesdeCURP = (curp: string) => {
  const fecha = curp.slice(4, 10); // YYMMDD
  const sexo = curp.charAt(10);   // H o M
  const estado = curp.slice(11, 13); // Clave de estado

  return {
    fechaNacimiento: fecha,
    sexo,
    lugarNacimientoEstado: estado,
  };
};

  // Estado para los datos del formulario

  const [formData, setFormData] = useState<FormDataType>({
    folio: "",
    clavePresupuestal: "",
    dependenciaEntidad: "",
    dependenciaDireccion: "",
    nombreTrabajador: "",
    cargo: "",
    puesto: "",
    categoria: "",
    nivel: "",
    rfc: "",
    curp: "",
    horarioTrabajo: "",
    movIncidencia: "",
    sustituyeA: "",
    numerariaAlta: false,
    supernumerariaAlta: false,
    eventualAlta: false,
    percepcionSugeridaSueldoBase: "",
    percepcionSugeridaCompenExt: "",
    percepcionSugeridaProductividad: "",
    percepcionSugeridaPrestaciones: "",
    percepcionSugeridaNivelTab: "",
    percepcionSugeridaTotal: "",
    altaTipo: "",
    interinato: "",
    interinatoCheckbox: false,
    domicilioCalle: "",
    domicilioColonia: "",
    domicilioNumeroExt: "",
    haEstadoAfiliadoIMSS: "",
    numAfiliacionIMSS: "",
    padre: "",
    madre: "",
    lugarNacimientoEstado: "",
    fechaNacimientoIMSS: "",
    numerariaBaja: false,
    supernumerariaBaja: false,
    renunciaBaja: false,
    fallecimientoBaja: false,
    despidoJustificadoBaja: false,
    invalidezBaja: false,
    pensionBaja: false,
    otrosBaja: "",
    percepcionActualSueldoBase: "",
    percepcionActualCompenExt: "",
    percepcionActualProductividad: "",
    percepcionActualPrestaciones: "",
    percepcionActualNivelTab: "",
    percepcionActualTotal: "",
    restructuracionMod: false,
    percepcionesMod: false,
    percepcionSugeridaModSueldoBase: "",
    percepcionSugeridaModCompenExt: "",
    percepcionSugeridaModProductividad: "",
    percepcionSugeridaModPrestaciones: "",
    percepcionSugeridaModNivelTab: "",
    percepcionSugeridaModTotal: "",
    cambioDeClave: false,
    reembolsoPorDescuento: false,
    reembolsoTotal: "",
    reembolsoMotivo: "",
    pagoPorUnicaVez: false,
    pagoUnicaVezTotal: "",
    pagoUnicaVezMotivo: "",
    cambioDeHorario: false,
    horarioAnterior: "",
    horarioNuevo: "",
    faltasCheckbox: false,
    faltasDiasInicio: "",
    faltasDiasFin: "",
    faltasConGoceSueldo: false,
    faltasSinGoceSueldo: false,
    permisoCheckbox: false,
    permisoDiasInicio: "",
    permisoDiasFin: "",
    permisoMotivo: "",
    permisoConGoceDeSueldo: false,
    permisoSinGoceDeSueldo: false,
    vacacionesCheckbox: false,
    vacacionesDiasInicio: "",
    vacacionesDiasFin: "",
    vacacionesPeriodoDe: "",
    vacacionesPeriodoAl: "",
    retardosCheckbox: false,
    retardosCantidadInicio: "",
    retardosCantidadFin: "",
    movimientoCheckbox: false,
    movimientoFecha: "",
    movimientoMotivo: "",
    justificar: false,
    fechaJustificar: "",
    motivoJustificar: "",
    incapacidadEnfermedad: false,
    incapacidadMaternidad: false,
    incapacidadRiesgoTrabajo: false,
    incapacidadDias: "",
    incapacidadPeriodo: "",
    permisoLactanciaDias: "",
    permisoLactanciaPeriodo: "",
    permisoLactanciaHorario: "",
    suspensionDias: "",
    suspensionPeriodo: "",
    suspensionMotivo: "",
    reanudacionDia: "",
    reanudacionMes: "",
    reanudacionAnio: "",
    reanudacionMotivo: "",
    quinqueniosNumero: "",
    observaciones: "",
    solicitaNombre: "",
    solicitaCargo: "",
    solicitaFecha: getTodayDate(), // Fecha actual automática
    solicitaFirma: "",
    autorizaNombre: "",
    autorizaCargo: "",
    autorizaFecha: getTodayDate(), // Fecha actual automática
    autorizaFirma: "",
    voboNombre: "",
    voboCargo: "",
    voboFecha: getTodayDate(), // Fecha actual automática
    voboFirma: "",
    // Initialize ALTA EN / BAJA EN
    altaEn0: "",
    altaEn1: "",
    altaEn2: "",
    altaEn3: "",
    altaEn4: "",
    altaEn5: "",
    altaEn6: "",
    altaEn7: "",
    altaEn8: "",
    altaEn9: "",
    altaEn10: "",
    bajaEn0: "",
    bajaEn1: "",
    bajaEn2: "",
    bajaEn3: "",
    bajaEn4: "",
    bajaEn5: "",
    bajaEn6: "",
    bajaEn7: "",
    bajaEn8: "",
    bajaEn9: "",
    bajaEn10: "",
    // Initialize FALTAS, RETARDOS, VACACIONES split days and other missing fields
    faltasDias1: "",
    faltasDias2: "",
    retardosCantidad1: "",
    retardosCantidad2: "",
    vacacionesDias1: "",
    vacacionesDias2: "",
    vacacionesPeriodo: "",
    vacacionesDe: "",
    vacacionesAl: "",
    permisoDias1: "",
    permisoDias2: "",
    conGoceDeSueldo: false,
    sinGoceDeSueldo: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const [estado, setEstado] = useState("");
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [municipio, setMunicipio] = useState("");
  const [cpOpciones, setCpOpciones] = useState<string[]>([]);

  const buscarEmpleado = async () => {
    const res = await fetch(`/api/buscarEmpleado?rfc=${formData.rfc}`);
    if (!res.ok) return alert("Empleado no encontrado");
    const data = await res.json();
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const buscarPorCURP = async () => {
    const res = await fetch(`/api/buscarEmpleado?curp=${formData.curp}`);
    const data = await res.json();
    setFormData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const total =
      parseFloat(formData.percepcionSugeridaSueldoBase || "0") +
      parseFloat(formData.percepcionSugeridaCompenExt || "0") +
      parseFloat(formData.percepcionSugeridaProductividad || "0") +
      parseFloat(formData.percepcionSugeridaPrestaciones || "0");

    setFormData((prev) => ({
      ...prev,
      percepcionSugeridaTotal: total.toFixed(2),
    }));
  }, [
    formData.percepcionSugeridaSueldoBase,
    formData.percepcionSugeridaCompenExt,
    formData.percepcionSugeridaProductividad,
    formData.percepcionSugeridaPrestaciones,
  ]);

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("Formulario de Incidencias Enviado (ver consola para datos)");
  };
  const handleGeneratePDF = async () => {
    const formElement = document.querySelector("form"); // captura todo el formulario completo

    if (formElement) {
      const canvas = await html2canvas(formElement, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Si el contenido es muy largo, paginarlo
      let position = 0;
      let pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      if (pdfHeight > pageHeight) {
        while (position + pageHeight < pdfHeight) {
          position += pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
        }
      }

      pdf.save("Formulario_Incidencias.pdf");
    }
  };
  const inputClass =
    "mt-1 block w-full rounded-md shadow-sm py-4 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"; // Updated inputClass
  const inputStyle = {
    border: "1px solid rgb(209, 213, 219)",
    color: "rgb(17, 24, 39)",
  };
  const labelClass =
    "block text-xs font-semibold text-gray-600 uppercase mb-2 mt-4";
  const sectionTitleClass =
    "bg-blue-800 text-white font-bold uppercase px-6 py-3 w-full rounded-none font-sans text-lg tracking-wide";
  const subSectionTitleClass =
    "text-md font-bold text-blue-700 uppercase mt-6 mb-3 border-b-2 border-blue-200 pb-1";
  useEffect(() => {
    setMunicipios(estadosConMunicipios[estado] || []);
    setMunicipio("");
  }, [estado]);

  useEffect(() => {
    setCpOpciones(codigosPostales[municipio] || []);
  }, [municipio]);
useEffect(() => {
  localStorage.setItem("formData", JSON.stringify(formData));
}, [formData]);
useEffect(() => {
  const data = localStorage.getItem("formData");
  if (data) setFormData(JSON.parse(data));
}, []);
useEffect(() => {
  if (formData.curp.length >= 13) {
    const { fechaNacimiento, sexo, lugarNacimientoEstado } = extraerDesdeCURP(formData.curp);
    setFormData((prev) => ({
      ...prev,
      fechaNacimiento,
      sexo,
      lugarNacimientoEstado,
    }));
  }
}, [formData.curp]);

  const validar = () => {
    const nuevosErrores: any = {};
    if (!formData.rfc) nuevosErrores.rfc = "RFC obligatorio";
    if (!formData.nombreTrabajador)
      nuevosErrores.nombreTrabajador = "Nombre requerido";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
const pasos = ["Datos", "Laborales", "Percepciones", "Resumen"];
const [pasoActual, setPasoActual] = useState(0);

  const guardar = async () => {
    if (!validar()) return;
    // enviar datos...
  };
const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-white shadow-xl overflow-hidden mt-10 text-gray-900 font-sans border border-gray-200 rounded-lg"
    >
      {/* Encabezado y Logos */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 p-4 sm:p-6 bg-gray-50 border-b border-gray-200 text-center sm:text-left">
        <img
          src="https://seeklogo.com/images/G/gobierno-aguascalientes-logo-B200B12B90-seeklogo.com.png"
          alt="Logo Gobierno de Aguascalientes"
          className="h-16 sm:h-20 w-auto"
        />
        <div className="flex-grow">
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            GOBIERNO DEL ESTADO DE AGUASCALIENTES
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            SECRETARÍA DE ADMINISTRACIÓN
          </p>
          <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">
            SOLICITUD DE MOVIMIENTOS E INCIDENCIAS DEL PERSONAL
          </p>
        </div>
      </div>

      {/* Sección de Folio y Clave Presupuestal */}
      {/* This section already has the desired wrapper structure. */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          DATOS DEL TRABAJADOR
        </div>
        <div className="p-4" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
          <div className="p-4 pt-0 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <label htmlFor="folio" className={labelClass}>
                  FOLIO:
                </label>
                <input
                  name="folio"
                  id="folio"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md shadow-sm py-4 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                  style={{
                    border: "1px solid rgb(209, 213, 219)",
                    color: "rgb(17, 24, 39)",
                  }}
                  readOnly={!!formData.rfc || !!formData.curp}
                />
                <label htmlFor="rfc" className={`${labelClass} mt-4 block`}>
                  R.F.C.:
                </label>
                <input
                  name="rfc"
                  id="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base uppercase"
                  style={{
                    border: "1px solid rgb(209, 213, 219)",
                    color: "rgb(17, 24, 39)",
                  }}
                />{" "}
                {errores.rfc && (
                  <p className="text-red-600 text-sm mt-1">{errores.rfc}</p>
                )}
                <button
                  onClick={buscarEmpleado}
                  type="button"
                  className="px-8 py-3 font-semibold uppercase tracking-wide transition-all duration-300"
          style={{
            backgroundColor: "#1a2b6b",
            color: "#ffffff",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2c3e80")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#1a2b6b")
          }
        >
                  Buscar por RFC
                </button>
              </div>

              <div>
                <label htmlFor="clavePresupuestal" className={labelClass}>
                  CLAVE PRESUPUESTAL:
                </label>
                <input
                  type="text"
                  id="clavePresupuestal"
                  name="clavePresupuestal"
                  value={formData.clavePresupuestal}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label htmlFor="dependenciaEntidad" className={labelClass}>
                  DEPENDENCIA-ENTIDAD:
                </label>
                <input
                  type="text"
                  id="dependenciaEntidad"
                  name="dependenciaEntidad"
                  value={formData.dependenciaEntidad}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="dependenciaDireccion" className={labelClass}>
                  DEPENDENCIA (DIRECCIÓN...):
                </label>
                <input
                  type="text"
                  id="dependenciaDireccion"
                  name="dependenciaDireccion"
                  value={formData.dependenciaDireccion}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección DATOS DEL TRABAJADOR - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing between sections
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          DATOS DEL TRABAJADOR
        </div>
        <div
          className="p-4 space-y-4"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            <div>
              <label htmlFor="nombreTrabajador" className={labelClass}>
                NOMBRE DEL TRABAJADOR:
              </label>
              <input
                type="text"
                id="nombreTrabajador"
                name="nombreTrabajador"
                value={formData.nombreTrabajador}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="cargo" className={labelClass}>
                CARGO:
              </label>
              <input
                type="text"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="puesto" className={labelClass}>
                PUESTO:
              </label>
              <input
                type="text"
                id="puesto"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="categoria" className={labelClass}>
                CATEGORÍA:
              </label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="nivel" className={labelClass}>
                NIVEL:
              </label>
              <input
                type="text"
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
          <label htmlFor="cargo" className={labelClass}>
            CARGO:
          </label>
          <select
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">Selecciona una opción</option>
            {cargos.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="nivel" className={labelClass}>
              NIVEL:
            </label>
            <select
              id="nivel"
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
            >
              <option value="">Selecciona una opción</option>
              {niveles.map((n: string) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <div>
              <label htmlFor="curp" className={labelClass}>
                CURP:
              </label>
              <input
                type="text"
                id="curp"
                name="curp"
                value={formData.curp}
                onChange={handleChange}
                className={inputClass.concat(" uppercase")}
                style={inputStyle}
              />
            </div>
            <div className="lg:col-span-1">
              <label htmlFor="horarioTrabajo" className={labelClass}>
                HORARIO DE TRABAJO:
              </label>
              <input
                type="text"
                id="horarioTrabajo"
                name="horarioTrabajo"
                value={formData.horarioTrabajo}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="8-16 HRS"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección MOV./INCIDENCIAS - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          MOV./INCIDENCIAS
        </div>
        <div
          className="p-4 space-y-4"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm sm:text-base text-gray-700 font-semibold">
              DATOS PARA ALTA EN EL I.M.S.S.
            </p>
          </div>

          <hr className="border-t border-gray-300 my-2" />

          {/* Checkboxes in 2 columns on small, more on larger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center justify-between w-full border-b pb-2">
              <span className="text-sm text-gray-700 font-semibold">
                NUMERARIA
              </span>
              <input
                type="checkbox"
                name="numerariaAlta"
                checked={formData.numerariaAlta}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between w-full border-b pb-2">
              <span className="text-sm text-gray-700 font-semibold">
                SUPERNUMERARIA
              </span>
              <input
                type="checkbox"
                name="supernumerariaAlta"
                checked={formData.supernumerariaAlta}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between w-full border-b pb-2">
              <span className="text-sm text-gray-700 font-semibold">
                INTERINATO
              </span>
              <input
                type="checkbox"
                name="interinatoCheckbox"
                checked={formData.interinatoCheckbox}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between w-full border-b pb-2">
              <span className="text-sm text-gray-700 font-semibold">
                EVENTUAL
              </span>
              <input
                type="checkbox"
                name="eventualAlta"
                checked={formData.eventualAlta}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Sección DAR DE ALTA A UN TRABAJADOR - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          DAR DE ALTA A UN TRABAJADOR
        </div>
        <div
          className="p-4 space-y-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombreTrabajadorMov" className={labelClass}>
                NOMBRE DEL TRABAJADOR:
              </label>
              <input
                type="text"
                id="nombreTrabajadorMov"
                name="nombreTrabajador"
                value={formData.nombreTrabajador}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="sustituyeA" className={labelClass}>
                EL TRABAJADOR DE NUEVO INGRESO SUSTITUYE A:
              </label>
              <input
                type="text"
                id="sustituyeA"
                name="sustituyeA"
                value={formData.sustituyeA}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Percepción Sugerida */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800 uppercase">
              PERCEPCIÓN SUGERIDA:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
              {[
                { id: "percepcionSugeridaSueldoBase", label: "SUELDO BASE" },
                { id: "percepcionSugeridaCompenExt", label: "COMPEN. EXT." },
                {
                  id: "percepcionSugeridaProductividad",
                  label: "PRODUCTIVIDAD",
                },
                { id: "percepcionSugeridaPrestaciones", label: "PRESTACIONES" },
                {
                  id: "percepcionSugeridaTotal",
                  label: "TOTAL",
                  readOnly: true,
                },
                { id: "percepcionSugeridaNivelTab", label: "NIVEL TAB" },
              ].map(({ id, label, readOnly }) => (
                <div key={id}>
                  <label htmlFor={id} className={labelClass}>
                    {label}:
                  </label>
                  <input
                    type="text"
                    id={id}
                    name={id}
                    value={formData[id as keyof typeof formData] as string}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Domicilio Actual */}
          <details className="mb-4">
            <summary className="cursor-pointer font-semibold text-blue-800">
              Domicilio Actual
            </summary>
            <div>
              <input
                type="text"
                id="domicilioCalle"
                name="domicilioCalle"
                value={formData.domicilioCalle}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                placeholder="Calle"
              />
              <input
                type="text"
                id="domicilioColonia"
                name="domicilioColonia"
                value={formData.domicilioColonia}
                onChange={handleChange}
                className={`${inputClass} mt-2`}
                style={inputStyle}
                placeholder="Colonia"
              />
              <input
                type="text"
                id="domicilioNumeroExt"
                name="domicilioNumeroExt"
                value={formData.domicilioNumeroExt}
                onChange={handleChange}
                className={`${inputClass} mt-2`}
                style={inputStyle}
                placeholder="Número Ext."
              />
            </div>
          </details>

          {/* HA ESTADO AFILIADO AL I.M.S.S. and NOMBRE DE LOS PADRES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 uppercase">
                HA ESTADO AFILIADO AL I.M.S.S.
              </span>
              <div className="flex gap-6 mt-2 flex-wrap">
                {["SI", "NO"].map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="haEstadoAfiliadoIMSS"
                      value={option}
                      checked={formData.haEstadoAfiliadoIMSS === option}
                      onChange={handleChange}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 font-semibold">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-800 uppercase">
                NOMBRE DE LOS PADRES (AÚN FINADOS):
              </p>
              <div>
                <label htmlFor="padre" className={labelClass}>
                  PADRE:
                </label>
                <input
                  type="text"
                  id="padre"
                  name="padre"
                  value={formData.padre}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="madre" className={labelClass}>
                  MADRE:
                </label>
                <input
                  type="text"
                  id="madre"
                  name="madre"
                  value={formData.madre}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* NÚM. AFILIACIÓN I.M.S.S. and LUGAR Y FECHA DE NACIMIENTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            {formData.interinatoCheckbox && (
              <div>
                <label htmlFor="numAfiliacionIMSS" className={labelClass}>
                  Tipo de Internato
                </label>
                <input
                  type="text"
                  name="interinato"
                  value={formData.interinato}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  style={inputStyle}
                />
              </div>
            )}

            {formData.haEstadoAfiliadoIMSS === "SI" && (
              <div>
                <label htmlFor="numAfiliacionIMSS" className={labelClass}>
                  NÚM. AFILIACIÓN I.M.S.S.:
                </label>
                <input
                  type="text"
                  id="numAfiliacionIMSS"
                  name="numAfiliacionIMSS"
                  value={formData.numAfiliacionIMSS}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            )}
            {formData.movIncidencia === "Alta" && (
              <input
                name="sustituyeA"
                value={formData.sustituyeA}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            )}
            <div>
              <label htmlFor="lugarNacimientoEstado" className={labelClass}>
                LUGAR Y FECHA DE NACIMIENTO. (ESTADO):
              </label>
              <input
                type="text"
                id="lugarNacimientoEstado"
                name="lugarNacimientoEstado"
                value={formData.lugarNacimientoEstado}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección DAR DE BAJA A UNA PERSONA - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          DAR DE BAJA A UNA PERSONA
        </div>
        <div
          className="p-4 space-y-4"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-800 uppercase">
              ¿Qué tipo de persona es?
            </p>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="numerariaBaja"
                  checked={formData.numerariaBaja}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-red-600"
                />
                <span className="ml-2 text-sm text-gray-700">Numeraria</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="supernumerariaBaja"
                  checked={formData.supernumerariaBaja}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-red-600"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Supernumeraria
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-800 uppercase">
              Motivo de baja
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "renunciaBaja", label: "Renuncia" },
                { name: "fallecimientoBaja", label: "Fallecimiento" },
                {
                  name: "despidoJustificadoBaja",
                  label: "Despido justificado",
                },
                { name: "invalidezBaja", label: "Invalidez" },
                { name: "pensionBaja", label: "Pensión" },
              ].map((item) => (
                <label key={item.name} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name]}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-red-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {item.label}
                  </span>
                </label>
              ))}

              <div className="col-span-full flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label
                  htmlFor="otrosBaja"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  Otros (especificar):
                </label>
                <input
                  type="text"
                  id="otrosBaja"
                  name="otrosBaja"
                  value={formData.otrosBaja}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
            <p className="text-xs italic text-red-700 mt-2 font-semibold">
              * Adjuntar documentos según el motivo de baja
            </p>
          </div>
        </div>
      </div>

      {/* Sección MODIFICACION - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          MODIFICACION
        </div>
        <div
          className="p-4 space-y-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-start space-y-4 pr-4 md:border-r md:border-gray-300 md:pr-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="restructuracionMod"
                  checked={formData.restructuracionMod}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  REESTRUCTURACIÓN
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="percepcionesMod"
                  checked={formData.percepcionesMod}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  PERCEPCIONES
                </span>
              </label>
            </div>

            <div className="flex-grow space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800 uppercase">
                  PERCEPCION ACTUAL:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
                  {[
                    { id: "percepcionActualSueldoBase", label: "SUELDO BASE" },
                    { id: "percepcionActualCompenExt", label: "COMPEN. EXT." },
                    {
                      id: "percepcionActualProductividad",
                      label: "PRODUCTIVIDAD",
                    },
                    {
                      id: "percepcionActualPrestaciones",
                      label: "PRESTACIONES",
                    },
                    { id: "percepcionActualTotal", label: "TOTAL" },
                    { id: "percepcionActualNivelTab", label: "NIVEL TAB." },
                  ].map((item) => (
                    <div key={item.id}>
                      <label htmlFor={item.id} className={labelClass}>
                        {item.label}:
                      </label>
                      <input
                        type="text"
                        id={item.id}
                        name={item.id}
                        value={formData[item.id] ?? ""}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800 uppercase">
                  PERCEPCION SUGERIDA:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
                  {[
                    {
                      id: "percepcionSugeridaModSueldoBase",
                      label: "SUELDO BASE",
                    },
                    {
                      id: "percepcionSugeridaModCompenExt",
                      label: "COMPEN. EXT.",
                    },
                    {
                      id: "percepcionSugeridaModProductividad",
                      label: "PRODUCTIVIDAD",
                    },
                    {
                      id: "percepcionSugeridaModPrestaciones",
                      label: "PRESTACIONES",
                    },
                    { id: "percepcionSugeridaModTotal", label: "TOTAL" },
                    {
                      id: "percepcionSugeridaModNivelTab",
                      label: "NIVEL TAB.",
                    },
                  ].map((item) => (
                    <div key={item.id}>
                      <label htmlFor={item.id} className={labelClass}>
                        {item.label}:
                      </label>
                      <input
                        type="text"
                        id={item.id}
                        name={item.id}
                        value={formData[item.id]}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección CAMBIO DE CLAVE - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          CAMBIO DE CLAVE
        </div>
        <div
          className="p-4 space-y-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="cambioDeClave"
                  checked={formData.cambioDeClave}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  CAMBIO DE CLAVE
                </span>
              </label>
            </div>
          </div>

          {/* ALTA EN / BAJA EN - Adjusted for better mobile display */}
          <div className="flex flex-col space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-gray-700 mb-2 sm:mb-0 sm:mr-4 whitespace-nowrap">
                ALTA EN
              </span>
              <div className="flex border border-gray-400 w-full overflow-x-auto">
                {Array.from({ length: 11 }).map((_, index) => (
                  <input
                    key={`altaEn-${index}`}
                    type="text"
                    name={`altaEn${index}`}
                    value={formData[`altaEn${index}`] ?? ""}
                    onChange={handleChange}
                    className="w-1/11 min-w-[30px] p-2 border-r border-gray-400 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={{ flexShrink: 0 }} // Prevent shrinking on small screens
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-gray-700 mb-2 sm:mb-0 sm:mr-4 whitespace-nowrap">
                BAJA EN
              </span>
              <div className="flex border border-gray-400 w-full overflow-x-auto">
                {Array.from({ length: 11 }).map((_, index) => (
                  <input
                    key={`bajaEn-${index}`}
                    type="text"
                    name={`bajaEn${index}`}
                    value={formData[`bajaEn${index}`] ?? ""}
                    onChange={handleChange}
                    className="w-1/11 min-w-[30px] p-2 border-r border-gray-400 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={{ flexShrink: 0 }} // Prevent shrinking on small screens
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección REEMBOLSO POR DESCUENTO - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          REEMBOLSO POR DESCUENTO
        </div>
        <div
          className="p-4 space-y-4"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-4">
            <div className="col-span-full md:col-span-3 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="reembolsoPorDescuento"
                  checked={formData.reembolsoPorDescuento}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold whitespace-nowrap">
                  REEMBOLSO POR DESCTO.
                </span>
              </label>
            </div>
            <div className="col-span-full md:col-span-3">
              <label htmlFor="reembolsoTotal" className={labelClass}>
                TOTAL:
              </label>
              <input
                type="text"
                id="reembolsoTotal"
                name="reembolsoTotal"
                value={formData.reembolsoTotal}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="col-span-full md:col-span-6">
              <label htmlFor="reembolsoMotivo" className={labelClass}>
                MOTIVO:
              </label>
              <input
                type="text"
                id="reembolsoMotivo"
                name="reembolsoMotivo"
                value={formData.reembolsoMotivo}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-4 mt-4">
            <div className="col-span-full md:col-span-3 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="pagoPorUnicaVez"
                  checked={formData.pagoPorUnicaVez}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold whitespace-nowrap">
                  PAGO POR ÚNICA VEZ
                </span>
              </label>
            </div>
            <div className="col-span-full md:col-span-3">
              <label htmlFor="pagoUnicaVezTotal" className={labelClass}>
                TOTAL:
              </label>
              <input
                type="text"
                id="pagoUnicaVezTotal"
                name="pagoUnicaVezTotal"
                value={formData.pagoUnicaVezTotal}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="col-span-full md:col-span-6">
              <label htmlFor="pagoUnicaVezMotivo" className={labelClass}>
                MOTIVO:
              </label>
              <input
                type="text"
                id="pagoUnicaVezMotivo"
                name="pagoUnicaVezMotivo"
                value={formData.pagoUnicaVezMotivo}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección FALTAS Y RETARDOS & CAMBIO DE HORARIO & VACACIONES - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          FALTAS Y RETARDOS
        </div>
        <div
          className="p-4 space-y-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className={subSectionTitleClass}>FALTAS</h3>

              {/* Faltas */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    FALTAS
                  </span>
                  <input
                    type="checkbox"
                    name="faltasCheckbox"
                    checked={formData.faltasCheckbox}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                <div className="flex-1">
                  <label htmlFor="faltasDiasInicio" className={labelClass}>
                    DÍAS:
                  </label>
                  <input
                    type="text"
                    id="faltasDiasInicio"
                    name="faltasDiasInicio"
                    value={formData.faltasDiasInicio}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 space-y-6">
              <h3 className={subSectionTitleClass}>CAMBIO DE HORARIO</h3>
              {/* Cambio de horario */}
              <div className="space-y-4">
                <label className="inline-flex items-center cursor-pointer">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    CAMBIO DE HORARIO
                  </span>
                  <input
                    type="checkbox"
                    name="cambioDeHorario"
                    checked={formData.cambioDeHorario}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                <div>
                  <label htmlFor="horarioAnterior" className={labelClass}>
                    HORARIO ANTERIOR:
                  </label>
                  <input
                    type="text"
                    id="horarioAnterior"
                    name="horarioAnterior"
                    value={formData.horarioAnterior}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="horarioNuevo" className={labelClass}>
                    HORARIO NUEVO:
                  </label>
                  <input
                    type="text"
                    id="horarioNuevo"
                    name="horarioNuevo"
                    value={formData.horarioNuevo}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className={subSectionTitleClass}>RETARDOS</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="inline-flex items-center cursor-pointer mb-2 sm:mb-0">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    RETARDOS
                  </span>
                  <input
                    type="checkbox"
                    name="retardosCheckbox"
                    checked={formData.retardosCheckbox}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <div className="flex-grow">
                  <label
                    htmlFor="retardosCantidadInicio"
                    className={labelClass}
                  >
                    CANT. INICIO:
                  </label>
                  <input
                    type="text"
                    id="retardosCantidadInicio"
                    name="retardosCantidadInicio"
                    value={formData.retardosCantidadInicio}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor="retardosCantidadFin" className={labelClass}>
                    CANT. FIN:
                  </label>
                  <input
                    type="text"
                    id="retardosCantidadFin"
                    name="retardosCantidadFin"
                    value={formData.retardosCantidadFin}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className={subSectionTitleClass}>VACACIONES</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="inline-flex items-center cursor-pointer mb-2 sm:mb-0">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    VACACIONES
                  </span>
                  <input
                    type="checkbox"
                    name="vacacionesCheckbox"
                    checked={formData.vacacionesCheckbox}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
                <div className="flex-grow">
                  <label htmlFor="vacacionesDiasInicio" className={labelClass}>
                    DÍAS :
                  </label>
                  <input
                    type="text"
                    id="vacacionesDiasInicio"
                    name="vacacionesDiasInicio"
                    value={formData.vacacionesDiasInicio}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor="vacacionesDiasFin" className={labelClass}>
                    PERIODO:
                  </label>
                  <input
                    type="text"
                    id="vacacionesDiasFin"
                    name="vacacionesDiasFin"
                    value={formData.vacacionesDiasFin}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                <div className="flex-grow">
                  <label htmlFor="vacacionesPeriodoDe" className={labelClass}>
                    DE:
                  </label>
                  <input
                    type="text"
                    id="vacacionesPeriodoDe"
                    name="vacacionesPeriodoDe"
                    value={formData.vacacionesPeriodoDe}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor="vacacionesPeriodoAl" className={labelClass}>
                    AL:
                  </label>
                  <input
                    type="text"
                    id="vacacionesPeriodoAl"
                    name="vacacionesPeriodoAl"
                    value={formData.vacacionesPeriodoAl}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección INCIDENCIAS (Permiso, Justificar, Incapacidad, Permiso Lactancia, Suspension, Reanudacion, Quinquenios, Observaciones) - All grouped under one title */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          INCIDENCIAS
        </div>
        <div
          className="p-4 space-y-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>Permiso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    PERMISO
                  </span>
                  <input
                    type="checkbox"
                    name="permisoCheckbox"
                    checked={formData.permisoCheckbox}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="conGoceDeSueldo"
                    checked={formData.conGoceDeSueldo}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-semibold whitespace-nowrap">
                    CON GOCE DE SUELDO
                  </span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="sinGoceDeSueldo"
                    checked={formData.sinGoceDeSueldo}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-semibold whitespace-nowrap">
                    SIN GOCE DE SUELDO
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <label htmlFor="permisoDiasInicio" className={labelClass}>
                    DÍAS :
                  </label>
                  <input
                    type="text"
                    id="permisoDiasInicio"
                    name="permisoDiasInicio"
                    value={formData.permisoDiasInicio}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div className="flex-grow w-full">
                  <label htmlFor="permisoMotivo" className={labelClass}>
                    MOTIVO:
                  </label>
                  <input
                    type="text"
                    id="permisoMotivo"
                    name="permisoMotivo"
                    value={formData.permisoMotivo}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>JUSTIFICAR</h3>
            <div className="p-0 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="inline-flex items-center cursor-pointer mb-2 sm:mb-0">
                  <span className="text-sm text-gray-700 font-semibold mr-2 whitespace-nowrap">
                    JUSTIFICAR
                  </span>
                  <input
                    type="checkbox"
                    name="justificar"
                    checked={formData.justificar}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>

                <div className="flex-grow">
                  <label htmlFor="movimientoCheckbox" className={labelClass}>
                    MOVIMIENTO:
                  </label>
                  <input
                    type="text"
                    id="movimientoCheckbox"
                    name="movimientoCheckbox" // Assuming this was the field name for movement
                    value={formData.movimientoCheckbox ? "Si" : "No"} // Example handling for checkbox as text
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor="fechaJustificar" className={labelClass}>
                    FECHA:
                  </label>
                  <input
                    type="date"
                    id="fechaJustificar"
                    name="fechaJustificar"
                    value={formData.fechaJustificar}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="flex-grow">
                  <label htmlFor="motivoJustificar" className={labelClass}>
                    MOTIVO:
                  </label>
                  <input
                    type="text"
                    id="motivoJustificar"
                    name="motivoJustificar"
                    value={formData.motivoJustificar}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>INCAPACIDAD</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="incapacidadEnfermedad"
                  checked={formData.incapacidadEnfermedad}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  ENFERMEDAD
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="incapacidadMaternidad"
                  checked={formData.incapacidadMaternidad}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  MATERNIDAD
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="incapacidadRiesgoTrabajo"
                  checked={formData.incapacidadRiesgoTrabajo}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-semibold">
                  RIESGO DE TRABAJO
                </span>
              </label>
              <div>
                <label htmlFor="incapacidadDias" className={labelClass}>
                  DÍAS:
                </label>
                <input
                  type="text"
                  id="incapacidadDias"
                  name="incapacidadDias"
                  value={formData.incapacidadDias}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="incapacidadPeriodo" className={labelClass}>
                  PERIODO:
                </label>
                <input
                  type="text"
                  id="incapacidadPeriodo"
                  name="incapacidadPeriodo"
                  value={formData.incapacidadPeriodo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Ej. 01/ENE/2024 al 15/ENE/2024"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>PERMISO POR LACTANCIA</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label htmlFor="permisoLactanciaDias" className={labelClass}>
                  DÍAS:
                </label>
                <input
                  type="text"
                  id="permisoLactanciaDias"
                  name="permisoLactanciaDias"
                  value={formData.permisoLactanciaDias}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="permisoLactanciaPeriodo" className={labelClass}>
                  PERIODO:
                </label>
                <input
                  type="text"
                  id="permisoLactanciaPeriodo"
                  name="permisoLactanciaPeriodo"
                  value={formData.permisoLactanciaPeriodo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="permisoLactanciaHorario" className={labelClass}>
                  HORARIO:
                </label>
                <input
                  type="text"
                  id="permisoLactanciaHorario"
                  name="permisoLactanciaHorario"
                  value={formData.permisoLactanciaHorario}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>SUSPENSIÓN</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label htmlFor="suspensionDias" className={labelClass}>
                  DÍAS:
                </label>
                <input
                  type="text"
                  id="suspensionDias"
                  name="suspensionDias"
                  value={formData.suspensionDias}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="suspensionPeriodo" className={labelClass}>
                  PERIODO:
                </label>
                <input
                  type="text"
                  id="suspensionPeriodo"
                  name="suspensionPeriodo"
                  value={formData.suspensionPeriodo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="suspensionMotivo" className={labelClass}>
                  MOTIVO:
                </label>
                <input
                  type="text"
                  id="suspensionMotivo"
                  name="suspensionMotivo"
                  value={formData.suspensionMotivo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>REANUDACIÓN DE LABORES</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
              <div>
                <label htmlFor="reanudacionDia" className={labelClass}>
                  DÍA:
                </label>
                <input
                  type="text"
                  id="reanudacionDia"
                  name="reanudacionDia"
                  value={formData.reanudacionDia}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="reanudacionMes" className={labelClass}>
                  MES:
                </label>
                <input
                  type="text"
                  id="reanudacionMes"
                  name="reanudacionMes"
                  value={formData.reanudacionMes}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="reanudacionAnio" className={labelClass}>
                  AÑO:
                </label>
                <input
                  type="text"
                  id="reanudacionAnio"
                  name="reanudacionAnio"
                  value={formData.reanudacionAnio}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="reanudacionMotivo" className={labelClass}>
                  MOTIVO:
                </label>
                <input
                  type="text"
                  id="reanudacionMotivo"
                  name="reanudacionMotivo"
                  value={formData.reanudacionMotivo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>QUINQUENIOS</h3>
            <div>
              <label htmlFor="quinqueniosNumero" className={labelClass}>
                NÚMERO:
              </label>
              <input
                type="text"
                id="quinqueniosNumero"
                name="quinqueniosNumero"
                value={formData.quinqueniosNumero}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className={subSectionTitleClass}>OBSERVACIONES</h3>
            <div>
              <label htmlFor="observaciones" className={labelClass}>
                OBSERVACIONES:
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="block border border-gray-300 rounded-md px-2 py-1 mt-1 w-full h-24 text-gray-800 text-sm focus:outline-none focus:border-blue-500 transition-all resize-y"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Sección FIRMAS - Applied new wrapper */}
      <div
        className="rounded-lg overflow-hidden my-4" // Added margin for spacing
        style={{
          border: "1px solid rgb(209, 213, 219)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="bg-blue-900 text-white font-bold uppercase px-4 py-2 w-full rounded-md font-sans text-center text-sm sm:text-base">
          FIRMAS
        </div>
        <div
          className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
          <div className="flex flex-col items-center border border-gray-300 p-4 rounded-md h-full">
            <p className="font-bold text-sm uppercase text-gray-700 mb-4">
              SOLICITA
            </p>
            <div className="w-full flex flex-col flex-grow space-y-4">
              <div>
                <label htmlFor="solicitaNombre" className={labelClass}>
                  NOMBRE Y FIRMA:
                </label>
                <input
                  type="text"
                  id="solicitaNombre"
                  name="solicitaNombre"
                  value={formData.solicitaNombre}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="solicitaCargo" className={labelClass}>
                  CARGO:
                </label>
                <input
                  type="text"
                  id="solicitaCargo"
                  name="solicitaCargo"
                  value={formData.solicitaCargo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="solicitaFecha" className={labelClass}>
                  FECHA:
                </label>
                <input
                  type="date"
                  id="solicitaFecha"
                  name="solicitaFecha"
                  value={formData.solicitaFecha}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="h-24 border border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-xs mt-auto">
                ESPACIO PARA FIRMA
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border border-gray-300 p-4 rounded-md h-full">
            <p className="font-bold text-sm uppercase text-gray-700 mb-4">
              AUTORIZA
            </p>
            <p className="text-sm font-semibold text-center text-blue-900 mb-4">
              DIR. GRAL. DE CAPITAL HUMANO Y ORGANIZACIÓN DE LA SECRETARÍA DE
              ADMINISTRACIÓN
            </p>
            <div className="w-full flex flex-col flex-grow space-y-4">
              <div>
                <label htmlFor="autorizaNombre" className={labelClass}>
                  NOMBRE Y FIRMA:
                </label>
                <input
                  type="text"
                  id="autorizaNombre"
                  name="autorizaNombre"
                  value={formData.autorizaNombre}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="autorizaCargo" className={labelClass}>
                  CARGO:
                </label>
                <input
                  type="text"
                  id="autorizaCargo"
                  name="autorizaCargo"
                  value={formData.autorizaCargo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="autorizaFecha" className={labelClass}>
                  FECHA:
                </label>
                <input
                  type="date"
                  id="autorizaFecha"
                  name="autorizaFecha"
                  value={formData.autorizaFecha}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="h-24 border border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-xs mt-auto">
                ESPACIO PARA FIRMA
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center border border-gray-300 p-4 rounded-md h-full">
            <p className="font-bold text-sm uppercase text-gray-700 mb-4">
              VISTO BUENO
            </p>
            <div className="w-full flex flex-col flex-grow space-y-4">
              <div>
                <label htmlFor="voboNombre" className={labelClass}>
                  NOMBRE Y FIRMA:
                </label>
                <input
                  type="text"
                  id="voboNombre"
                  name="voboNombre"
                  value={formData.voboNombre}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="voboCargo" className={labelClass}>
                  CARGO:
                </label>
                <input
                  type="text"
                  id="voboCargo"
                  name="voboCargo"
                  value={formData.voboCargo}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="voboFecha" className={labelClass}>
                  FECHA:
                </label>
                <input
                  type="date"
                  id="voboFecha"
                  name="voboFecha"
                  value={formData.voboFecha}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="h-24 border border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-xs mt-auto">
                ESPACIO PARA FIRMA
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 text-center">
        <button
          onClick={guardar}
          className="px-8 py-3 font-semibold uppercase tracking-wide transition-all duration-300"
          style={{
            backgroundColor: "#1a2b6b",
            color: "#ffffff",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2c3e80")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#1a2b6b")
          }
        >
          Guardar Datos
        </button>
      </div>
      <div className="p-6 text-center">
        <button
          onClick={handleGeneratePDF}
          className="px-8 py-3 font-semibold uppercase tracking-wide transition-all duration-300"
          style={{
            backgroundColor: "#1a2b6b",
            color: "#ffffff",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2c3e80")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#1a2b6b")
          }
        >
          Generar PDF
        </button>
      </div>
    </form>
  );
}
