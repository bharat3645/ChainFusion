// `aos` (v2.3.4) ships no bundled TypeScript types and DefinitelyTyped has no
// `@types/aos` package, so `app/page.tsx`'s `import AOS from "aos"` fails
// type-checking without a hand-written declaration. Kept intentionally
// narrow to just the API this repo actually calls (`AOS.init`); extend as
// more of the library's surface gets used.
declare module "aos" {
  interface AosOptions {
    /** Global settings: */
    disable?: boolean | "phone" | "tablet" | "mobile" | (() => boolean);
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;

    /** Settings that can be overridden on per-element basis, by `data-aos-*` attributes: */
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  interface Aos {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
  }

  const aos: Aos;
  export default aos;
}

declare module "aos/dist/aos.css";
