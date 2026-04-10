/**
 * Logique d'exécution des commandes terminal
 */

import type { FileNode, ModulesConfig } from './terminal-filesystem';
import { parseModulesConfig, stringifyModulesConfig } from './terminal-filesystem';

export interface CommandContext {
	currentPath: string[];
	filesystem: Record<string, FileNode>;
	modulesConfig: ModulesConfig;
	buildSucceeded: boolean;
}

export interface CommandResult {
	output: string;
	type: 'success' | 'error' | 'info';
	newPath?: string[];
	updatedConfig?: ModulesConfig;
	buildSuccess?: boolean;
	startEdit?: { file: string; content: string };
}

export function executeCommand(
	command: string,
	context: CommandContext
): CommandResult {
	const trimmed = command.trim();
	if (!trimmed) {
		return { output: '', type: 'info' };
	}

	const parts = trimmed.split(/\s+/);
	const cmd = parts[0].toLowerCase();
	const args = parts.slice(1);

	switch (cmd) {
		case 'help':
			return commandHelp();
		case 'clear':
			return { output: '', type: 'info' };
		case 'ls':
			return commandLs(args, context);
		case 'pwd':
			return commandPwd(context);
		case 'cd':
			return commandCd(args, context);
		case 'cat':
			return commandCat(args, context);
		case 'edit':
			return commandEdit(args, context);
		case 'npm':
			return commandNpm(args, context);
		default:
			return {
				output: `Commande non reconnue : ${cmd}\nTapez 'help' pour voir les commandes disponibles.`,
				type: 'error'
			};
	}
}

function commandHelp(): CommandResult {
	const help = `
╔════════════════════════════════════════════════════════════════╗
║          TERMINAL DE SECOURS - COMMANDES DISPONIBLES          ║
╚════════════════════════════════════════════════════════════════╝

NAVIGATION
  ls [nom-dossier]
    Affiche le contenu du répertoire courant ou d'un sous-dossier.
    Liste les fichiers et dossiers disponibles.
    Exemples : ls, ls logs, ls config

  pwd
    Affiche le chemin du répertoire courant.
    Permet de savoir où vous vous trouvez dans l'arborescence.

  cd <nom-dossier>
    Entre dans un sous-dossier.
    Exemple : cd config

  cd ..
    Remonte d'un niveau dans l'arborescence.
    Permet de revenir au dossier parent.

CONSULTATION
  cat <nom-fichier>
    Affiche le contenu complet d'un fichier texte.
    Utile pour lire les logs, configurations et code source.
    Exemple : cat README_RECOVERY.txt

MODIFICATION
  edit <chemin-fichier>
    Ouvre un fichier en mode édition si modification autorisée.
    Seuls certains fichiers de configuration peuvent être modifiés.
    Exemple : edit config/modules.json

COMPILATION & EXÉCUTION
  npm run build
    Lance la compilation du système de synthèse.
    Nécessite une configuration valide pour réussir.

  npm run start
    Démarre l'application de synthèse d'antidote.
    Nécessite une compilation réussie au préalable.

UTILITAIRES
  clear
    Efface l'historique du terminal.

  help
    Affiche cette aide.

AUTO-COMPLÉTION
  Utilisez la touche TAB pour compléter automatiquement
  les commandes et noms de fichiers.

CONSEIL
Commencez par lire le fichier README_RECOVERY.txt pour comprendre
la situation, puis explorez les logs pour identifier le problème.
`;
	return { output: help, type: 'info' };
}

function commandLs(args: string[], context: CommandContext): CommandResult {
	// Déterminer le chemin à lister
	let targetPath = context.currentPath;
	
	if (args.length > 0) {
		const target = args[0];
		// Si c'est un chemin relatif, on l'ajoute au chemin courant
		targetPath = [...context.currentPath, target];
	}
	
	const node = getNodeAtPath(targetPath, context.filesystem);
	if (!node) {
		return { output: `Dossier introuvable : ${args[0] || ''}`, type: 'error' };
	}
	
	if (node.type !== 'directory') {
		return { output: `"${args[0]}" n'est pas un dossier`, type: 'error' };
	}

	const children = node.children || {};
	const items: string[] = [];

	for (const [name, child] of Object.entries(children)) {
		const prefix = child.type === 'directory' ? '📁 ' : '📄 ';
		items.push(`${prefix}${name}`);
	}

	if (items.length === 0) {
		return { output: '(répertoire vide)', type: 'info' };
	}

	return { output: items.join('\n'), type: 'success' };
}

function commandPwd(context: CommandContext): CommandResult {
	const path = context.currentPath.length === 0 ? '/' : '/' + context.currentPath.join('/');
	return { output: path, type: 'info' };
}

function commandCd(args: string[], context: CommandContext): CommandResult {
	if (args.length === 0) {
		return { output: 'Usage : cd <nom-dossier> ou cd ..', type: 'error' };
	}

	const target = args[0];

	if (target === '..') {
		if (context.currentPath.length === 0) {
			return { output: 'Déjà à la racine', type: 'error' };
		}
		return {
			output: '',
			type: 'success',
			newPath: context.currentPath.slice(0, -1)
		};
	}

	const node = getNodeAtPath(context.currentPath, context.filesystem);
	if (!node || node.type !== 'directory') {
		return { output: 'Erreur : répertoire courant invalide', type: 'error' };
	}

	const children = node.children || {};
	const child = children[target];

	if (!child) {
		return { output: `Dossier introuvable : ${target}`, type: 'error' };
	}

	if (child.type !== 'directory') {
		return { output: `"${target}" n'est pas un dossier`, type: 'error' };
	}

	return {
		output: '',
		type: 'success',
		newPath: [...context.currentPath, target]
	};
}

function commandCat(args: string[], context: CommandContext): CommandResult {
	if (args.length === 0) {
		return { output: 'Usage : cat <nom-fichier>', type: 'error' };
	}

	const filename = args[0];
	const node = getNodeAtPath(context.currentPath, context.filesystem);

	if (!node || node.type !== 'directory') {
		return { output: 'Erreur : répertoire courant invalide', type: 'error' };
	}

	const children = node.children || {};
	const file = children[filename];

	if (!file) {
		return { output: `Fichier introuvable : ${filename}`, type: 'error' };
	}

	if (file.type !== 'file') {
		return { output: `"${filename}" est un dossier, pas un fichier`, type: 'error' };
	}

	return { output: file.content || '', type: 'info' };
}

function commandEdit(args: string[], context: CommandContext): CommandResult {
	if (args.length === 0) {
		return { output: 'Usage : edit <chemin-fichier>', type: 'error' };
	}

	const filepath = args[0];

	// Seul modules.json est éditable
	if (filepath !== 'config/modules.json' && filepath !== 'modules.json') {
		return {
			output: `Le fichier "${filepath}" n'est pas modifiable.\nSeul config/modules.json peut être édité.`,
			type: 'error'
		};
	}

	// Récupérer le contenu
	const configNode = context.filesystem.config?.children?.['modules.json'];
	if (!configNode || configNode.type !== 'file') {
		return { output: 'Erreur : fichier de configuration introuvable', type: 'error' };
	}

	return {
		output: '',
		type: 'info',
		startEdit: {
			file: 'config/modules.json',
			content: configNode.content || ''
		}
	};
}

function commandNpm(args: string[], context: CommandContext): CommandResult {
	if (args.length < 2 || args[0] !== 'run') {
		return {
			output: 'Usage : npm run <script>\nScripts disponibles : build, start',
			type: 'error'
		};
	}

	const script = args[1];

	if (script === 'build') {
		return commandNpmBuild(context);
	} else if (script === 'start') {
		return commandNpmStart(context);
	} else {
		return {
			output: `Script npm inconnu : ${script}\nScripts disponibles : build, start`,
			type: 'error'
		};
	}
}

function commandNpmBuild(context: CommandContext): CommandResult {
	const output = `
> antidote-synthesis-system@1.0.0 build
> Compilation du système de synthèse

Lecture de la configuration : config/modules.json
Vérification des modules requis...
  ✓ Module uiRenderer : ACTIF
  ✓ Module dataRegistry : ACTIF
  ${context.modulesConfig.modules.synthesisEngine ? '✓' : '✗'} Module synthesisEngine : ${context.modulesConfig.modules.synthesisEngine ? 'ACTIF' : 'INACTIF'}
`;

	if (!context.modulesConfig.modules.synthesisEngine) {
		return {
			output:
				output +
				`
ERREUR DE COMPILATION
Le module 'synthesisEngine' n'est pas activé.
Ce module est ESSENTIEL pour le système de synthèse.

ACTION REQUISE :
Activez le module dans config/modules.json puis relancez la compilation.
`,
			type: 'error',
			buildSuccess: false
		};
	}

	return {
		output:
			output +
			`
Compilation des modules...
Génération des assets...
Optimisation du code...

✓ Compilation RÉUSSIE
Le système est prêt à être démarré.
Utilisez 'npm run start' pour lancer l'application.
`,
		type: 'success',
		buildSuccess: true
	};
}

function commandNpmStart(context: CommandContext): CommandResult {
	if (!context.buildSucceeded) {
		return {
			output: `
ERREUR : Aucune compilation valide détectée.

Vous devez d'abord compiler le système avec succès.
Utilisez 'npm run build' pour compiler.
`,
			type: 'error'
		};
	}

	return {
		output: `
> antidote-synthesis-system@1.0.0 start
> Lancement de l'application de synthèse

Initialisation du système de synthèse...
  ✓ Moteur de synthèse : ACTIF
  ✓ Registre de données : ACTIF
  ✓ Interface utilisateur : ACTIF

════════════════════════════════════════════════════════════════
  SYSTÈME DE SYNTHÈSE D'ANTIDOTE VAÏK-17 - DÉMARRÉ AVEC SUCCÈS
════════════════════════════════════════════════════════════════

Le programme est maintenant opérationnel.
Transfert vers l'interface de synthèse moléculaire...
`,
		type: 'success'
	};
}

function getNodeAtPath(
	path: string[],
	filesystem: Record<string, FileNode>
): FileNode | null {
	if (path.length === 0) {
		return { type: 'directory', name: '/', children: filesystem };
	}

	let current: FileNode | undefined = filesystem[path[0]];
	for (let i = 1; i < path.length; i++) {
		if (!current || current.type !== 'directory' || !current.children) {
			return null;
		}
		current = current.children[path[i]];
	}

	return current || null;
}

/**
 * Auto-complétion pour les commandes et arguments
 */
export function autocomplete(
	input: string,
	context: CommandContext
): string | null {
	const trimmed = input.trim();
	if (!trimmed) return null;

	const parts = trimmed.split(/\s+/);
	const cmd = parts[0].toLowerCase();

	// Si on n'a qu'un mot, compléter la commande
	if (parts.length === 1) {
		const commands = ['help', 'clear', 'ls', 'pwd', 'cd', 'cat', 'edit', 'npm'];
		const matches = commands.filter(c => c.startsWith(cmd));
		
		if (matches.length === 1) {
			return matches[0];
		}
		return null; // Plusieurs matches ou aucun
	}

	// Si on a plusieurs mots, compléter les arguments (fichiers/dossiers)
	const partialArg = parts[parts.length - 1];
	const node = getNodeAtPath(context.currentPath, context.filesystem);
	
	if (!node || node.type !== 'directory') {
		return null;
	}

	const children = node.children || {};
	const names = Object.keys(children);
	const matches = names.filter(name => name.startsWith(partialArg));

	if (matches.length === 1) {
		// Remplacer le dernier argument par le match complet
		const newParts = [...parts.slice(0, -1), matches[0]];
		return newParts.join(' ');
	}

	return null; // Plusieurs matches ou aucun
}