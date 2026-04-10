/**
 * Système de fichiers fictif pour le terminal de récupération
 */

export interface FileNode {
	type: 'file' | 'directory';
	name: string;
	content?: string;
	children?: Record<string, FileNode>;
}

export interface ModulesConfig {
	modules: {
		synthesisEngine: boolean;
		uiRenderer: boolean;
		dataRegistry: boolean;
	};
}

export function createFilesystem(): Record<string, FileNode> {
	return {
		'README_RECOVERY.txt': {
			type: 'file',
			name: 'README_RECOVERY.txt',
			content: `==============================================
  TERMINAL DE SECOURS - LABORATOIRE VAÏK-17
==============================================

SITUATION CRITIQUE DÉTECTÉE
Le système de synthèse d'antidote a rencontré une erreur fatale.
L'application principale est actuellement hors service.

VOTRE MISSION
Restaurer le système pour permettre la synthèse de l'antidote.

PROCÉDURE DE RÉCUPÉRATION
1. Examinez les journaux système pour identifier la cause de la panne
2. Corrigez la configuration défaillante
3. Relancez la compilation du système
4. Démarrez l'application de synthèse

COMMANDES DISPONIBLES
Tapez 'help' pour afficher la liste complète des commandes disponibles.

RAPPEL
Des millions de vies dépendent du succès de cette mission.
Le temps est compté.

Bon courage.
`
		},
		'package.json': {
			type: 'file',
			name: 'package.json',
			content: `{
  "name": "antidote-synthesis-system",
  "version": "1.0.0",
  "description": "Système de synthèse d'antidote Vaïk-17",
  "scripts": {
    "build": "Compilation du système de synthèse",
    "start": "Lancement de l'application de synthèse"
  },
  "dependencies": {
    "synthesis-engine": "^2.4.1",
    "molecular-analyzer": "^1.8.3",
    "data-registry": "^3.1.0"
  }
}
`
		},
		src: {
			type: 'directory',
			name: 'src',
			children: {
				'app.js': {
					type: 'file',
					name: 'app.js',
					content: `/**
 * Application principale - Système de synthèse d'antidote
 */

const config = require('../config/modules.json');

function initializeSynthesisSystem() {
  console.log('Initialisation du système de synthèse...');
  
  // Vérification de la disponibilité du moteur de synthèse
  if (!config.modules.synthesisEngine) {
    throw new Error(
      'ERREUR FATALE: Le module synthesisEngine n\'est pas activé.\\n' +
      'Impossible de démarrer l\'application de synthèse.'
    );
  }
  
  console.log('✓ Moteur de synthèse : ACTIF');
  console.log('✓ Registre de données : ACTIF');
  console.log('✓ Interface utilisateur : ACTIF');
  
  return {
    status: 'ready',
    modules: config.modules
  };
}

module.exports = { initializeSynthesisSystem };
`
				}
			}
		},
		config: {
			type: 'directory',
			name: 'config',
			children: {
				'modules.json': {
					type: 'file',
					name: 'modules.json',
					content: JSON.stringify(
						{
							modules: {
								synthesisEngine: false,
								uiRenderer: true,
								dataRegistry: true
							}
						},
						null,
						2
					)
				}
			}
		},
		logs: {
			type: 'directory',
			name: 'logs',
			children: {
				'build.log': {
					type: 'file',
					name: 'build.log',
					content: `[2026-04-10 18:42:17] Démarrage de la compilation...
[2026-04-10 18:42:18] Lecture de la configuration : config/modules.json
[2026-04-10 18:42:18] Vérification des modules requis...
[2026-04-10 18:42:19] ✓ Module uiRenderer : ACTIF
[2026-04-10 18:42:19] ✓ Module dataRegistry : ACTIF
[2026-04-10 18:42:19] ✗ Module synthesisEngine : INACTIF
[2026-04-10 18:42:19] 
[2026-04-10 18:42:19] ERREUR DE COMPILATION
[2026-04-10 18:42:19] Le module 'synthesisEngine' n'est pas activé dans la configuration.
[2026-04-10 18:42:19] Ce module est ESSENTIEL pour le système de synthèse d'antidote.
[2026-04-10 18:42:19] 
[2026-04-10 18:42:19] ACTION REQUISE:
[2026-04-10 18:42:19] Activez le module 'synthesisEngine' dans config/modules.json
[2026-04-10 18:42:19] puis relancez la compilation avec 'npm run build'
[2026-04-10 18:42:19] 
[2026-04-10 18:42:19] Compilation ÉCHOUÉE
`
				}
			}
		}
	};
}

export function parseModulesConfig(content: string): ModulesConfig | null {
	try {
		return JSON.parse(content) as ModulesConfig;
	} catch {
		return null;
	}
}

export function stringifyModulesConfig(config: ModulesConfig): string {
	return JSON.stringify(config, null, 2);
}