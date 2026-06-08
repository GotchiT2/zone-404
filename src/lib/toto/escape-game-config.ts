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
		trialIndex: 2, // Note: on utilise 2-11 pour les sous-composants
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
 *   -> doit avoir un `trialIndex` unique (2 à 11) pour la synchro API.
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
	// ÉPREUVE 0 - Hydrolyse du triglycéride -> Glycérol

	{
		id: "glycerol",
		name: "Glycérol",
		image: "/vaik-17/glycerol.png",
		description: "Triol issu de l'hydrolyse des triglycérides.",
		isComponent: true,
		trialIndex: 0,
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

	// ÉPREUVE 1 - Identification de l'antidote parmi les toxiques

	{
		id: "pralidoxime",
		name: "Pralidoxime",
		image: "/vaik-17/pralidoxime.png",
		description: "Réactivateur de l'acétylcholinestérase utilisé comme antidote de certains organophosphorés.",
		isComponent: true,
		trialIndex: 1,
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

	// ÉPREUVE 2 - Identification de la bonne culture bactérienne

{
	id: "lactobacillus-rhamnosus",
	name: "Lactobacillus rhamnosus",
	image: "/vaik-17/lactobacillus-rhamnosus.png",
	description: "Bactérie lactique utilisée en probiothérapie et étudiée pour ses effets bénéfiques sur l'organisme.",
	isComponent: true,
	trialIndex: 2,
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

// ÉPREUVE 3 - Températures de fusion

{
	id: "silicium",
	name: "Silicium",
	image: "/vaik-17/silicium.png",
	description: "Métalloïde largement utilisé dans les semi-conducteurs et les technologies modernes.",
	isComponent: true,
	trialIndex: 3,
},

{
	id: "gallium",
	name: "Gallium",
	image: "/vaik-17/gallium.png",
	description: "Métal capable de fondre à une température proche de celle du corps humain.",
	isComponent: false,
},

{
	id: "indium",
	name: "Indium",
	image: "/vaik-17/indium.png",
	description: "Métal utilisé dans certains écrans et composants électroniques.",
	isComponent: false,
},

{
	id: "zinc",
	name: "Zinc",
	image: "/vaik-17/zinc.png",
	description: "Métal utilisé notamment pour protéger l'acier contre la corrosion.",
	isComponent: false,
},

{
	id: "aluminium",
	name: "Aluminium",
	image: "/vaik-17/aluminium.png",
	description: "Métal léger largement utilisé dans l'industrie et les transports.",
	isComponent: false,
},

{
	id: "argent",
	name: "Argent",
	image: "/vaik-17/argent.png",
	description: "Métal précieux connu pour son excellente conductivité électrique.",
	isComponent: false,
},

{
	id: "or",
	name: "Or",
	image: "/vaik-17/or.png",
	description: "Métal précieux apprécié pour sa stabilité chimique.",
	isComponent: false,
},

{
	id: "cuivre",
	name: "Cuivre",
	image: "/vaik-17/cuivre.png",
	description: "Métal rougeâtre très utilisé dans les câblages électriques.",
	isComponent: false,
},

// ÉPREUVE 4 - Roche mutagène

{
	id: "kheronite",
	name: "Kheronite",
	image: "/vaik-17/kheronite.png",
	description: "Minéral rare étudié pour ses interactions uniques avec certains mécanismes cellulaires avancés.",
	isComponent: true,
	trialIndex: 4,
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

// ÉPREUVE 5 - Signal audio / microscope

{
	id: "velorine",
	name: "Velorine",
	image: "/vaik-17/velorine.png",
	description: "Protéine isolée à partir du venin des serpents Véloriens et étudiée pour ses propriétés d'adhésion cellulaire.",
	isComponent: true,
	trialIndex: 5,
},

{
	id: "araxine",
	name: "Araxine",
	image: "/vaik-17/araxine.png",
	description: "Protéine expérimentale associée à certains arthropodes venimeux.",
	isComponent: false,
},

{
	id: "nectrazine",
	name: "Nectrazine",
	image: "/vaik-17/nectrazine.png",
	description: "Molécule protéique identifiée dans plusieurs espèces forestières.",
	isComponent: false,
},

{
	id: "amphorine",
	name: "Amphorine",
	image: "/vaik-17/amphorine.png",
	description: "Protéine étudiée dans certaines sécrétions d'amphibiens.",
	isComponent: false,
},

{
	id: "lacertine",
	name: "Lacertine",
	image: "/vaik-17/lacertine.png",
	description: "Molécule biologique isolée chez plusieurs reptiles.",
	isComponent: false,
},

{
	id: "corvine",
	name: "Corvine",
	image: "/vaik-17/corvine.png",
	description: "Protéine rare observée dans certains échantillons aviaires.",
	isComponent: false,
},

{
	id: "noctiline",
	name: "Noctiline",
	image: "/vaik-17/noctiline.png",
	description: "Molécule expérimentale étudiée chez différentes espèces nocturnes.",
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
