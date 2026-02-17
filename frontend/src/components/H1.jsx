import '../styles/text.css';

export default function H1({ children, className = "" }) {
  return <h1 className={`heading-1 ${className}`}>{children}</h1>;
}
