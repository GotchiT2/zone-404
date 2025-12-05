<script lang="ts">
	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, MegaMenu, Indicator, Button, Modal, P } from 'flowbite-svelte';
	import { ChevronDownOutline, ArrowRightOutline, CartSolid } from 'flowbite-svelte-icons';
	let menu = [
		{ name: "About us", href: "/about" },
		{ name: "Blog", href: "/blog" },
		{ name: "Contact us", href: "/contact" },
		{ name: "Library", href: "/library" },
		{ name: "Newsletter", href: "/news" },
		{ name: "Support Center", href: "/support" },
		{ name: "Resources", href: "/resource" },
		{ name: "Playground", href: "/play" },
		{ name: "Terms", href: "/tersm" },
		{ name: "Pro Version", href: "/pro" },
		{ name: "License", href: "/license" }
	];

	let defaultModal = $state(false);

</script>

<Navbar>
	<NavBrand href="/">
		<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi class="cursor-pointer">
			Company<ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
		</NavLi>
		<MegaMenu full items={menu}>
			{#snippet children({ item })}
				<a href={item.href} class="hover:text-primary-600 dark:hover:text-primary-500 hover:underline">
					{item.name}
				</a>
			{/snippet}
			{#snippet extra()}
				<h2 class="mt-4 mb-2 font-semibold text-gray-900 dark:text-white">Our brands</h2>
				<p class="mb-2 p-0 text-sm font-light text-gray-500 dark:text-gray-300">At Flowbite, we have a portfolio of brands that cater to a variety of preferences.</p>
				<a href="/" class="text-primary-600 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-700 inline-flex items-center text-sm font-medium hover:underline">
					Explore our brands
					<span class="sr-only">Explore our brands</span>
					<ArrowRightOutline class="text-primary-600 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-700  ms-2 h-6 w-6" />
				</a>
			{/snippet}
		</MegaMenu>
		<NavLi href="/services">Marketplace</NavLi>
		<NavLi href="/services">Resources</NavLi>

			<Button class="relative" size="sm" onclick={() => (defaultModal = true)}>
				<CartSolid class="text-white dark:text-white" />
				<span class="sr-only">Notifications</span>
				<Indicator color="blue" border size="xl" placement="top-right" class="text-xs font-bold">18</Indicator>
			</Button>

	</NavUl>
</Navbar>

<Modal title="Votre panier" form bind:open={defaultModal} onaction={({ action }) => alert(`Handle "${action}"`)}>
	<P>Merci d'indiquer, pour chaque créneau réservé, le nombre de participants.</P>
	<P size="sm" class="italic">
		Le nombre de participants ne peut pas excéder la capacité maximale de la salle (6 personnes). Le prix est dégressif en fonction du nombre de participants. Si le nombre de participants change après réservation, merci de nous contacter par téléphone.
	</P>

	{#snippet footer()}
		<Button type="submit" value="success">I accept</Button>
		<Button type="submit" value="decline" color="alternative">Decline</Button>
	{/snippet}
</Modal>