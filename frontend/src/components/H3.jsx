import '../styles/text.css';

export default function H3({ children, className = "" }) {
  return <h3 className={`heading-3 ${className}`}>{children}</h3>;
}
