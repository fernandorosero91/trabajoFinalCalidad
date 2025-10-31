import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock Three.js para evitar problemas con imports ES6
jest.mock('three', () => ({
  Scene: jest.fn(() => ({})),
  PerspectiveCamera: jest.fn(() => ({})),
  WebGLRenderer: jest.fn(() => ({ domElement: document.createElement('canvas') })),
  BoxGeometry: jest.fn(() => ({})),
  SphereGeometry: jest.fn(() => ({})),
  CylinderGeometry: jest.fn(() => ({})),
  MeshStandardMaterial: jest.fn(() => ({})),
  Mesh: jest.fn(() => ({})),
  AmbientLight: jest.fn(() => ({})),
  DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() } })),
  PlaneGeometry: jest.fn(() => ({})),
  Color: jest.fn(() => ({ r: 0, g: 0, b: 0 })),
}));

jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => ({
    enableDamping: false,
    dampingFactor: 0,
    update: jest.fn(),
    dispose: jest.fn(),
  })),
}));

test("renderiza el título principal", () => {
  render(<App />);
  expect(screen.getByText(/Bienvenido a React/i)).toBeInTheDocument();
});