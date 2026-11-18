/**
 * reveal.js — drop-in scroll reveal for the CONSULTANT theme.
 *
 * Markup: <section data-reveal="theme" data-reveal-index="0">…</section>
 *   data-reveal        keyframe name, or "theme" to use the theme's --tp-reveal
 *   data-reveal-index  stagger position (index x --tp-stagger)
 *   data-reveal-dur    override --tp-dur-slow
 *
 * Reveals fire once. Nav, tab bars and above-the-fold chrome never carry data-reveal.
 */
export function initReveals(scope: Document | HTMLElement = document): () => void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return () => undefined;
    }

    const root = document.documentElement;
    const groups = new Map<Element | null, HTMLElement[]>();

    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.style.animation = 'none';
        el.style.opacity = '0';
        const scroller = el.closest('[data-reveal-root]');
        if (!groups.has(scroller)) groups.set(scroller, []);
        groups.get(scroller)!.push(el);
    });

    const observers: IntersectionObserver[] = [];

    groups.forEach((els, scroller) => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const el = entry.target as HTMLElement;
                    const styles = getComputedStyle(root);
                    const name =
                        el.dataset.reveal === 'theme'
                            ? styles.getPropertyValue('--tp-reveal').trim() || 'tp-up'
                            : el.dataset.reveal || 'tp-up';
                    const duration =
                        el.dataset.revealDur || styles.getPropertyValue('--tp-dur-slow').trim() || '500ms';
                    const ease = styles.getPropertyValue('--tp-ease').trim() || 'ease';
                    const stagger = parseFloat(styles.getPropertyValue('--tp-stagger')) || 60;
                    const index = Number(el.dataset.revealIndex || 0);

                    el.style.opacity = '';
                    el.style.animation = `${name} ${duration} ${ease} ${Math.round(
                        index * stagger,
                    )}ms both`;
                    observer.unobserve(el);
                });
            },
            { root: scroller as Element | null, threshold: 0.2 },
        );

        els.forEach((el) => observer.observe(el));
        observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
}
