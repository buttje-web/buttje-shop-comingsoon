// Preisdarstellung mit dezentem "zzgl. USt"-Zusatz (reiner B2B-Nettopreis).

function format(amount: string, currency: string) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export default function PriceTag({
  amount,
  currency,
  className = "",
}: {
  amount: string;
  currency: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {format(amount, currency)}{" "}
      <span className="text-muted text-[0.72em] font-normal normal-case tracking-normal">
        zzgl. USt
      </span>
    </span>
  );
}
