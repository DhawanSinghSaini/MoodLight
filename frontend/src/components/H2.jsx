import '../styles/text.css';

export default function H2({ children, className = "" }) {
  return <h2 className={`heading-2 ${className}`}>{children}</h2>;
}
