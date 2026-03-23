import { Button } from "./components/Button";

const variants = ["solid", "outline", "ghost", "link"] as const;
const sizes = ["sm", "md", "lg"] as const;

export function App() {
  return (
    <main className="min-h-screen bg-[--color-background] text-[--color-foreground] p-12 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">espresso-ui — Button demo</h1>
        <button
          className="text-sm underline text-[--color-muted-foreground] hover:text-[--color-foreground]"
          onClick={() => {
            const html = document.documentElement;
            html.setAttribute(
              "data-theme",
              html.getAttribute("data-theme") === "dark" ? "" : "dark",
            );
          }}
        >
          Toggle dark mode
        </button>
      </div>

      {variants.map((variant) => (
        <section key={variant} className="space-y-4">
          <h2 className="text-lg font-semibold capitalize text-[--color-muted-foreground]">
            {variant}
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size} button
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
          </div>
        </section>
      ))}
    </main>
  );
}
