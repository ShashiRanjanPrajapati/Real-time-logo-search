export function Toast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  return (
    <div className={`toast ${visible ? "show" : ""}`} role="alert" aria-live="polite">
      ✓ {message}
    </div>
  );
}
