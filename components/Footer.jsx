import "./styles/Footer.css";

export default function Footer() {

  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <p className="footer-copyright">© 2026 Voonna Madhusudhana Rao.</p>
        <div className="footer-links">
          <a href="#home" className="footer-link">Home</a>
          <a href="#projects" className="footer-link">Projects</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}
