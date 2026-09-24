import "./styles/SectionHeader.css";

export default function SectionHeader({ title, className = "" }) {

  return (
    <div className={`section-header section-header-wrapper ${className}`}>
      <div>
        <h2 className="section-header-title">{title}</h2>
      </div>
    </div>
  );
}
