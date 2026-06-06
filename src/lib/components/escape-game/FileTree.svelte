<script lang="ts">
	import { tick, onMount } from 'svelte';
	import type { FileNode } from '$lib/utils/terminal-filesystem';

	interface TreeRow {
		name: string;
		type: 'file' | 'directory';
		depth: number;
		pathKey: string;
	}

	// Arborescence du système de fichiers et chemin courant du joueur
	export let filesystem: Record<string, FileNode>;
	export let currentPath: string[] = [];

	// Aplatit récursivement l'arborescence en une liste de lignes affichables
	function flatten(
		nodes: Record<string, FileNode>,
		depth: number,
		parentPath: string[]
	): TreeRow[] {
		let rows: TreeRow[] = [];
		// Dossiers d'abord, puis fichiers — pour une lecture plus claire
		const entries = Object.entries(nodes).sort(([, a], [, b]) => {
			if (a.type === b.type) return 0;
			return a.type === 'directory' ? -1 : 1;
		});

		for (const [name, node] of entries) {
			const path = [...parentPath, name];
			rows.push({ name, type: node.type, depth, pathKey: path.join('/') });
			if (node.type === 'directory' && node.children) {
				rows = rows.concat(flatten(node.children, depth + 1, path));
			}
		}
		return rows;
	}

	$: rows = [
		{ name: '/', type: 'directory', depth: 0, pathKey: '' } as TreeRow,
		...flatten(filesystem, 1, [])
	];

	// Clé du dossier courant (chaîne vide = racine)
	$: currentKey = currentPath.join('/');

	// Références DOM des ancres de chaque ligne, pour positionner le point
	let rowEls: Record<string, HTMLElement> = {};
	let dotTop = 0;
	let dotLeft = 0;
	let dotVisible = false;

	async function updateDot() {
		await tick();
		const el = rowEls[currentKey];
		if (el) {
			dotTop = el.offsetTop + el.offsetHeight / 2;
			dotLeft = el.offsetLeft + el.offsetWidth / 2;
			dotVisible = true;
		}
	}

	// Repositionne le point à chaque changement de dossier
	$: currentKey, rows, updateDot();

	onMount(updateDot);
</script>

<aside class="file-tree" aria-label="Arborescence des fichiers">
	<div class="tree-header">
		<span class="tree-dot-static"></span>
		<span class="tree-title">SYSTÈME DE FICHIERS</span>
	</div>

	<div class="tree-body">
		<!-- Point clignotant qui se déplace vers le dossier courant -->
		<span
			class="locator"
			class:visible={dotVisible}
			style="top: {dotTop}px; left: {dotLeft}px;"
		>
			<span class="locator-core"></span>
			<span class="locator-ring"></span>
		</span>

		{#each rows as row (row.pathKey)}
			<div
				class="tree-row"
				class:current={row.pathKey === currentKey}
				class:dir={row.type === 'directory'}
				style="padding-left: {row.depth * 16}px;"
			>
				<span class="row-anchor" bind:this={rowEls[row.pathKey]}></span>
				<span class="row-icon">
					{#if row.type === 'directory'}
						{row.depth === 0 ? '/' : '📁'}
					{:else}
						📄
					{/if}
				</span>
				<span class="row-name">{row.depth === 0 ? 'root' : row.name}</span>
			</div>
		{/each}
	</div>
</aside>

<style>
	.file-tree {
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 10000;
		width: 260px;
		max-height: calc(100vh - 32px);
		display: flex;
		flex-direction: column;
		background: rgba(2, 6, 23, 0.92);
		border: 1px solid var(--border-color, #1e293b);
		border-radius: var(--radius, 8px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(6px);
		font-family: var(--font-mono, monospace);
		overflow: hidden;
		user-select: none;
	}

	.tree-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--border-color, #1e293b);
		background: rgba(0, 229, 255, 0.05);
	}

	.tree-dot-static {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-cyan, #00e5ff);
		box-shadow: 0 0 8px var(--accent-cyan, #00e5ff);
		flex-shrink: 0;
	}

	.tree-title {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--text-secondary, #94a3b8);
	}

	.tree-body {
		position: relative;
		padding: 10px 14px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-cyan, #00e5ff) transparent;
	}

	.tree-body::-webkit-scrollbar {
		width: 6px;
	}

	.tree-body::-webkit-scrollbar-thumb {
		background: var(--accent-cyan, #00e5ff);
		border-radius: 3px;
	}

	.tree-row {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		line-height: 1.9;
		color: var(--text-secondary, #94a3b8);
		transition: color 0.3s ease;
		position: relative;
	}

	.tree-row.dir {
		color: var(--text-primary, #e2e8f0);
	}

	.tree-row.current .row-name {
		color: var(--accent-green, #00ffa3);
		font-weight: 600;
		text-shadow: 0 0 8px rgba(0, 255, 163, 0.4);
	}

	/* Ancre invisible utilisée pour mesurer la position du point */
	.row-anchor {
		position: absolute;
		left: -8px;
		top: 0;
		bottom: 0;
		width: 1px;
		pointer-events: none;
	}

	.row-icon {
		flex-shrink: 0;
		width: 16px;
		text-align: center;
		font-size: 12px;
	}

	.row-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Point localisateur qui se déplace avec animation */
	.locator {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
		transform: translate(-50%, -50%);
		transition:
			top 0.55s cubic-bezier(0.22, 1, 0.36, 1),
			left 0.55s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.3s ease;
		pointer-events: none;
	}

	.locator.visible {
		opacity: 1;
	}

	.locator-core {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-green, #00ffa3);
		box-shadow: 0 0 10px var(--accent-green, #00ffa3);
		transform: translate(-50%, -50%);
		animation: locator-blink 1.1s ease-in-out infinite;
	}

	.locator-ring {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid var(--accent-green, #00ffa3);
		transform: translate(-50%, -50%);
		animation: locator-pulse 1.6s ease-out infinite;
	}

	@keyframes locator-blink {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}

	@keyframes locator-pulse {
		0% {
			width: 8px;
			height: 8px;
			opacity: 0.7;
		}
		100% {
			width: 26px;
			height: 26px;
			opacity: 0;
		}
	}

	/* Responsive : version compacte sur petits écrans */
	@media (max-width: 768px) {
		.file-tree {
			width: 190px;
			top: 8px;
			right: 8px;
		}

		.tree-row {
			font-size: 11px;
			line-height: 1.7;
		}

		.tree-title {
			font-size: 9px;
		}
	}

	@media (max-width: 480px) {
		.file-tree {
			display: none;
		}
	}
</style>
