// ─── Datos de la API /api/mes ────────────────────────────────────────────────
const API_BASE = "https://fuerza-g-grupo-1-uy0x.onrender.com";
 

const MESES_FALLBACK = [
  { id: "1",  mes: "Enero" },
  { id: "2",  mes: "Febrero" },
  { id: "3",  mes: "Marzo" },
  { id: "4",  mes: "Abril" },
  { id: "5",  mes: "Mayo" },
  { id: "6",  mes: "Junio" },
  { id: "7",  mes: "Julio" },
  { id: "8",  mes: "Agosto" },
  { id: "9",  mes: "Septiembre" },
  { id: "10", mes: "Octubre" },
  { id: "11", mes: "Noviembre" },
  { id: "12", mes: "Diciembre" },
];
 
async function fetchMeses() {
  try {
    const res = await fetch(`${API_BASE}/api/mes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : MESES_FALLBACK;
  } catch (err) {
    console.warn("API no disponible, usando datos locales:", err.message);
    return MESES_FALLBACK;
  }
}
 
 
function construirTabla(meses) {
  const tbody = document.querySelector("#tabla-meses tbody");
  tbody.innerHTML = "";
 
  if (meses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="tabla-vacia">Sin datos disponibles</td></tr>`;
    return;
  }
 
  meses.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.mes}</td>
      <td>
        <button class="btn-editar"  data-id="${item.id}" data-mes="${item.mes}">✏ Editar</button>
        <button class="btn-eliminar" data-id="${item.id}">✕ Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
 
  tbody.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nuevoNombre = prompt(`Editar mes #${btn.dataset.id}:`, btn.dataset.mes);
      if (nuevoNombre && nuevoNombre.trim()) {
        btn.dataset.mes = nuevoNombre.trim();
        btn.closest("tr").querySelector("td:nth-child(2)").textContent = nuevoNombre.trim();
      }
    });
  });
 
  tbody.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm(`¿Eliminar el mes #${btn.dataset.id}?`)) {
        btn.closest("tr").remove();
      }
    });
  });
}
 
async function mostrarModalMeses() {
  inyectarEstilos();
 
  const existing = document.getElementById("modal-overlay");
  if (existing) existing.remove();
 
  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.innerHTML = `
    <div id="modal-meses">
      <div class="modal-header">
        <span>📋 LISTADO DE MESES</span>
        <button id="btn-cerrar-modal" title="Cerrar">✕</button>
      </div>
      <div class="modal-body">
        <table id="tabla-meses">
          <thead>
            <tr>
              <th>#</th>
              <th>Mes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="3" class="tabla-vacia">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button id="btn-cerrar-footer">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
 
  const cerrar = () => overlay.remove();
  document.getElementById("btn-cerrar-modal").addEventListener("click", cerrar);
  document.getElementById("btn-cerrar-footer").addEventListener("click", cerrar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrar(); });
 
  const meses = await fetchMeses();
  construirTabla(meses);
}
 
document.addEventListener("DOMContentLoaded", () => {
  const btnReportes = document.querySelector(".btn-main:not(.btn-salir)");
  if (btnReportes) {
    btnReportes.addEventListener("click", mostrarModalMeses);
  } else {
    console.warn("No se encontró el botón Reportes.");
  }
});