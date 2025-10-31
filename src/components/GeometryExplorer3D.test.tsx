import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GeometryExplorer3D from "./GeometryExplorer3D";

// Mock Three.js
jest.mock('three', () => {
  const mockGeometry = {
    dispose: jest.fn(),
  };

  const mockMaterial = {
    dispose: jest.fn(),
    color: { set: jest.fn(), setHex: jest.fn() },
  };

  const mockMesh = {
    geometry: mockGeometry,
    material: mockMaterial,
    position: { set: jest.fn(), y: 0 },
    scale: { setScalar: jest.fn(), multiplyScalar: jest.fn() },
    rotation: { x: 0, y: 0 },
    castShadow: true,
    receiveShadow: true,
    add: jest.fn(),
  };

  const mockScene = {
    add: jest.fn(),
    remove: jest.fn(),
    background: null,
  };

  const mockCamera = {
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  };

  const mockRenderer = {
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    setClearColor: jest.fn(),
    shadowMap: { enabled: false, type: null },
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  };


  return {
    Scene: jest.fn(() => mockScene),
    PerspectiveCamera: jest.fn(() => mockCamera),
    WebGLRenderer: jest.fn(() => mockRenderer),
    BoxGeometry: jest.fn(() => mockGeometry),
    SphereGeometry: jest.fn(() => mockGeometry),
    CylinderGeometry: jest.fn(() => mockGeometry),
    MeshStandardMaterial: jest.fn(() => mockMaterial),
    Mesh: jest.fn(() => mockMesh),
    AmbientLight: jest.fn(() => ({})),
    DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() } })),
    PlaneGeometry: jest.fn(() => mockGeometry),
    Color: jest.fn(() => ({ r: 0, g: 0, b: 0 })),
  };
});

jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => ({
    enableDamping: false,
    dampingFactor: 0,
    update: jest.fn(),
    dispose: jest.fn(),
  })),
}));

describe("GeometryExplorer3D Component", () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente con controles iniciales", () => {
    render(<GeometryExplorer3D />);

    expect(screen.getByText("Forma")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Escala: 1.0")).toBeInTheDocument();
    expect(screen.getByText("Pausar Rotación")).toBeInTheDocument();

    const select = screen.getByRole("combobox", { name: /forma/i });
    expect(select).toHaveValue("cube");

    const colorInput = screen.getByDisplayValue("#22c55e");
    expect(colorInput).toBeInTheDocument();
  });

  test("cambia la forma seleccionada", () => {
    render(<GeometryExplorer3D />);

    const select = screen.getByRole("combobox", { name: /forma/i });
    fireEvent.change(select, { target: { value: "sphere" } });

    expect(select).toHaveValue("sphere");
  });

  test("cambia el color", () => {
    render(<GeometryExplorer3D />);

    const colorInput = screen.getByDisplayValue("#22c55e");
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });

    expect(colorInput).toHaveValue("#ff0000");
  });

  test("cambia la escala", () => {
    render(<GeometryExplorer3D />);

    const rangeInput = screen.getByRole("slider", { name: /escala/i });
    fireEvent.change(rangeInput, { target: { value: "2" } });

    expect(screen.getByText("Escala: 2.0")).toBeInTheDocument();
  });

  test("pausa y reanuda la rotación automática", () => {
    render(<GeometryExplorer3D />);

    const button = screen.getByText("Pausar Rotación");
    fireEvent.click(button);

    expect(screen.getByText("Reanudar Rotación")).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText("Pausar Rotación")).toBeInTheDocument();
  });

  test("tiene atributos de accesibilidad", () => {
    render(<GeometryExplorer3D />);

    const canvas = screen.getByRole("img", {
      name: /visualización 3d de cube con rotación automática/i
    });
    expect(canvas).toBeInTheDocument();
  });

  test("renderiza con clase personalizada", () => {
    const { container } = render(<GeometryExplorer3D className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });
});