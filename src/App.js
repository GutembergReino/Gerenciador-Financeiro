import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary"; 

import Home from "./components/pages/Home";
import Projects from "./components/pages/Projects";
import Sign from "./components/pages/Sign";
import NewProject from "./components/pages/NewProject";
import Project from "./components/pages/Project";
import Alertas from "./components/pages/Alertas";

import Container from "./components/layout/Container";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ErrorBoundary>
          <Container customClass="min_height container_app">
            <Routes>
              <Route path="/" element={<Sign />} />
              <Route path="/home" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/newproject" element={<NewProject />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/alertas" element={<Alertas />} />
            </Routes>
          </Container>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
