import { bodyMapColors } from '../core/colors';
import { hitMap, pairedSegments, segments, type Segment } from './segments';

export class BodyMap {
	root: SVGSVGElement;
	active: Record<Segment, boolean>;

	constructor(svg: SVGSVGElement) {
		this.root = svg;
		this.active = {} as Record<Segment, boolean>;

		// Ensure every visible shape doesn't capture pointer events,
		// and every hit shape does. This forces clicks to go to hit areas.
		this.root.querySelectorAll<SVGElement>('[id]').forEach((el) => {
			const id = el.id || '';

			if (id.endsWith('_Hit')) {
				el.style.pointerEvents = 'auto';
				el.style.cursor = 'pointer';
				el.style.fill = 'transparent'; // keep invisible by default
			} else {
				el.style.pointerEvents = 'none';
			}
		});

		// Initialize active states and add hover/click listeners to hit elements
		segments.forEach((segment) => {
			this.active[segment] = false;

			const hitId = hitMap[segment];
			const hit = this.root.querySelector<SVGElement>(`#${hitId}`);
			const shape = this.root.querySelector<SVGElement>(`#${segment}`);

			if (!shape || !hit) {
				// optionally warn in dev
				// console.warn(`Missing shape or hit for segment: ${segment}`, { shape, hit });
				return;
			}

			// smooth transition on the visible shape
			shape.style.transition = 'fill 0.18s ease';

			// Hover on hit only -> color the visible shape
			hit.addEventListener('pointerenter', () => {
				if (!this.active[segment]) shape.style.fill = bodyMapColors.hover;
			});

			hit.addEventListener('pointerleave', () => {
				if (!this.active[segment]) shape.style.fill = bodyMapColors.default;
			});

			// Click handled centrally in onPointerDown (below) — we still keep a handler for direct toggles if desired
			// But we won't attach per-hit click toggles to avoid duplicate toggling with the global listener.
		});

		// Use central pointerdown listener on root for delegation (reliable and fast)
		// Note: we set passive:false by default not necessary here, but pointerdown triggers earlier than click
		this.root.addEventListener('pointerdown', (ev) => {
			const t = ev.target as HTMLElement;
			const resolved = this._resolveSegmentFromElement(t);
			if (!resolved) return;

			// Use default symmetrical behaviour
			this._handleSelection(resolved, true);
		});
	}

	private _resolveSegmentFromElement(el: HTMLElement | null): Segment | null {
		if (!el) return null;

		if (el.id && el.id.endsWith('_Hit')) {
			const base = el.id.replace(/_Hit$/, '') as Segment;
			if (segments.includes(base)) return base;
		}
		if (el.id && segments.includes(el.id as Segment)) {
			return el.id as Segment;
		}

		let parent: HTMLElement | null = el.parentElement;
		while (parent && parent !== this.root) {
			if (parent.id && parent.id.endsWith('_Hit')) {
				const base = parent.id.replace(/_Hit$/, '') as Segment;
				if (segments.includes(base)) return base;
			}
			if (parent.id && segments.includes(parent.id as Segment)) {
				return parent.id as Segment;
			}
			parent = parent.parentElement;
		}

		return null;
	}

	/** internal selection handler with optional symmetry */
	private _handleSelection(segment: Segment, symmetrical = true) {
		if (!segments.includes(segment)) return;

		if (symmetrical) {
			const pair = Object.values(pairedSegments).find((group) =>
				group.includes(segment),
			);
			if (pair) {
				pair.forEach((seg) => this.toggleOne(seg));
				return;
			}
		}
		this.toggleOne(segment);
	}

	set(id: Segment, value: boolean) {
		this.active[id] = value;
		const shape = this.root.querySelector<SVGElement>(`#${id}`);
		if (!shape) return;
		shape.style.fill = value ? bodyMapColors.active : bodyMapColors.default;
	}

	// ----------------------
	//  Toggle just one side
	// ----------------------
	toggleOne(id: Segment) {
		this.set(id, !this.active[id]);
	}

	// ----------------------
	//  Toggle a bilateral pair
	// ----------------------
	toggleBilateral(id: Segment) {
		const pair = Object.values(pairedSegments).find((group) =>
			group.includes(id),
		);

		// No pair → just toggle single
		if (!pair) {
			this.toggleOne(id);
			return;
		}

		// Toggle both sides together
		pair.forEach((seg) => this.toggleOne(seg));
	}

	// ----------------------
	//  External click handler
	// ----------------------
	onClick(callback: (segment: Segment) => void, bilateral = true) {
		this.root.addEventListener('click', (ev) => {
			const t = ev.target as HTMLElement;

			// Important: now clicks work ONLY on hitMap
			const hitEntry = Object.entries(hitMap).find(
				([segment, hitId]) => hitId === t.id,
			);

			if (!hitEntry) return;

			const [segment] = hitEntry; // real name: "RightBicep", "Chest", etc.

			// Bilateral mode logic
			if (bilateral) {
				this.toggleBilateral(segment as Segment);

				const pair = Object.values(pairedSegments).find((g) =>
					g.includes(segment as Segment),
				);

				(pair ?? [segment]).forEach((seg) => callback(seg as Segment));
				return;
			}

			// Single-side toggle only
			this.toggleOne(segment as Segment);
			callback(segment as Segment);
		});
	}
}
