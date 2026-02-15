<script lang="ts">
  import {Tabs} from '@skeletonlabs/skeleton-svelte';
</script>

<section class="px-4 md:w-1/2 mx-auto mt-16 pb-16">

    <Tabs defaultValue="menu">
        <Tabs.List>
            <Tabs.Trigger class="flex-1" value="menu">Menu</Tabs.Trigger>
            <Tabs.Trigger class="flex-1" value="boissons">Boissons</Tabs.Trigger>
            <Tabs.Indicator/>
        </Tabs.List>
        <Tabs.Content value="menu">
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Snacking</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Plats</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Desserts</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>
        </Tabs.Content>
        <Tabs.Content value="boissons">
            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Cocktails</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Mocktails</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Softs</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Vins</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>

            <h2 class="h2 mb-4 border-b border-gray-200 pb-4">Softs</h2>
            <dl class="space-y-3 mb-8">
                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>

                <div class="flex justify-between gap-4 border-b border-dashed border-gray-300 pb-3">
                    <dt class="flex flex-col">
                    <span class="font-medium">
                      Pouet
                    </span>
                        <span class="text-sm leading-snug italic">
                      Description du plat avec beaucoup d'informations, comme les produits inclus dedans
                    </span>
                    </dt>

                    <dd class="font-semibold whitespace-nowrap">
                        12,00 €
                    </dd>
                </div>
            </dl>
        </Tabs.Content>
    </Tabs>

    <section class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <!-- Column -->
        <div class="grid gap-4">
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=1"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/120?random=2"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=3"/>
        </div>
        <!-- Column -->
        <div class="grid gap-4">
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/300?random=4"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=5"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=6"/>
        </div>
        <!-- Column -->
        <div class="grid gap-4">
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=7"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=8"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=9"/>
        </div>
        <!-- Column -->
        <div class="grid gap-4">
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/320?random=10"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/140?random=11"/>
            <img alt="" class="bg-surface-500 rounded-container" src="https://picsum.photos/220/280?random=12"/>
        </div>
    </section>
</section>


