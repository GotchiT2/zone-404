<script lang="ts">
  import SalleCard from '$lib/components/SalleCard.svelte';
  import InfosPratiques from "$lib/components/InfosPratiques.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<div class="w-auto h-full overflow-scroll flex flex-col items-center">
    <Hero/>

    <Separator/>


    <section class="w-full bg-black p-8" id="salles">

        <div class="flex flex-col items-center justify-center gap-4 mb-8">
            <h2 class="h2 bg-blue-400 px-4 py-2 text-white my-16 shadow-md shadow-blue-500/50">
                Nos salles
            </h2>
        </div>

        <div class="flex mx-auto w-full justify-center gap-8 mb-16">
            <SalleCard
                    description="Plongez vos enfants dans un escape game jungle ludique et immersif ! En équipe de 2 à 6, les explorateurs de moins de 8 ans devront résoudre de petites énigmes et retrouver le trésor caché. Une aventure idéale pour une première expérience d’escape game."
                    href="/escape-kids"
                    img="/escape-kids-thumbnail.png"
                    roomLabel="Escape Kids : À la recherche du trésor de la jungle"
            >
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">De 4 à 8 ans</span><span
                        class="badge preset-filled-primary-500">Accompagnateur obligatoire</span></div>
            </SalleCard>

            <SalleCard
                    description="Osez ce escape game thriller pour 2 à 6 joueurs à partir de 16 ans. Fouillez le cabinet d’un tatoueur dérangé, rassemblez les preuves d’une série de meurtres et effacez toute trace de votre passage. Une enquête intense pour amateurs de sensations fortes."
                    href="/escape-kids"
                    img="/tatoueur-thumbnail.png"
                    roomLabel="Le Tatoueur Maudit : enquête dans un cabinet inquiétant"
            >
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">À partir de 16 ans</span></div>
            </SalleCard>

            <SalleCard
                    description="Dans ce escape game futuriste, vous êtes les derniers espoirs de l’humanité. Explorez un laboratoire abandonné, analysez les indices et reconstituez l’antidote du virus qui a décimé 99,6 % de la population. Survivrez-vous… ou succomberez comme les autres ?"
                    href="/escape-kids"
                    img="/labo-thumbnail.png"
                    roomLabel="Le Laboratoire de l’Extinction"
            >
                <div class="flex gap-4"><span class="badge preset-filled-primary-500">À partir de 12 ans</span></div>
            </SalleCard>
        </div>
    </section>

    <section class="w-full bg-blue-400 p-8 mt-16 shadow-lg shadow-blue-500/50 ">
        <div class="flex flex-col items-center justify-center gap-4 mb-8 text-black">
            <h2 class="h2 text-center mb-4">
                Réservez<br/><span class="font-extrabold">un escape game</span>
            </h2>

            <p>Choisissez votre créneau dès maintenant <span class="bg-black text-blue-400 font-bold p-2">à partir de XX€ par joueur !</span>
            </p>

            <a class="btn btn-lg  preset-tonal-surface mt-4" href="/reservation">Réserver maintenant</a>
        </div>
    </section>


    <section class="w-full bg-white py-32 px-8" id="offres">
        <div class="flex flex-col items-center justify-center gap-4 mb-8">
            <h2 class="h2 bg-blue-400 px-4 py-2 text-white mb-8 shadow-md shadow-blue-500/50 text-center">
                Découvrez<br/><span class="font-extrabold">nos formules</span>
            </h2>

            <div class="grid grid-cols-2 grid-rows-2 mx-auto gap-4 items-center justify-center">
                <div class="card text-center font-bold aspect-video flex justify-center items-center bg-[url(formule-anniversaire-2.png)] bg-cover hover:shadow-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <h3 class="h3 shadow-2xl">Formule anniversaire</h3>
                </div>

                <div class="card text-center font-bold aspect-video flex justify-center items-center bg-[url(reserver-une-partie-2.png)] bg-cover hover:shadow-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <h3 class="h3">Réservez autant de parties que vous le voulez !</h3>
                </div>

                <div class="row-start-2 card text-center font-bold aspect-video flex justify-center items-center bg-[url(team-building-2.png)] bg-cover hover:shadow-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <h3 class="h3">Formule entreprise</h3>
                </div>

                <div class="row-start-2 card text-center font-bold aspect-video flex justify-center items-center bg-[url(escape-game-nature-2.png)] bg-cover hover:shadow-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <h3 class="h3">Escape game nature</h3>
                </div>
            </div>
        </div>
    </section>

    <Separator/>

    <InfosPratiques/>

    <Footer/>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }


    @keyframes animateGrain {
        0%, 100% {
            transform: translate(0, 0)
        }
        10% {
            transform: translate(-5%, -10%)
        }
        20% {
            transform: translate(-15%, -20%)
        }
        30% {
            transform: translate(-5%, -10%)
        }
        40% {
            transform: translate(-15%, -20%)
        }

        50% {
            transform: translate(-5%, -10%)
        }
        60% {
            transform: translate(-15%, -20%)
        }
        70% {
            transform: translate(-5%, -10%)
        }
        80% {
            transform: translate(-15%, -20%)
        }
        90% {
            transform: translate(-5%, -10%)
        }
        100% {
            transform: translate(-15%, -20%)
        }

    }
</style>



