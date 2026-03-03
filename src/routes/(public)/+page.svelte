<script lang="ts">
  import InfosPratiques from "$lib/components/InfosPratiques.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import {PUBLIC_AFFICHER_MESSAGE_INFO, PUBLIC_BANDEAU_MESSAGE} from "$env/static/public";
  import BeholdWidget from "@behold/svelte";
</script>

{#if PUBLIC_AFFICHER_MESSAGE_INFO === "true"}
    <div class="w-full bg-blue-400 flex flex-col items-center items-center gap-2 p-4 lg:grid-cols-[1fr_auto] border-b border-b-white">
        <p class="text-sm font-bold opacity-80">{PUBLIC_BANDEAU_MESSAGE}</p>
    </div>
{/if}

<Hero/>

<section class="w-full bg-black" id="salles">
    <div class="w-full bg-[url(/oskour-2.jpg)] p-8 mask-b-from-98% md:mask-b-from-95% mask-b-to-100%">

        <div id="bar-a-jeux" class="flex flex-col md:flex-row-reverse w-full justify-center items-center gap-8 md:gap-4 my-16 opacity-80">
            <img alt="" class="drop-shadow-[0_0_10px_#EAB72080]" src="/bar-a-jeu.png">
            <div class="md:w-1/5">
                <h3 class="h4 mb-8">Bar à Jeux <br/>le plaisir simple avant tout!</h3>
                <Separator color="#EAB72080"/>
                <p class="my-4">Un espace convivial pour partager un moment simple et chaleureux.<br/>
                    Jeux de société originaux, fléchettes, baby-foot, jeux de comptoir…
                    Ici, on joue, on rit, on se défie, comme à la maison.<br/>
                    Côté bar, boissons et petite restauration pour accompagner votre partie.
                    (Alcool servi uniquement avec consommation de nourriture.)<br/>
                    <span class="font-bold">À Zone 404, on vient pour jouer… et on reste pour l’ambiance.</span>
                </p>
            </div>
        </div>

        <div id="classe-magique" class="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-4 my-16">
            <div class="relative">
                <span class="badge h5 bg-[#8AAC3580] absolute -right-10 -top-0 z-10 rotate-20">15€ par enfant !</span>
                <img alt="" class="drop-shadow-[0_0_10px_#8AAC3580]" src="/escape-kids.png">
            </div>
            <div class="md:w-1/5">
                <h3 class="h4 mb-4">La Classe Magique:<br/>Le Mystère de Souchisse</h3>
                <Separator color="#8AAC3580"/>
                <p class="my-4">Transformez vos enfants en apprenti magicien dans un
                    <span class="font-bold">escape game ludique et immersif !</span> En équipe de 2 à 6, les apprentis sorciers de 4 à 9 ans devront résoudre de petites énigmes et découvrir le mystère de la créature “Souchisse”, maîtresse de l’école de magie.
                    <span class="font-bold">Une aventure idéale pour une première expérience d’escape game.</span>
                </p>
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">De 4 à 8 ans</span><span
                        class="badge preset-filled-primary-500">Accompagnateur obligatoire</span></div>
                <a class="btn h6 bg-[#8AAC3580] hover:bg-[#8AAC3580] mt-8" href="/reservation">Réservez une session</a>

            </div>
        </div>

        <div id="encre-damnes" class="flex flex-col md:flex-row-reverse w-full justify-center items-center gap-8 md:gap-4 my-16">
            <img alt="" class="drop-shadow-[0_0_10px_#D8481980]" src="/escape-tattoo-vert-2.png">
            <div class="md:w-1/5">
                <h3 class="h4 mb-8">L’Encre des Damnés : enquête <br/>dans un cabinet inquiétant</h3>
                <Separator color="#D8481980"/>
                <p class="my-4">Osez cet escape game thriller pour 2 à 6 joueurs à partir de 15 ans. Fouillez le cabinet de Didier, un tatoueur dérangé,
                    <span class="font-bold">rassemblez les preuves d’une série de meurtres</span> et effacez toute
                    trace de votre passage. Une
                    enquête intense pour amateurs de sensations fortes.</p>
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">À partir de 15 ans</span></div>
                <a class="btn h6 bg-[#D8481980] hover:bg-[#D8481980] mt-8" href="/reservation">Réservez une session</a>
            </div>
        </div>

        <div id="projet-vaik-17" class="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-4 my-16 opacity-80">
            <div class="relative">
                <span class="badge h5 bg-[#40CBB180] w-full md:w-fit absolute inset-0 md:inset-auto md:-right-10 md:-top-0 z-10 md:rotate-20">À venir...</span>
                <img alt="" class="drop-shadow-[0_0_10px_#40CBB180]" src="/escape-labo-vert-2.png">
            </div>
            <div class="md:w-1/5">
                <h3 class="h4 mb-8">Projet Vaïk 17 <br/>le Laboratoire de l’extinction</h3>
                <Separator color="#40CBB180"/>
                <p class="my-4">Dans ce escape game futuriste, vous êtes les derniers espoirs de l’humanité. <span
                        class="font-bold">Explorez un
                    laboratoire
                    abandonné</span>, analysez les indices et <span
                        class="font-bold">reconstituez l’antidote du virus</span> qui a décimé 99,6 % de la
                    population. Deviendrez vous les sauveurs de l’Humanité…?
                </p>
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">Familial, à partir de 10 ans</span></div>
                <!--            <a class="btn h6 bg-[#40CBB180] hover:bg-[#40CBB180] mt-8" href="/reservation">Réservez une session</a>-->
            </div>
        </div>

        <div id="tresor-cache" class="flex flex-col md:flex-row-reverse w-full justify-center items-center gap-8 md:gap-4 my-16 opacity-80">
            <div class="relative">
                <span class="badge h5 bg-[#EAB72080]  w-full md:w-fit absolute inset-0 md:inset-auto md:-right-10 md:-top-0 z-10 md:rotate-20">À venir...</span>
                <img alt="" class="drop-shadow-[0_0_10px_#EAB72080]" src="/escape-game-nature-vert.png">
            </div>
            <div class="md:w-1/5">
                <h3 class="h4 mb-8">Le Trésor Caché des 7 Vallées <br/>Escape Game Nature</h3>
                <Separator color="#EAB72080"/>
                <p class="my-4">Et si Beaurainville devenait votre terrain d’aventure ? Partez pour un <span class="font-bold">escape game en plein air</span> à travers les rues et les lieux emblématiques du village.
                    En équipe, explorez, observez, réfléchissez… et récoltez des indices à chaque étape, afin de pouvoir déchiffrer le code final du trésor.
                </p>
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">En famille ou entre amis</span></div>
                <!--            <a class="btn h6 bg-[#EAB72080] hover:bg-[#EAB72080] mt-8" href="/reservation">Réservez une session</a>-->
            </div>
        </div>

        <div id="studio-404" class="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-4 my-16 opacity-80">
            <div class="relative">
                <span class="badge h5 bg-[#d452e1] w-full md:w-fit absolute inset-0 md:inset-auto md:-right-10 md:-top-0 z-10 md:rotate-20">À venir...</span>
                <img alt="" class="drop-shadow-[0_0_10px_#d452e1]" src="/salle-quizz.png">
            </div>
            <div class="md:w-1/5">
                <h3 class="h4 mb-8">Studio 404 :<br/>Battle entre amis</h3>
                <Separator color="#d452e1"/>
                <p class="my-4">Envie de <span class="font-bold">rire, buzzer, chanter et vous défier</span> dans une ambiance survoltée ? Bienvenue dans la salle la plus festive de Zone 404.<br/>
                    Ici, on ne regarde pas un jeu télé… on le vit.
                    Et les stars, c’est vous.<br/>
                    Installez-vous, détendez-vous, prenez le micro, buzzez sans pression…
                    Comme si vous étiez chez vous.
                    Mais avec le son et l’ambiance en plus.
                </p>
                <!--            <a class="btn h6 bg-[#40CBB180] hover:bg-[#40CBB180] mt-8" href="/reservation">Réservez une session</a>-->
            </div>
        </div>
    </div>
</section>

<section class="w-full bg-blue-400 p-8 shadow-lg shadow-blue-500/50 ">
    <div class="flex flex-col items-center justify-center gap-4 mb-8 text-black">
        <h2 class="h2 text-center mb-4">
            Réservez<br/><span class="font-extrabold">un escape game</span>
        </h2>

        <p>Choisissez votre créneau dès maintenant <span class="bg-black text-blue-400 font-bold p-2">à partir de deux joueurs !</span>
        </p>

        <a class="btn btn-lg  preset-tonal-surface mt-4" href="/reservation">Réserver maintenant</a>
    </div>
</section>

<div class="w-full bg-white py-32 px-8 bg-[url(/oskour.jpg)] bg-cover">
    <BeholdWidget feedId="aPI1v6frfEg20waHNTV7"/>

    <div class="w-full md:w-1/2 py-32 px-8 flex justify-center mx-auto">
        <div class="tagembed-widget mx-auto" style="width:100%;height:100%;overflow:auto;" data-widget-id="317786" data-website="1"></div><script src="https://widget.tagembed.com/embed.min.js" type="text/javascript"></script>
    </div>
</div>

<Separator/>

<InfosPratiques/>
