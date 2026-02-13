<script lang="ts">
  import InfosPratiques from "$lib/components/InfosPratiques.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Separator from "$lib/components/Separator.svelte";
</script>

<Hero/>

<section class="w-full bg-[url(/oskour-2.jpg)] p-8 mask-b-from-98% md:mask-b-from-95% mask-b-to-100%" id="salles">
    <div class="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-4 my-16">
        <div class="relative">
            <span class="badge h5 bg-[#8AAC3580] absolute -right-10 -top-0 z-10 rotate-20">15€ par enfant !</span>
            <img alt="" class="drop-shadow-[0_0_10px_#8AAC3580]" src="/escape-kids-vert-2.png">
        </div>
        <div class="md:w-1/5">
            <h3 class="h4 mb-4">Escape Kids : À la recherche<br/>du trésor de la jungle</h3>
            <Separator color="#8AAC3580"/>
            <p class="my-4">Plongez vos enfants dans un <span
                    class="font-bold">escape game jungle ludique et immersif !</span> En équipe de 2 à
                6,
                les explorateurs
                de moins de 8 ans devront résoudre de petites énigmes et retrouver le trésor caché. <span
                        class="font-bold">Une aventure
                idéale
                    pour une première expérience d’escape game.</span></p>
            <div class="flex gap-4"><span class="badge preset-filled-primary-500">De 4 à 8 ans</span><span
                    class="badge preset-filled-primary-500">Accompagnateur obligatoire</span></div>
            <a class="btn h6 bg-[#8AAC3580] hover:bg-[#8AAC3580] mt-8" href="/reservation">Réservez une session</a>

        </div>
    </div>

    <div class="flex flex-col md:flex-row-reverse w-full justify-center items-center gap-8 md:gap-4 my-16">
        <img alt="" class="drop-shadow-[0_0_10px_#D8481980]" src="/escape-tattoo-vert-2.png">
        <div class="md:w-1/5">
            <h3 class="h4 mb-8">Le Tatoueur Maudit : enquête <br/>dans un cabinet inquiétant</h3>
            <Separator color="#D8481980"/>
            <p class="my-4">Osez ce escape game thriller pour 2 à 6 joueurs à partir de 16 ans. Fouillez le cabinet d’un
                tatoueur
                dérangé, <span class="font-bold">rassemblez les preuves d’une série de meurtres</span> et effacez toute
                trace de votre passage. Une
                enquête intense pour amateurs de sensations fortes.</p>
            <div class="flex gap-4"><span class="badge preset-filled-primary-500">À partir de 16 ans</span></div>
            <a class="btn h6 bg-[#D8481980] hover:bg-[#D8481980] mt-8" href="/reservation">Réservez une session</a>
        </div>
    </div>

    <div class="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-4 my-16">
        <img alt="" class="drop-shadow-[0_0_10px_#40CBB180]" src="/escape-labo-vert-2.png">
        <div class="md:w-1/5">
            <h3 class="h4 mb-8">Le Laboratoire de l’Extinction</h3>
            <Separator color="#40CBB180"/>
            <p class="my-4">Dans ce escape game futuriste, vous êtes les derniers espoirs de l’humanité. <span
                    class="font-bold">Explorez un
                laboratoire
                abandonné</span>, analysez les indices et <span
                    class="font-bold">reconstituez l’antidote du virus</span> qui a décimé 99,6 % de la
                population. Survivrez-vous… ou succomberez comme les autres ?</p>
            <div class="flex gap-4"><span class="badge preset-filled-primary-500">À partir de 12 ans</span></div>
            <a class="btn h6 bg-[#40CBB180] hover:bg-[#40CBB180] mt-8" href="/reservation">Réservez une session</a>
        </div>
    </div>

    <div class="flex flex-col md:flex-row-reverse w-full justify-center items-center gap-8 md:gap-4 my-16">
        <img alt="" class="drop-shadow-[0_0_10px_#EAB72080]" src="/escape-game-nature-vert.png">
        <div class="md:w-1/5">
            <h3 class="h4 mb-8">Escape Game Nature</h3>
            <Separator color="#EAB72080"/>
            <p class="my-4">Texte à définir</p>
            <div class="flex gap-4"><span class="badge preset-filled-primary-500">En famille ou entre amis</span></div>
            <a class="btn h6 bg-[#EAB72080] hover:bg-[#EAB72080] mt-8" href="/reservation">Réservez une session</a>
        </div>
    </div>
</section>

<section class="w-full bg-blue-400 p-8 mt-16 shadow-lg shadow-blue-500/50 ">
    <div class="flex flex-col items-center justify-center gap-4 mb-8 text-black">
        <h2 class="h2 text-center mb-4">
            Réservez<br/><span class="font-extrabold">un escape game</span>
        </h2>

        <p>Choisissez votre créneau dès maintenant <span class="bg-black text-blue-400 font-bold p-2">à partir de deux joueurs !</span>
        </p>

        <a class="btn btn-lg  preset-tonal-surface mt-4" href="/reservation">Réserver maintenant</a>
    </div>
</section>

<section class="w-full bg-white py-32 px-8 bg-[url(/oskour.jpg)] bg-cover" id="offres">
    <div class="flex flex-col items-center justify-center gap-4 mb-8">
        <h2 class="h2 bg-blue-400 px-4 py-2 text-white mb-8 shadow-md shadow-blue-500/50 text-center">
            Découvrez<br/><span class="font-extrabold">nos formules</span>
        </h2>

        <div class="columns-1 md:columns-2 mx-auto gap-8">
            <div class="card mb-8 px-8 text-center font-bold aspect-video flex justify-center items-center bg-[url(formule-anniversaire-2.png)] bg-cover hover:shadow-2xl  transition-opacity cursor-pointer">
                <h3 class="h3">Formule anniversaire</h3>
            </div>

            <div class="card mb-8 px-8 text-center font-bold aspect-video flex flex-wrap justify-center items-center bg-[url(reserver-une-partie-2.png)] bg-cover hover:shadow-2xl  transition-opacity cursor-pointer">
                <h3 class="h3">Réservez autant de parties <br/>que vous le voulez !</h3>
            </div>

            <div class="card mb-8 px-8 text-center font-bold aspect-video flex justify-center items-center bg-[url(team-building-2.png)] bg-cover hover:shadow-2xl  transition-opacity cursor-pointer">
                <h3 class="h3">Formule entreprise</h3>
            </div>

            <div class="card mb-8 px-8 text-center font-bold aspect-video flex justify-center items-center bg-[url(escape-game-nature-2.png)] bg-cover hover:shadow-2xl  transition-opacity cursor-pointer">
                <h3 class="h3">Escape game nature</h3>
            </div>
        </div>
    </div>
</section>

<Separator/>

<InfosPratiques/>
