<script>
    import Map from '$lib/components/Map.svelte';
    import {ChevronDownIcon} from '@lucide/svelte';
    import {Accordion} from '@skeletonlabs/skeleton-svelte';
    import {slide} from 'svelte/transition';

    const items = [
        {
            id: '1',
            title: 'Comment se rendre sur place ?',
            description:
                'Nous sommes situés au 138 Grande Rue, 62990 Beaurainville. Un parking gratuit est disponible à proximité pour nos visiteurs. Nous sommes situés au cœur des 7 vallées, à seulement 25 minutes de Berck, 30 minutes du Touquet, 5 minutes de Campagne-lès-Hesdin et 15 minutes de Montreuil-sur-Mer.',
        },
        {
            id: '2',
            title: 'Quels moyens de paiement sont acceptés ?',
            description:
                'En ligne, nous acceptons les paiements par carte bancaire. Sur place, nous acceptons les paiements en espèces ou par carte bancaire.',
        },
        {
            id: '3',
            title: 'Combien de joueurs sont autorisés par salle ?',
            description:
                'Chaque salle peut accueillir de 2 à 6 joueurs. Pour La classe magique: Le mystère de Souchisse, la salle accepte jusqu’à 6 enfants et 2 accompagnateurs.',
        },
        {
            id: '4',
            title: 'Y a-t-il des restrictions d’âge pour participer ?',
            description:
                'Oui, certaines salles ont des restrictions d’âge. La classe magique: Le mystère de Souchisse est conçue pour les enfants de 4 à 9 ans, accompagnés d’un adulte. L’Encre des Damnés est réservé aux joueurs de 15 ans et plus, tandis que le Projet Vaïk 17 - le Laboratoire de l’Extinction est accessible à partir de 10 ans.',
        },
        {
            id: '5',
            title: 'Proposez-vous des options pour les groupes ou les événements spéciaux ?',
            description:
                'Oui, nous proposons des options spéciales pour les groupes, les anniversaires et les événements d’entreprise. Veuillez nous contacter directement pour discuter de vos besoins spécifiques et organiser une expérience personnalisée.',
        },
        {
            id: '6',
            title: 'Quels sont vos horaires d’ouverture ?',
            description:
                'En temps normal, nous sommes ouverts le lundi de 16h à 22h, le mercredi de 10h à 22h, le jeudi de 16h à 22h, le vendredi de 16h à 01h, le samedi de 10h à 01h et le dimanche de 11h à 20h.',
        },
        {
            id: '7',
            title: 'Que faire si je ne trouve pas de créneau qui me corresponde ?',
            description:
                'Nous sommes joignables par téléphone. Appelez-nous au 0672820892 et nous ferons de notre mieux pour vous accommoder en fonction de vos disponibilités.',
        },
        {
            id: '8',
            title: 'Quels sont les tarifs pour un escape game ?',
            description:
                'Pour La classe magique: Le mystère de Souchisse, le tarif est de 15€ par enfant et 5€ par accompagnant (2 accompagnants maximum). Pour L’Encre des Damnés et Projet Vaïk 17 - le Laboratoire de l’Extinction, les tarifs varient selon le nombre de participants (de 20€ à 28€ par personne). Les réservations se font au plus tard deux heures avant le début du créneau.',
        }
    ];
</script>

<section class="w-full bg-black px-8 py-16" id="infos-pratiques">
    <div class="flex flex-col items-center justify-center gap-4 mb-8">
        <h2 class="h2 bg-blue-400 px-4 py-2 text-white mb-8 shadow-lg shadow-blue-500/50 text-center font-extrabold">
            Infos pratiques
        </h2>
    </div>

    <!-- Three Column Info Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
        <!-- HORAIRES -->
        <div class="bg-surface-900 p-6 rounded-lg border border-surface-200">
            <h3 class="text-xl font-bold text-blue-400 mb-4">🕒 HORAIRES</h3>
            <div class="text-white space-y-2">
                <p><strong>Lundi :</strong> 16h - 22h</p>
                <p><strong>Mardi :</strong> fermé</p>
                <p><strong>Mercredi :</strong> 10h - 22h</p>
                <p><strong>Jeudi :</strong> 16h - 22h</p>
                <p><strong>Vendredi :</strong> 16h - 01h</p>
                <p><strong>Samedi :</strong> 10h - 01h</p>
                <p><strong>Dimanche :</strong> 11h - 20h</p>
            </div>
        </div>

        <!-- ADRESSE -->
        <div class="bg-surface-900 p-6 rounded-lg border border-surface-200">
            <h3 class="text-xl font-bold text-blue-400 mb-4">📍 ADRESSE</h3>
            <div class="text-white space-y-2">
                <p class="font-semibold">138 Grande Rue</p>
                <p>62990 Beaurainville</p>
                <p class="mt-4 text-sm text-surface-300">
                    Parking gratuit disponible à proximité
                </p>
            </div>
        </div>

        <!-- CONTACT -->
        <div class="bg-surface-900 p-6 rounded-lg border border-surface-200">
            <h3 class="text-xl font-bold text-blue-400 mb-4">📞 CONTACT</h3>
            <div class="text-white space-y-2">
                <p class="font-semibold">Téléphone</p>
                <p><a href="tel:0672820892" class="text-blue-400 hover:text-blue-300 transition">06.72.82.08.92</a></p>
                <p>Email</p>
                <a class="text-blue-400 hover:text-blue-300 transition"
                   href="mailto:zone404team@gmail.com">zone404team@gmail.com
                </a>
                <p class="mt-4 text-sm text-surface-300">
                    Nous sommes disponibles pour répondre à vos questions
                </p>
            </div>
        </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-center gap-8">
        <div class="overflow-hidden shadow-xl border border-surface-200">
            <Map address="138 Grande Rue, Beaurainville" zoom={12}/>
        </div>

        <div class="md:w-1/2">
            <Accordion>
                {#each items as item, i (item)}
                    {#if i !== 0}
                        <hr class="hr"/>
                    {/if}
                    <Accordion.Item value={item.id}>
                        <h3>
                            <Accordion.ItemTrigger class="font-bold flex items-center justify-between gap-2">
                                {item.title}
                                <Accordion.ItemIndicator class="group">
                                    <ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180"/>
                                </Accordion.ItemIndicator>
                            </Accordion.ItemTrigger>
                        </h3>
                        <Accordion.ItemContent>
                            {#snippet element(attributes)}
                                {#if !attributes.hidden}
                                    <div {...attributes} transition:slide={{ duration: 150 }}>
                                        {item.description}
                                    </div>
                                {/if}
                            {/snippet}
                        </Accordion.ItemContent>
                    </Accordion.Item>
                {/each}
            </Accordion>
        </div>

        <!--        <div class="px-6 py-3 text-lg font-semibold shadow-md shadow-blue-500 w-fit whitespace-nowrap-->
        <!--         border bg-white">-->
        <!--            <h3 class="text-xl font-semibold mb-3 text-black">🕒 Horaires d’ouverture</h3>-->
        <!--            <p class="text-blue-500">Du <strong>mercredi</strong> au <strong>dimanche</strong><br>-->
        <!--                <strong>9h – 12h30</strong> et <strong>14h – 00h</strong></p>-->
        <!--        </div>-->

    </div>
</section>
