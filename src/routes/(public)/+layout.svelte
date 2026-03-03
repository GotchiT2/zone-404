<script lang="ts">
  import '../layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from "$lib/components/Header.svelte";
  import HeaderMobile from "$lib/components/HeaderMobile.svelte";

  import Footer from "$lib/components/Footer.svelte";

  let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>


    <!-- SEO Meta Tags -->
    <title>Zone 404 - Escape Game & Bar à Jeux à Beaurainville (62)</title>
    <meta name="description" content="Zone 404 : Escape Game et bar à jeux à Beaurainville. Vivez des aventures immersives avec La Classe Magique, L'Encre des Damnés et plus encore. Réservez votre session dès maintenant !"/>
    <meta name="keywords" content="escape game, bar à jeux, Beaurainville, Pas-de-Calais, escape kids, La Classe Magique, L'Encre des Damnés, Projet Vaïk 17, jeux de société, activité familiale, team building, anniversaire, loisirs"/>
    <meta name="author" content="Zone 404"/>
    <meta name="robots" content="index, follow"/>
    <link rel="canonical" href="https://zone404.fr"/>

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://zone404.fr"/>
    <meta property="og:title" content="Zone 404 - Escape Game & Bar à Jeux à Beaurainville"/>
    <meta property="og:description" content="Vivez des aventures immersives dans nos escape games : La Classe Magique (dès 4 ans), L'Encre des Damnés (thriller), et bien plus. Bar à jeux convivial avec jeux de société, fléchettes et baby-foot."/>
    <meta property="og:image" content="https://zone404.fr/zone-404-logo.svg"/>
    <meta property="og:locale" content="fr_FR"/>
    <meta property="og:site_name" content="Zone 404"/>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:url" content="https://zone404.fr"/>
    <meta name="twitter:title" content="Zone 404 - Escape Game & Bar à Jeux à Beaurainville"/>
    <meta name="twitter:description" content="Escape games immersifs et bar à jeux à Beaurainville. Réservez votre aventure !"/>
    <meta name="twitter:image" content="https://zone404.fr/zone-404-logo.svg"/>

    <!-- Geo Tags -->
    <meta name="geo.region" content="FR-62"/>
    <meta name="geo.placename" content="Beaurainville"/>
    <meta name="geo.position" content="50.4167;1.9000"/>
    <meta name="ICBM" content="50.4167, 1.9000"/>

    <!-- Schema.org Structured Data -->
    {@html '<script type="application/ld+json">' + JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://zone404.fr",
        "name": "Zone 404",
        "description": "Escape Game et bar à jeux proposant des aventures immersives et des jeux de société à Beaurainville",
        "url": "https://zone404.fr",
        "telephone": "0672820892",
        "email": "zone404team@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "138 Grande Rue",
            "addressLocality": "Beaurainville",
            "postalCode": "62990",
            "addressCountry": "FR",
            "addressRegion": "Hauts-de-France"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "50.4167",
            "longitude": "1.9000"
        },
        "priceRange": "€€",
        "image": "https://zone404.fr/zone-404-logo.svg",
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "50.4167",
                "longitude": "1.9000"
            },
            "geoRadius": "50000"
        },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services Zone 404",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Escape Kids - À la recherche du trésor de la jungle",
              "description": "Escape game jungle ludique et immersif pour enfants de 4 à 8 ans. Une aventure idéale pour une première expérience d'escape game.",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Zone 404"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Le Tatoueur Maudit",
              "description": "Escape game thriller pour 2 à 6 joueurs à partir de 16 ans. Enquête dans un cabinet de tatoueur inquiétant avec série de meurtres.",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Zone 404"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Le Laboratoire de l'Extinction",
              "description": "Escape game futuriste pour toute la famille à partir de 10 ans. Explorez un laboratoire abandonné et reconstituez l'antidote du virus.",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Zone 404"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Escape Game Nature",
              "description": "Escape game en plein air à travers Beaurainville et les 7 Vallées. Aventure en famille ou entre amis.",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Zone 404"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bar à Jeux",
              "description": "Bar convivial avec jeux de société originaux, fléchettes, baby-foot et jeux de comptoir. Boissons et petite restauration.",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Zone 404"
              }
            }
          }
        ]
      }
    }) + '</script>'}
</svelte:head>

<div class="w-full h-full fixed grid grid-cols-[auto_1fr] overflow scroll-smooth">

    <div class="hidden lg:block">
        <Header/>
    </div>

    <div class="fixed w-full flex justify-center bottom-0 left-0 lg:hidden z-20">
        <HeaderMobile/>
    </div>

    <div class="w-auto h-full overflow-x-hidden overflow-scroll flex flex-col items-center">
        {@render children()}

        <Footer/>
    </div>

</div>