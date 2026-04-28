<script lang="ts">
  import {Tabs} from '@skeletonlabs/skeleton-svelte';
</script>

<section class="px-4 md:w-1/2 mx-auto mt-16 pb-16">

    <Tabs defaultValue="boissons">
        <Tabs.List>
            <Tabs.Trigger class="flex-1" value="boissons">Boissons</Tabs.Trigger>
            <Tabs.Trigger class="flex-1" value="menu">Menu</Tabs.Trigger>
            <Tabs.Indicator/>
        </Tabs.List>
        
        <Tabs.Content value="boissons">
            <!-- Bières pression -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Bières pression</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Blonde Estaminet 5,2%</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">
                        25cl 2,80 € | 33cl 3,50 € | 50cl 5,40 €
                    </dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">La Cornet 8,8%</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">
                        25cl 4,00 € | 33cl 5,70 € | 50cl 7,80 €
                    </dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Picon bière</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">
                        25cl 3,80 € | 33cl 4,50 € | 50cl 6,40 €
                    </dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Monaco</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">
                        25cl 3,30 € | 33cl 3,70 € | 50cl 5,60 €
                    </dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Panaché</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">
                        25cl 2,80 € | 33cl 3,50 € | 50cl 5,40 €
                    </dd>
                </div>
            </dl>

            <!-- Bières bouteille -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Bières bouteille</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Leffe 9% (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">4,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Chouffe (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">5,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Paix Dieu (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">6,00 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Quentovic IPA (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">5,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Hoegaarden (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">5,00 €</dd>
                </div>
            </dl>

            <!-- Cidre -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Cidre</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Kerisac brut (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,90 €</dd>
                </div>
            </dl>

            <!-- Eau -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Eau</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Vittel (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">2,80 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Sirop à l'eau (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">2,00 €</dd>
                </div>
            </dl>

            <!-- Sodas & jus -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Sodas & jus</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Perrier (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Schweppes agrumes (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Orangina (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Minute Maid (orange, pomme, abricot) (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Jus d'orange pressé (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">4,00 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Coca-Cola (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Coca Zéro (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Coca Cherry (33cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Diabolo (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">2,80 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Fuzetea (25cl)</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
            </dl>

            <!-- Boissons chaudes -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Boissons chaudes</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Expresso</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">1,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Double expresso</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">2,80 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Allongé</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">1,70 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Chocolat ou cappuccino</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">3,20 €</dd>
                </div>
            </dl>
        </Tabs.Content>

        <Tabs.Content value="menu">
            <!-- Goûter -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Goûter</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Formule goûter</span>
                        <span class="text-sm leading-snug italic">
                            1 gâteau + 1 soft
                        </span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">5,00 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Supplément crème anglaise ou chantilly</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">+0,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Part de gâteau</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">2,00 €</dd>
                </div>
            </dl>
            <p class="text-sm italic mb-8">
                Softs au choix : Coca-Cola, Fuzetea, Orangina, Schweppes agrumes, Perrier, Diabolo, Minute Maid, sirop à l'eau
            </p>

            <!-- Nos croques -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Nos croques</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Classique</span>
                        <span class="text-sm leading-snug italic">
                            emmental, jambon, crème
                        </span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">6,00 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Végé</span>
                        <span class="text-sm leading-snug italic">
                            chèvre, miel, tomate, basilic
                        </span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">6,50 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">Steak</span>
                        <span class="text-sm leading-snug italic">
                            bœuf haché, cheddar, sauce burger
                        </span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">7,00 €</dd>
                </div>
            </dl>
            <p class="text-sm italic mb-8">Accompagnement : salade</p>

            <!-- Planches à partager -->
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Planches à partager</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">1 personne</span>
                        <span class="text-sm leading-snug italic">
                            3 charcuteries, 2 fromages, légumes à croquer, pain, condiments
                        </span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">9,90 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">2 personnes</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">17,90 €</dd>
                </div>
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                        <span class="font-medium">4 personnes</span>
                    </dt>
                    <dd class="font-semibold whitespace-nowrap">32,90 €</dd>
                </div>
            </dl>

            <!-- Infos -->
            <div class="p-4 rounded-container border border-white">
                <h3 class="h3 mb-2">Infos</h3>
                <ul class="text-sm space-y-1 list-disc list-inside">
                    <li>Vente d'alcool uniquement avec un snack</li>
                    <li>Jeux de société mis à disposition sous consommation</li>
                    <li>Sous réserve de la quantité disponible</li>
                    <li>Merci de commander au bar</li>
                </ul>
            </div>
        </Tabs.Content>
    </Tabs>

<!--    <section class="grid grid-cols-2 gap-4 md:grid-cols-4 mt-16">-->
<!--        &lt;!&ndash; Column &ndash;&gt;-->
<!--        <div class="grid gap-4">-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=1"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/120?random=2"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=3"/>-->
<!--        </div>-->
<!--        &lt;!&ndash; Column &ndash;&gt;-->
<!--        <div class="grid gap-4">-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/300?random=4"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=5"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=6"/>-->
<!--        </div>-->
<!--        &lt;!&ndash; Column &ndash;&gt;-->
<!--        <div class="grid gap-4">-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=7"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=8"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=9"/>-->
<!--        </div>-->
<!--        &lt;!&ndash; Column &ndash;&gt;-->
<!--        <div class="grid gap-4">-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=10"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=11"/>-->
<!--            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=12"/>-->
<!--        </div>-->
<!--    </section>-->
</section>