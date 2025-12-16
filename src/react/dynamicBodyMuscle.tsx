import { useEffect, useRef } from 'react';
import { BodyMap } from '../core';
import { type Segment } from '../core/segments';

interface Props {
	svg: string;
	active?: Segment[];
	onSelect?: (s: Segment) => void;
	style?: React.CSSProperties;
	className?: string;
	bilateral?: boolean;
}

export function HumanBodyMap({
	svg,
	active = [],
	onSelect,
	style,
	className,
	bilateral,
}: Props) {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!container.current) return;

		const svgEl = container.current.querySelector('svg') as SVGSVGElement;
		if (!svgEl) return;

		const controller = new BodyMap(svgEl);

		// Set initial active segments
		active.forEach((s) => controller.set(s, true));

		// Bind click behavior
		controller.onClick((id) => {
			onSelect?.(id);
		}, bilateral);
	}, [svg, active, onSelect, bilateral]);

	return (
		<div
			ref={container}
			style={style}
			className={className}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
