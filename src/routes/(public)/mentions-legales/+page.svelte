<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
</script>

<svelte:head>
    <title>Mentions légales - Zone404</title>
</svelte:head>

<section class="flex flex-col gap-8 p-8 lg:p-16 items-center w-full">
    <div class="flex flex-col items-center mb-8">
        <Logo classname="w-64 md:w-128 mx-auto"/>
    </div>
    <h1 class="h1">Mentions légales</h1>

    <div class="w-2/3">

        <h2 class="text-2xl mt-8">Éditeur du site</h2>

        <dl class="flex flex-col gap-2">
            <div class="flex gap-2">
                <dt>Nom de l'entreprise :</dt>
                <dd>Zone404</dd>
            </div>

            <div class="flex gap-2">
                <dt>Forme Juridique :</dt>
                <dd>---</dd>
            </div>

            <div class="flex gap-2">
                <dt>Capital Social :</dt>
                <dd>---</dd>
            </div>

            <div class="flex gap-2">
                <dt>Siège social :</dt>
                <dd>---</dd>
            </div>

            <div class="flex gap-2">
                <dt>Numéro d'immatriculation au RCS :</dt>
                <dd>---</dd>
            </div>

            <div class="flex gap-2">
                <dt>Numéro de TVA intracommunautaire :</dt>
                <dd>---</dd>
            </div>

            <div class="flex gap-2">
                <dt>Email :</dt>
                <dd class="text-primary-500 underline"><a href="mailto:zone404team@gmail.com">zone404team@gmail.com</a></dd>
            </div>

            <div class="flex gap-2">
                <dt>Directeur de la publication :</dt>
                <dd>---</dd>
            </div>
        </dl>

        <h2 class="text-2xl mt-8">Hébergeur</h2>

        <dl class="flex flex-col gap-2">
            <div class="flex gap-2">
                <dt>Nom de l'hébergeur :</dt>
                <dd>Scalingo</dd>
            </div>
        </dl>

        <h2 class="text-2xl mt-8">Propriété intellectuelle :</h2>

        <p>Le contenu du site (textes, images, graphismes, logo, bases de données, etc.) est la propriété exclusive de Zone404, sauf mentions contraires. Toute reproduction, modification ou utilisation sans autorisation préalable écrite est strictement interdite et susceptible de constituer une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</p>

        <h2 class="text-2xl mt-8">Traitement des données personnelles (RGPD) :</h2>

        <p>Les données personnelles collectées sont traitées conformément à la réglementation RGPD. Vous disposez d'un droit d'accès, de rectification, d'opposition, de limitation du traitement, d'effacement et de portabilité des données vous concernant. Pour exercer ces droits, veuillez contacter : <a class="text-primary-500 underline"
                                                  href="mailto:zone404team@gmail.com">zone404team@gmail.com</a>.
        </p>

        <h2 class="text-2xl mt-8">Cookies :</h2>

        <p>Ce site n'utilise aucun cookie de suivi, ni outil de mesure d'audience, ni traceur tiers (publicitaire ou de réseaux sociaux). Seuls des cookies strictement nécessaires au fonctionnement du site peuvent être utilisés, conformément à l'article 82 de la loi Informatique et Libertés.</p>

        <h2 class="text-2xl mt-8">Responsabilité :</h2>

        <p>Zone404 décline toute responsabilité pour d'éventuelles interruptions ou dysfonctionnements du site. Zone404 ne saurait être tenu responsable d'éventuels dommages directs ou indirects liés à l'utilisation du site.</p>

        <h2 class="text-2xl mt-8">Droit applicable et juridiction compétente :</h2>

        <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut d'accord amiable, les tribunaux compétents seront ceux relevant de la juridiction du siège social de Zone404. Date de mise à jour : 03/03/2026</p>

    </div>
</section>
