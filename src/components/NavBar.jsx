import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function MyNavbar() {
  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">BodyIQ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate('/macro-menu')}>Macros</Nav.Link>
            <Nav.Link onClick={() => navigate('/weight')}>Weight</Nav.Link>
            <NavDropdown title="Exercise" id="exercise-dropdown">
              <NavDropdown.Item onClick={() => navigate('/exercise')}>Exercise</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate('/exercise-history')}>Exercise History</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
            <Nav.Link onClick={() => navigate('/login')}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
