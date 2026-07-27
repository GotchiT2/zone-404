// Configuration centralisée du jeu d'escape game
import type { AntidoteComponent, GameStage, SearchableItem } from '$lib/types/escape-game';

/**
 * Configuration des étapes principales du jeu
 */
export const GAME_STAGES: GameStage[] = [
	{
		id: 'debug',
		name: 'Debug système',
		trialIndex: 1,
		description: 'Correction du bug dans le code d\'analyse'
	},
	{
		id: 'antidote',
		name: 'Synthèse de l\'antidote',
		trialIndex: 2, // Note: les sous-composants occupent les épreuves 2 à 7
		description: 'Reconstitution de la formule de l\'antidote'
	}
];

/**
 * ============================================================================
 * POOL DE RECHERCHE - Phase de synthèse de l'antidote
 * ============================================================================
 *
 * Le joueur recherche des mots via une barre de recherche. Après 3 lettres,
 * les suggestions correspondantes s'affichent. En validant un mot, une modale
 * montre la photo (`image`) et la `description` du produit.
 *
 * - isComponent: true  => bonne réponse (remplit un encart de la formule)
 *   -> doit avoir un `trialIndex` unique et existant en base (2 à 7 pour la
 *      salle-3 : l'épreuve 1 est réservée à la phase Debug/Terminal).
 * - isComponent: false => leurre (mauvaise réponse, message d'erreur).
 *
 * POUR COMPLÉTER (mots / photos / descriptions fournis ultérieurement) :
 * 1. Renseigner `name`, `image` et `description` de chaque élément.
 *    (image vide "" => un placeholder est affiché automatiquement)
 * 2. Ajouter autant de leurres que souhaité (isComponent: false).
 * 3. Ne pas modifier les `trialIndex` des composants sans vérifier la DB.
 * ============================================================================
 */
export const SEARCHABLE_ITEMS: SearchableItem[] = [
	// ÉPREUVE 2 - Hydrolyse du triglycéride -> Glycérol

	{
		id: "glycerol",
		name: "Glycérol",
		image: "/vaik-17/glycerol.png",
		description: "Triol issu de l'hydrolyse des triglycérides.",
		isComponent: true,
		trialIndex: 2,
	},
	{
		id: "ethanol",
		name: "Éthanol",
		image: "/vaik-17/ethanol.png",
		description: "Alcool simple utilisé comme solvant et antiseptique.",
		isComponent: false,
	},
	{
		id: "propylene-glycol",
		name: "Propylène glycol",
		image: "/vaik-17/propylene-glycol.png",
		description: "Composé organique utilisé dans de nombreuses formulations pharmaceutiques.",
		isComponent: false,
	},
	{
		id: "sorbitol",
		name: "Sorbitol",
		image: "/vaik-17/sorbitol.png",
		description: "Polyol utilisé comme édulcorant.",
		isComponent: false,
	},

	// ÉPREUVE 3 - Identification de l'antidote parmi les toxiques

	{
		id: "pralidoxime",
		name: "Pralidoxime",
		image: "/vaik-17/pralidoxime.png",
		description: "Réactivateur de l'acétylcholinestérase utilisé comme antidote de certains organophosphorés.",
		isComponent: true,
		trialIndex: 3,
	},
	{
		id: "digoxine",
		name: "Digoxine",
		image: "/vaik-17/digoxine.png",
		description: "Médicament cardiotonique pouvant devenir toxique en surdosage.",
		isComponent: false,
	},
	{
		id: "amanitine",
		name: "Amanitine",
		image: "/vaik-17/amanitine.png",
		description: "Toxine présente dans certaines amanites mortelles.",
		isComponent: false,
	},
	{
		id: "paraquat",
		name: "Paraquat",
		image: "/vaik-17/paraquat.png",
		description: "Herbicide extrêmement toxique pour l'organisme.",
		isComponent: false,
	},
	{
		id: "ricine",
		name: "Ricine",
		image: "/vaik-17/ricine.png",
		description: "Protéine hautement toxique extraite du ricin.",
		isComponent: false,
	},
	{
		id: "colchicine",
		name: "Colchicine",
		image: "/vaik-17/colchicine.jpg",
		description: "Alcaloïde utilisé en médecine mais toxique à forte dose.",
		isComponent: false,
	},
	{
		id: "methanol",
		name: "Méthanol",
		image: "/vaik-17/methanol.png",
		description: "Alcool toxique pouvant provoquer une cécité irréversible.",
		isComponent: false,
	},
	{
		id: "ethylene-glycol",
		name: "Éthylène glycol",
		image: "/vaik-17/ethylene-glycol.png",
		description: "Composé utilisé dans les antigels, responsable d'atteintes rénales graves.",
		isComponent: false,
	},
	{
		id: "monofluoroacetate",
		name: "Monofluoroacétate",
		image: "/vaik-17/monofluoroacetate.jpg",
		description: "Poison métabolique perturbant la respiration cellulaire.",
		isComponent: false,
	},
	{
		id: "thallium",
		name: "Thallium",
		image: "/vaik-17/thallium.jpg",
		description: "Métal lourd extrêmement toxique pour le système nerveux.",
		isComponent: false,
	},

	// ÉPREUVE 4 - Identification de la bonne culture bactérienne

{
	id: "lactobacillus-rhamnosus",
	name: "Lactobacillus rhamnosus",
	image: "/vaik-17/lactobacillus-rhamnosus.png",
	description: "Bactérie lactique utilisée en probiothérapie et étudiée pour ses effets bénéfiques sur l'organisme.",
	isComponent: true,
	trialIndex: 4,
},

{
	id: "escherichia-coli-o157h7",
	name: "Escherichia coli O157:H7",
	image: "/vaik-17/escherichia-coli-o157h7.jpg",
	description: "Souche pathogène d'Escherichia coli responsable d'infections digestives sévères.",
	isComponent: false,
},

{
	id: "staphylococcus-aureus",
	name: "Staphylococcus aureus",
	image: "/vaik-17/staphylococcus-aureus.jpg",
	description: "Bactérie fréquemment impliquée dans les infections cutanées et nosocomiales.",
	isComponent: false,
},

{
	id: "pseudomonas-aeruginosa",
	name: "Pseudomonas aeruginosa",
	image: "/vaik-17/pseudomonas-aeruginosa.jpg",
	description: "Agent opportuniste connu pour sa résistance à de nombreux antibiotiques.",
	isComponent: false,
},

{
	id: "salmonella-enterica",
	name: "Salmonella enterica",
	image: "/vaik-17/salmonella-enterica.jpg",
	description: "Bactérie responsable de nombreuses infections alimentaires.",
	isComponent: false,
},

{
	id: "vibrio-cholerae",
	name: "Vibrio cholerae",
	image: "/vaik-17/vibrio-cholerae.png",
	description: "Agent infectieux à l'origine du choléra.",
	isComponent: false,
},

{
	id: "clostridium-botulinum",
	name: "Clostridium botulinum",
	image: "/vaik-17/clostridium-botulinum.png",
	description: "Bactérie productrice de la toxine botulique.",
	isComponent: false,
},

{
	id: "bacillus-anthracis",
	name: "Bacillus anthracis",
	image: "/vaik-17/bacillus-anthracis.png",
	description: "Agent responsable du charbon bactérien.",
	isComponent: false,
},

{
	id: "yersinia-pestis",
	name: "Yersinia pestis",
	image: "/vaik-17/yersinia-pestis.png",
	description: "Bactérie historiquement associée aux épidémies de peste.",
	isComponent: false,
},

{
	id: "klebsiella-pneumoniae",
	name: "Klebsiella pneumoniae",
	image: "/vaik-17/klebsiella-pneumoniae.png",
	description: "Bactérie impliquée dans diverses infections respiratoires.",
	isComponent: false,
},

{
	id: "listeria-monocytogenes",
	name: "Listeria monocytogenes",
	image: "/vaik-17/listeria-monocytogenes.png",
	description: "Agent pathogène transmis notamment par certains aliments contaminés.",
	isComponent: false,
},

{
	id: "neisseria-meningitidis",
	name: "Neisseria meningitidis",
	image: "/vaik-17/neisseria-meningitidis.png",
	description: "Bactérie pouvant provoquer des méningites sévères.",
	isComponent: false,
},

{
	id: "shigella-dysenteriae",
	name: "Shigella dysenteriae",
	image: "/vaik-17/shigella-dysenteriae.png",
	description: "Bactérie responsable de formes graves de dysenterie.",
	isComponent: false,
},

{
	id: "mycobacterium-tuberculosis",
	name: "Mycobacterium tuberculosis",
	image: "/vaik-17/mycobacterium-tuberculosis.png",
	description: "Agent infectieux responsable de la tuberculose.",
	isComponent: false,
},

{
	id: "enterococcus-faecalis",
	name: "Enterococcus faecalis",
	image: "/vaik-17/enterococcus-faecalis.png",
	description: "Bactérie commensale pouvant devenir opportuniste dans certaines infections.",
	isComponent: false,
},

// ÉPREUVE 5 - Températures de fusion

  {
    "id": "eau-distillee",
    "name": "Eau distillée",
    "image": "/images/glossary/eau-distillee.jpg",
    "description": "Liquide purifié obtenu par distillation.",
    "isComponent": false
  },
  {
    "id": "eau-demineralisee",
    "name": "Eau déminéralisée",
    "image": "/images/glossary/eau-demineralisee.jpg",
    "description": "Eau dont les sels minéraux ont été retirés.",
    "isComponent": false
  },
  {
    "id": "solution-saline",
    "name": "Solution saline",
    "image": "/images/glossary/solution-saline.jpg",
    "description": "Solution aqueuse de chlorure de sodium.",
    "isComponent": false
  },
  {
    "id": "ethanol",
    "name": "Éthanol",
    "image": "/images/glossary/ethanol.jpg",
    "description": "Alcool couramment utilisé comme solvant.",
    "isComponent": false
  },
  {
    "id": "methanol",
    "name": "Méthanol",
    "image": "/images/glossary/methanol.jpg",
    "description": "Alcool simple utilisé en laboratoire.",
    "isComponent": false
  },
  {
    "id": "propanol",
    "name": "Propanol",
    "image": "/images/glossary/propanol.jpg",
    "description": "Alcool employé comme désinfectant et solvant.",
    "isComponent": false
  },
  {
    "id": "isopropanol",
    "name": "Isopropanol",
    "image": "/images/glossary/isopropanol.jpg",
    "description": "Alcool utilisé pour le nettoyage de précision.",
    "isComponent": false
  },
  {
    "id": "acetone",
    "name": "Acétone",
    "image": "/images/glossary/acetone.jpg",
    "description": "Solvant organique volatil.",
    "isComponent": false
  },
  {
    "id": "glycerol",
    "name": "Glycérol",
    "image": "/images/glossary/glycerol.jpg",
    "description": "Liquide visqueux utilisé en pharmacie.",
    "isComponent": false
  },
  {
    "id": "propylene-glycol",
    "name": "Propylène glycol",
    "image": "/images/glossary/propylene-glycol.jpg",
    "description": "Solvant utilisé dans les préparations pharmaceutiques.",
    "isComponent": false
  },
  {
    "id": "ethylene-glycol",
    "name": "Éthylène glycol",
    "image": "/images/glossary/ethylene-glycol.jpg",
    "description": "Diol utilisé dans les liquides de refroidissement.",
    "isComponent": false
  },
  {
    "id": "huile-minerale",
    "name": "Huile minérale",
    "image": "/images/glossary/huile-minerale.jpg",
    "description": "Huile transparente d'origine minérale.",
    "isComponent": false
  },
  {
    "id": "huile-silicone",
    "name": "Huile silicone",
    "image": "/images/glossary/huile-silicone.jpg",
    "description": "Liquide silicone incolore.",
    "isComponent": false
  },
  {
    "id": "paraffine-liquide",
    "name": "Paraffine liquide",
    "image": "/images/glossary/paraffine-liquide.jpg",
    "description": "Huile minérale très purifiée.",
    "isComponent": false
  },
  {
    "id": "hexane",
    "name": "Hexane",
    "image": "/images/glossary/hexane.jpg",
    "description": "Solvant organique aliphatique.",
    "isComponent": false
  },
  {
    "id": "heptane",
    "name": "Heptane",
    "image": "/images/glossary/heptane.jpg",
    "description": "Hydrocarbure liquide transparent.",
    "isComponent": false
  },
  {
    "id": "cyclohexane",
    "name": "Cyclohexane",
    "image": "/images/glossary/cyclohexane.jpg",
    "description": "Solvant cyclique utilisé en chimie.",
    "isComponent": false
  },
  {
    "id": "toluene",
    "name": "Toluène",
    "image": "/images/glossary/toluene.jpg",
    "description": "Solvant aromatique incolore.",
    "isComponent": false
  },
  {
    "id": "xylene",
    "name": "Xylène",
    "image": "/images/glossary/xylene.jpg",
    "description": "Famille de solvants aromatiques.",
    "isComponent": false
  },
  {
    "id": "ether-ethylique",
    "name": "Éther éthylique",
    "image": "/images/glossary/ether-ethylique.jpg",
    "description": "Solvant organique très volatil.",
    "isComponent": false
  },
  {
    "id": "acetonitrile",
    "name": "Acétonitrile",
    "image": "/images/glossary/acetonitrile.jpg",
    "description": "Solvant utilisé en chromatographie.",
    "isComponent": false
  },
  {
    "id": "dimethyl-sulfoxyde",
    "name": "Diméthylsulfoxyde",
    "image": "/images/glossary/dimethyl-sulfoxyde.jpg",
    "description": "Solvant polaire aprotique.",
    "isComponent": false
  },
  {
    "id": "formamide",
    "name": "Formamide",
    "image": "/images/glossary/formamide.jpg",
    "description": "Liquide polaire utilisé en biologie moléculaire.",
    "isComponent": false
  },
  {
    "id": "dimethylformamide",
    "name": "Diméthylformamide",
    "image": "/images/glossary/dimethylformamide.jpg",
    "description": "Solvant organique de synthèse.",
    "isComponent": false
  },
  {
    "id": "acide-acetique",
    "name": "Acide acétique",
    "image": "/images/glossary/acide-acetique.jpg",
    "description": "Acide organique incolore.",
    "isComponent": false
  },
  {
    "id": "acide-formique",
    "name": "Acide formique",
    "image": "/images/glossary/acide-formique.jpg",
    "description": "Acide organique naturellement présent chez certains insectes.",
    "isComponent": false
  },
  {
    "id": "acide-lactique",
    "name": "Acide lactique",
    "image": "/images/glossary/acide-lactique.jpg",
    "description": "Acide organique produit lors de la fermentation.",
    "isComponent": false
  },
  {
    "id": "ammoniaque",
    "name": "Solution d'ammoniaque",
    "image": "/images/glossary/ammoniaque.jpg",
    "description": "Solution aqueuse d'ammoniac.",
    "isComponent": false
  },
  {
    "id": "peroxyde-hydrogene",
    "name": "Peroxyde d'hydrogène",
    "image": "/images/glossary/peroxyde-hydrogene.jpg",
    "description": "Solution oxydante incolore.",
    "isComponent": false
  },
  {
    "id": "eau-oxygenee",
    "name": "Eau oxygénée",
    "image": "/images/glossary/eau-oxygenee.jpg",
    "description": "Nom courant du peroxyde d'hydrogène dilué.",
    "isComponent": false
  },
  {
    "id": "chloroforme",
    "name": "Chloroforme",
    "image": "/images/glossary/chloroforme.jpg",
    "description": "Liquide organique dense et transparent.",
    "isComponent": false
  },
  {
    "id": "dichloromethane",
    "name": "Dichlorométhane",
    "image": "/images/glossary/dichloromethane.jpg",
    "description": "Solvant chloré couramment utilisé.",
    "isComponent": false
  },
  {
    "id": "tetrahydrofurane",
    "name": "Tétrahydrofurane",
    "image": "/images/glossary/tetrahydrofurane.jpg",
    "description": "Solvant organique cyclique.",
    "isComponent": false
  },
  {
    "id": "dioxane",
    "name": "Dioxane",
    "image": "/images/glossary/dioxane.jpg",
    "description": "Éther cyclique utilisé en synthèse.",
    "isComponent": false
  },
  {
    "id": "solution-tampon-phosphate",
    "name": "Solution tampon phosphate",
    "image": "/images/glossary/solution-tampon-phosphate.jpg",
    "description": "Solution utilisée en laboratoire de biologie.",
    "isComponent": false
  },
  {
    "id": "solution-tampon-tris",
    "name": "Solution tampon Tris",
    "image": "/images/glossary/solution-tampon-tris.jpg",
    "description": "Tampon couramment utilisé en biochimie.",
    "isComponent": false
  },
  {
    "id": "solution-glucose",
    "name": "Solution de glucose",
    "image": "/images/glossary/solution-glucose.jpg",
    "description": "Solution aqueuse de glucose.",
    "isComponent": false
  },
  {
    "id": "solution-saccharose",
    "name": "Solution de saccharose",
    "image": "/images/glossary/solution-saccharose.jpg",
    "description": "Solution aqueuse de sucre.",
    "isComponent": false
  },
  {
    "id": "serum-physiologique",
    "name": "Sérum physiologique",
    "image": "/images/glossary/serum-physiologique.jpg",
    "description": "Solution saline isotonique stérile.",
    "isComponent": false
  },
  {
    "id": "azureline",
    "name": "Azuréline",
    "image": "/images/glossary/azureline.jpg",
    "description": "Solution bleu profond mise au point en laboratoire et utilisée dans la formulation de l'antidote expérimental.",
    "isComponent": true,
    "trialIndex": 5
  },

// ÉPREUVE 6 - Roche mutagène

{
	id: "kheronite",
	name: "Kheronite",
	image: "/vaik-17/kheronite.png",
	description: "Minéral rare étudié pour ses interactions uniques avec certains mécanismes cellulaires avancés.",
	isComponent: true,
	trialIndex: 6,
},

{
	id: "abyssalite",
	name: "Abyssalite",
	image: "/vaik-17/abyssalite.png",
	description: "Roche abyssale à reflets bleutés principalement appréciée pour son aspect décoratif.",
	isComponent: false,
},

{
	id: "lunacite",
	name: "Lunacite",
	image: "/vaik-17/lunacite.png",
	description: "Minéral réfléchissant souvent associé à diverses croyances ésotériques.",
	isComponent: false,
},

{
	id: "ferronyx",
	name: "Ferronyx",
	image: "/vaik-17/ferronyx.png",
	description: "Agrégat minéral riche en composés métalliques et étudié pour ses propriétés magnétiques.",
	isComponent: false,
},

{
	id: "zenorite",
	name: "Zénorite",
	image: "/vaik-17/zenorite.png",
	description: "Pierre populaire en lithothérapie mais sans activité biologique démontrée.",
	isComponent: false,
},

{
	id: "cryolith",
	name: "Cryolith",
	image: "/vaik-17/cryolith.png",
	description: "Cristal capable de conserver les basses températures pendant de longues périodes.",
	isComponent: false,
},

{
	id: "solarys",
	name: "Solarys",
	image: "/vaik-17/solarys.png",
	description: "Minéral luminescent utilisé dans certains systèmes de signalisation passive.",
	isComponent: false,
},

// ÉPREUVE 7 - Signal audio / microscope

	{
	id: "velaxine",
	name: "Velaxine",
	image: "/vaik-17/velaxine.png",
	description: "Protéine favorisant l'adhésion des cellules saines aux tissus lésés.",
	isComponent: true,
	trialIndex: 7,
},

{
	id: "cyrenol",
	name: "Cyrenol",
	image: "/vaik-17/cyrenol.png",
	description: "Peptide expérimental étudié pour ses interactions avec les membranes cellulaires.",
	isComponent: false,
},

{
	id: "novarine",
	name: "Novarine",
	image: "/vaik-17/novarine.png",
	description: "Protéine présente dans plusieurs sécrétions animales d'origine inconnue.",
	isComponent: false,
},

{
	id: "thalexine",
	name: "Thalexine",
	image: "/vaik-17/thalexine.png",
	description: "Molécule biologique impliquée dans différents mécanismes enzymatiques.",
	isComponent: false,
},

{
	id: "oprhyline",
	name: "Oprhyline",
	image: "/vaik-17/oprhyline.png",
	description: "Protéine étudiée pour ses propriétés de stabilisation moléculaire.",
	isComponent: false,
},

{
	id: "kerycine",
	name: "Kerycine",
	image: "/vaik-17/kerycine.png",
	description: "Peptide expérimental observé dans plusieurs espèces invertébrées.",
	isComponent: false,
},

{
	id: "lysorine",
	name: "Lysorine",
	image: "/vaik-17/lysorine.png",
	description: "Molécule organique participant à certains processus de réparation cellulaire in vitro.",
	isComponent: false,
},

{
	id: "feranine",
	name: "Feranine",
	image: "/vaik-17/feranine.png",
	description: "Protéine de faible masse moléculaire identifiée dans plusieurs échantillons biologiques.",
	isComponent: false,
},

{
	id: "nexiline",
	name: "Nexiline",
	image: "/vaik-17/nexiline.png",
	description: "Composé protéique étudié dans des travaux de biochimie expérimentale.",
	isComponent: false,
},
];

/**
 * Nombre d'encarts à remplir (= nombre de composants de l'antidote).
 */
export const ANTIDOTE_COMPONENT_COUNT = SEARCHABLE_ITEMS.filter(i => i.isComponent).length;

/**
 * Normalise une chaîne pour la recherche/comparaison :
 * minuscules, sans espaces superflus, sans accents/diacritiques.
 */
export function normalizeSearch(value: string): string {
	// ̀-ͯ = plage des diacritiques combinants (accents)
	return value
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');
}

/**
 * Recherche d'éléments à partir d'une requête.
 * Renvoie [] tant que la requête fait moins de 3 caractères.
 * Les correspondances par préfixe sont priorisées.
 */
export function searchItems(query: string): SearchableItem[] {
	const q = normalizeSearch(query);
	if (q.length < 3) return [];

	const matches = SEARCHABLE_ITEMS.filter(item => normalizeSearch(item.name).includes(q));

	return matches.sort((a, b) => {
		const aStarts = normalizeSearch(a.name).startsWith(q) ? 0 : 1;
		const bStarts = normalizeSearch(b.name).startsWith(q) ? 0 : 1;
		if (aStarts !== bStarts) return aStarts - bStarts;
		return a.name.localeCompare(b.name);
	});
}

/**
 * Trouve un élément par correspondance exacte (normalisée) de son nom.
 */
export function findItemByName(name: string): SearchableItem | undefined {
	const n = normalizeSearch(name);
	return SEARCHABLE_ITEMS.find(item => normalizeSearch(item.name) === n);
}

/**
 * Préfixe technique encodé dans les QR codes (douchette).
 * Une valeur scannée de la forme `VAIK17:<id>` déclenche la validation
 * directe (sans modale). Un joueur ne tape jamais ce préfixe à la main.
 */
export const SCAN_PREFIX = 'VAIK17:';

/**
 * Si `value` correspond à un scan, renvoie le code (slug) qui suit le préfixe ;
 * sinon renvoie null (saisie manuelle).
 *
 * Détection tolérante : le mot-clé "VAIK17" est recherché sans tenir compte de
 * la casse et même s'il est précédé d'un caractère parasite (certaines douchettes
 * en ajoutent). Le séparateur entre le mot-clé et le slug peut être n'importe
 * quel caractère non alphanumérique (':', ';', espace…), car les symboles sont
 * les plus sensibles à la configuration clavier de la douchette.
 */
export function parseScanCode(value: string): string | null {
	// "VAIK17" (insensible à la casse) + séparateur quelconque + slug.
	const match = value.match(/VAIK17\W*([a-z0-9-]+)/i);
	return match ? match[1] : null;
}

/**
 * Trouve un élément par correspondance exacte (normalisée) de son id (slug).
 */
export function findItemById(id: string): SearchableItem | undefined {
	const n = normalizeSearch(id);
	return SEARCHABLE_ITEMS.find(item => normalizeSearch(item.id) === n);
}

/**
 * ============================================================================
 * Compatibilité : composants de l'antidote dérivés du pool de recherche.
 * ============================================================================
 */
export const ANTIDOTE_COMPONENTS: AntidoteComponent[] = SEARCHABLE_ITEMS
	.filter(i => i.isComponent)
	.map((i, index) => ({
		id: index + 1,
		label: i.name,
		answer: normalizeSearch(i.name),
		trialIndex: i.trialIndex as number,
		hint: i.description
	}));

/**
 * Helper: Récupérer un composant par son ID
 */
export function getComponentById(id: number): AntidoteComponent | undefined {
	return ANTIDOTE_COMPONENTS.find(c => c.id === id);
}

/**
 * Helper: Récupérer un composant par son trial index
 */
export function getComponentByTrialIndex(trialIndex: number): AntidoteComponent | undefined {
	return ANTIDOTE_COMPONENTS.find(c => c.trialIndex === trialIndex);
}

/**
 * Helper: Valider une réponse pour un composant
 */
export function validateComponentAnswer(componentId: number, answer: string): boolean {
	const component = getComponentById(componentId);
	if (!component) return false;

	return normalizeSearch(answer) === component.answer;
}
