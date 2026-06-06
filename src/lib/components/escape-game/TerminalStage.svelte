<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { createFilesystem, parseModulesConfig, stringifyModulesConfig } from '$lib/utils/terminal-filesystem';
	import { executeCommand, autocomplete } from '$lib/utils/terminal-commands';
	import FileTree from './FileTree.svelte';
	
	const dispatch = createEventDispatcher();
	
	export let token;
	
	// État du terminal
	let terminalHistory = [];
	let commandHistory = [];
	let historyIndex = -1;
	let currentInput = '';
	let inputElement;
	let terminalOutputElement;
	
	// État du système
	let currentPath = [];
	let filesystem = createFilesystem();
	let modulesConfig = parseModulesConfig(filesystem.config.children['modules.json'].content);
	let buildSucceeded = false;
	let appStarted = false;
	
	// État d'édition
	let isEditing = false;
	let editingFile = '';
	let editContent = '';
	let editConfig = null;
	let editElement;
	
	// Initialisation
	onMount(() => {
		inputElement?.focus();
		
		// Empêcher le focus de partir de la page
		const handleFocusOut = (e) => {
			// Si le focus quitte la page et qu'on n'est pas en édition
			if (!isEditing && !document.hasFocus()) {
				setTimeout(() => inputElement?.focus(), 0);
			}
		};
		
		const handleClick = (e) => {
			// Si on clique n'importe où dans le terminal et qu'on n'est pas en édition
			if (!isEditing) {
				inputElement?.focus();
			}
		};
		
		document.addEventListener('blur', handleFocusOut, true);
		document.addEventListener('click', handleClick);
		
		// Message de bienvenue
		addToHistory({
			type: 'system',
			content: `╔════════════════════════════════════════════════════════════════╗
║     TERMINAL DE SECOURS - LABORATOIRE VAÏK-17 - v2.4.1        ║
╚════════════════════════════════════════════════════════════════╝

Système de récupération activé.
Tapez 'help' pour afficher les commandes disponibles.
Tapez 'cat LISEZ_MOI.txt' pour lire les instructions.
`
		});
		
		return () => {
			document.removeEventListener('blur', handleFocusOut, true);
			document.removeEventListener('click', handleClick);
		};
	});
	
	function addToHistory(entry) {
		terminalHistory = [...terminalHistory, entry];
		// Auto-scroll vers le bas
		setTimeout(() => {
			if (terminalOutputElement) {
				terminalOutputElement.scrollTop = terminalOutputElement.scrollHeight;
			}
		}, 10);
	}
	
	async function handleCommand(cmd) {
		if (!cmd.trim()) return;
		
		// Afficher la commande
		const promptPath = currentPath.length === 0 ? '/' : '/' + currentPath.join('/');
		addToHistory({
			type: 'command',
			prompt: promptPath,
			content: cmd
		});
		
		// Ajouter à l'historique des commandes
		commandHistory = [...commandHistory, cmd];
		historyIndex = commandHistory.length;
		
		// Gérer la commande 'clear'
		if (cmd.trim().toLowerCase() === 'clear') {
			terminalHistory = [];
			return;
		}
		
		// Exécuter la commande
		const result = executeCommand(cmd, {
			currentPath,
			filesystem,
			modulesConfig,
			buildSucceeded
		});
		
		// Traiter le résultat
		if (result.newPath !== undefined) {
			currentPath = result.newPath;
		}
		
		if (result.updatedConfig) {
			modulesConfig = result.updatedConfig;
			// Mettre à jour le filesystem
			filesystem.config.children['modules.json'].content = stringifyModulesConfig(modulesConfig);
		}
		
		if (result.buildSuccess !== undefined) {
			buildSucceeded = result.buildSuccess;
		}
		
		if (result.startEdit) {
			// Entrer en mode édition
			isEditing = true;
			editingFile = result.startEdit.file;
			editContent = result.startEdit.content;
			editConfig = parseModulesConfig(editContent);
			// Focus sur l'élément éditable
			setTimeout(() => editElement?.focus(), 100);
			return; // Ne pas afficher de output
		}
		
		// Afficher la sortie
		if (result.output) {
			addToHistory({
				type: result.type,
				content: result.output
			});
		}
		
		// Si l'app a démarré avec succès, valider l'étape
		if (cmd.trim() === 'start' && buildSucceeded && result.type === 'success') {
			appStarted = true;
			
			// Appeler l'API pour valider l'étape
			try {
				await fetch('/api/escape-game/validate-trial', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						token,
						trialIndex: 1,
						validated: true
					})
				});
				
				// Délai avant de passer à l'étape suivante
				setTimeout(() => {
					dispatch('complete');
				}, 3000);
			} catch (err) {
				console.error('Error validating trial:', err);
			}
		}
	}
	
	function submitCommand() {
		if (appStarted || !currentInput.trim()) return;
		handleCommand(currentInput);
		currentInput = '';
		inputElement?.focus();
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submitCommand();
		} else if (e.key === 'Tab') {
			e.preventDefault();
			// Auto-complétion
			const completed = autocomplete(currentInput, {
				currentPath,
				filesystem,
				modulesConfig,
				buildSucceeded
			});
			if (completed) {
				currentInput = completed;
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				currentInput = commandHistory[historyIndex] || '';
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentInput = commandHistory[historyIndex] || '';
			} else {
				historyIndex = commandHistory.length;
				currentInput = '';
			}
		}
	}
	
	// Mode édition
	function toggleSynthesisEngine() {
		if (editConfig) {
			editConfig.modules.synthesisEngine = !editConfig.modules.synthesisEngine;
			editConfig = editConfig; // Force reactivity
		}
	}
	
	function saveEdit() {
		if (!editConfig) return;
		
		// Mettre à jour la config
		modulesConfig = editConfig;
		filesystem.config.children['modules.json'].content = stringifyModulesConfig(modulesConfig);
		
		addToHistory({
			type: 'success',
			content: `Fichier config/modules.json sauvegardé avec succès.
Module synthesisEngine : ${modulesConfig.modules.synthesisEngine ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`
		});
		
		isEditing = false;
		editingFile = '';
		editContent = '';
		editConfig = null;
		
		// Re-focus sur l'input
		setTimeout(() => inputElement?.focus(), 100);
	}
	
	function cancelEdit() {
		addToHistory({
			type: 'info',
			content: 'Édition annulée.'
		});
		
		isEditing = false;
		editingFile = '';
		editContent = '';
		editConfig = null;
		
		// Re-focus sur l'input
		setTimeout(() => inputElement?.focus(), 100);
	}
	
	function handleEditKeyDown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			saveEdit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancelEdit();
		} else if (e.key === ' ') {
			e.preventDefault();
			toggleSynthesisEngine();
		}
	}
</script>

<div class="terminal-stage">
	{#if !isEditing}
		<!-- Terminal normal ---->
		<FileTree {filesystem} {currentPath} />
		<div class="terminal-container">
			<div class="terminal-output" bind:this={terminalOutputElement}>
				{#each terminalHistory as entry}
					{#if entry.type === 'system'}
						<div class="terminal-line terminal-system">
							<pre>{entry.content}</pre>
						</div>
					{:else if entry.type === 'command'}
						<div class="terminal-line terminal-command">
							<span class="prompt">{entry.prompt} $</span>
							<span class="command-text">{entry.content}</span>
						</div>
					{:else if entry.type === 'success'}
						<div class="terminal-line terminal-success">
							<pre>{entry.content}</pre>
						</div>
					{:else if entry.type === 'error'}
						<div class="terminal-line terminal-error">
							<pre>{entry.content}</pre>
						</div>
					{:else if entry.type === 'info'}
						<div class="terminal-line terminal-info">
							<pre>{entry.content}</pre>
						</div>
					{/if}
				{/each}
			</div>
			
			<div class="terminal-input-bar">
				<div class="chat-input" class:disabled={appStarted}>
					<span class="chat-prompt">{currentPath.length === 0 ? '/' : '/' + currentPath.join('/')} $</span>
					<input
						bind:this={inputElement}
						bind:value={currentInput}
						on:keydown={handleKeyDown}
						class="terminal-input"
						type="text"
						spellcheck="false"
						autocomplete="off"
						disabled={appStarted}
						placeholder={appStarted ? 'Transfert en cours...' : 'Tapez une commande… (help pour l\'aide)'}
					/>
					<button
						type="button"
						class="send-btn"
						on:click={submitCommand}
						disabled={appStarted || !currentInput.trim()}
						aria-label="Envoyer la commande"
					>
						<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="12" y1="19" x2="12" y2="5" />
							<polyline points="6 11 12 5 18 11" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	{:else}
		<!-- Mode édition ---->
		<div class="edit-container">
			<div class="edit-header">
				<h3 class="edit-title">ÉDITEUR DE CONFIGURATION</h3>
				<p class="edit-file">Fichier : {editingFile}</p>
			</div>
			
			<div class="edit-content">
				<p class="edit-instruction">
					Modifiez le module synthesisEngine ci-dessous :
				</p>
				
				<div class="edit-config">
					<div class="config-line">
						<span class="config-key">"modules":</span>
						<span class="config-bracket">{'{'}</span>
					</div>
					
					<div class="config-line config-editable" tabindex="0" bind:this={editElement} on:keydown={handleEditKeyDown}>
						<span class="config-indent">  </span>
						<span class="config-key">"synthesisEngine":</span>
						<span class="config-value config-value-{editConfig?.modules.synthesisEngine}">
							{editConfig?.modules.synthesisEngine}
						</span>
						<span class="config-cursor">◄</span>
					</div>
					
					<div class="config-line">
						<span class="config-indent">  </span>
						<span class="config-key">"uiRenderer":</span>
						<span class="config-value config-value-true">true</span>
						<span class="config-comma">,</span>
					</div>
					
					<div class="config-line">
						<span class="config-indent">  </span>
						<span class="config-key">"dataRegistry":</span>
						<span class="config-value config-value-true">true</span>
					</div>
					
					<div class="config-line">
						<span class="config-bracket">{'}'}</span>
					</div>
				</div>
				
				<div class="edit-controls">
					<p class="edit-help">
						<kbd>ESPACE</kbd> : Basculer true/false
						<kbd>ENTRÉE</kbd> : Sauvegarder
						<kbd>ÉCHAP</kbd> : Annuler
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.terminal-stage {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		z-index: 9999;
	}
	
	/* Terminal Container */
	.terminal-container {
		width: 100%;
		height: 100%;
		background: #000000;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.terminal-output {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: var(--spacing-lg);
		font-family: var(--font-mono);
		font-size: 14px;
		line-height: 1.6;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-cyan) #000000;
	}
	
	/* Custom scrollbar for webkit browsers */
	.terminal-output::-webkit-scrollbar {
		width: 8px;
	}
	
	.terminal-output::-webkit-scrollbar-track {
		background: #000000;
	}
	
	.terminal-output::-webkit-scrollbar-thumb {
		background: var(--accent-cyan);
		border-radius: 4px;
	}
	
	.terminal-output::-webkit-scrollbar-thumb:hover {
		background: #00ccdd;
	}
	
	.terminal-line {
		margin-bottom: 8px;
	}
	
	.terminal-line pre {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: inherit;
	}
	
	.terminal-system {
		color: var(--accent-cyan);
	}
	
	.terminal-command {
		color: var(--text-primary);
	}
	
	.terminal-command .prompt {
		color: var(--accent-green);
		margin-right: 8px;
	}
	
	.terminal-command .command-text {
		color: var(--text-primary);
	}
	
	.terminal-success {
		color: var(--accent-green);
	}
	
	.terminal-error {
		color: var(--accent-red);
	}
	
	.terminal-info {
		color: var(--text-secondary);
	}
	
	.terminal-input-bar {
		flex-shrink: 0;
		padding: var(--spacing-lg);
		display: flex;
		justify-content: center;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
	}

	.chat-input {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
		max-width: 820px;
		padding: 10px 10px 10px 18px;
		background: var(--bg-panel-light);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.chat-input:focus-within {
		border-color: var(--accent-cyan);
		box-shadow: 0 0 0 3px var(--cyan-soft), 0 8px 28px rgba(0, 0, 0, 0.45);
	}

	.chat-input.disabled {
		opacity: 0.6;
	}

	.chat-prompt {
		color: var(--accent-green);
		font-family: var(--font-mono);
		font-size: 15px;
		font-weight: 600;
		flex-shrink: 0;
	}

	.terminal-input {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 15px;
		padding: 6px 0;
		caret-color: var(--accent-cyan);
	}

	.terminal-input::placeholder {
		color: var(--text-muted);
	}

	.terminal-input:disabled {
		cursor: not-allowed;
	}

	.send-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 12px;
		background: var(--accent-cyan);
		color: #020617;
		cursor: pointer;
		transition: background 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
	}

	.send-btn:hover:not(:disabled) {
		background: #5cefff;
	}

	.send-btn:active:not(:disabled) {
		transform: scale(0.92);
	}

	.send-btn:disabled {
		background: var(--bg-panel);
		color: var(--text-muted);
		cursor: not-allowed;
	}
	
	/* Edit Container */
	.edit-container {
		width: 100%;
		height: 100%;
		background: var(--bg-primary);
		overflow-y: auto;
		padding: var(--spacing-2xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.edit-header {
		margin-bottom: var(--spacing-xl);
		padding-bottom: var(--spacing-lg);
		border-bottom: 1px solid var(--border-color);
		width: 100%;
		max-width: 800px;
	}
	
	.edit-title {
		font-family: var(--font-mono);
		font-size: 18px;
		font-weight: 700;
		color: var(--accent-cyan);
		margin: 0 0 var(--spacing-sm) 0;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.edit-file {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-secondary);
		margin: 0;
	}
	
	.edit-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		width: 100%;
		max-width: 800px;
	}
	
	.edit-instruction {
		font-size: 14px;
		color: var(--text-secondary);
		margin: 0;
	}
	
	.edit-config {
		background: #000000;
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: var(--spacing-lg);
		font-family: var(--font-mono);
		font-size: 14px;
		line-height: 1.8;
	}
	
	.config-line {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.config-editable {
		background: rgba(0, 229, 255, 0.1);
		padding: 4px 8px;
		margin: 0 -8px;
		border-left: 3px solid var(--accent-cyan);
		outline: none;
		cursor: pointer;
	}
	
	.config-editable:focus {
		background: rgba(0, 229, 255, 0.15);
		box-shadow: 0 0 0 3px var(--cyan-soft);
	}
	
	.config-indent {
		color: var(--text-muted);
	}
	
	.config-key {
		color: #79C0FF;
	}
	
	.config-bracket {
		color: var(--text-muted);
	}
	
	.config-value {
		font-weight: 600;
	}
	
	.config-value-true {
		color: var(--accent-green);
	}
	
	.config-value-false {
		color: var(--accent-red);
	}
	
	.config-comma {
		color: var(--text-muted);
	}
	
	.config-cursor {
		color: var(--accent-cyan);
		animation: blink 1s infinite;
		margin-left: 8px;
	}
	
	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}
	
	.edit-controls {
		padding: var(--spacing-lg);
		background: var(--cyan-soft);
		border: 1px solid rgba(0, 229, 255, 0.2);
		border-radius: var(--radius);
	}
	
	.edit-help {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-secondary);
		display: flex;
		gap: var(--spacing-lg);
		flex-wrap: wrap;
		justify-content: center;
	}
	
	.edit-help kbd {
		display: inline-block;
		padding: 4px 8px;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--accent-cyan);
		font-weight: 600;
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.terminal-output {
			padding: var(--spacing-md);
		}

		.terminal-input-bar {
			padding: var(--spacing-md);
		}

		.chat-input {
			padding: 8px 8px 8px 14px;
			border-radius: 14px;
		}

		.terminal-output,
		.terminal-input,
		.chat-prompt,
		.edit-config {
			font-size: 13px;
		}

		.send-btn {
			width: 36px;
			height: 36px;
		}
		
		.edit-container {
			padding: var(--spacing-lg);
		}
		
		.edit-help {
			flex-direction: column;
			gap: var(--spacing-sm);
		}
	}
</style>