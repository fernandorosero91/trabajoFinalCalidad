import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCube, FaColumns, FaMicrophone, FaShapes, FaCalculator, FaRuler, FaKey, FaMouse, FaList, FaCubes } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const matematicasItems: SidebarItem[] = [
  
   { label: "Explorador 3D", route: "/geometria-3d", icon: <FaCubes /> },
   
];

const socialesItems: SidebarItem[] = [
  { label: "Ciencias Sociales", route: "/layouts", icon: <FaColumns /> },
];

const naturalesItems: SidebarItem[] = [
  { label: "Ciencias Naturales", route: "/tts", icon: <FaMicrophone /> },

];

export default function Sidebar() {
  const [openMatematicas, setOpenMatematicas] = useState(false);
  const [openSociales, setOpenSociales] = useState(false);
  const [openNaturales, setOpenNaturales] = useState(false);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `w-full text-left flex items-center gap-2 justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
         hover:bg-slate-50 dark:hover:bg-slate-800 
         ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}`
      }
    >
      <div className="flex items-center gap-2">{icon} {label}</div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-3 space-y-1">

        {/* Acordeón Matemáticas */}
        <button
          onClick={() => setOpenMatematicas(!openMatematicas)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Matemáticas
          <span>{openMatematicas ? "▲" : "▼"}</span>
        </button>
        {openMatematicas && <div className="pl-4 space-y-1">{matematicasItems.map(renderNavItem)}</div>}

        {/* Acordeón Ciencias Sociales */}
        <button
          onClick={() => setOpenSociales(!openSociales)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Ciencias Sociales
          <span>{openSociales ? "▲" : "▼"}</span>
        </button>
        {openSociales && <div className="pl-4 space-y-1">{socialesItems.map(renderNavItem)}</div>}

        {/* Acordeón Ciencias Naturales */}
        <button
          onClick={() => setOpenNaturales(!openNaturales)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Ciencias Naturales
          <span>{openNaturales ? "▲" : "▼"}</span>
        </button>
        {openNaturales && <div className="pl-4 space-y-1">{naturalesItems.map(renderNavItem)}</div>}

      </div>
    </aside>
  );
}
