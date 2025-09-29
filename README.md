# Aurium Agency — Site vitrine

Site vitrine statique créé pour présenter les prestations de création de sites web modernes d'Aurium Agency.

## Structure

- `index.html` : landing page principale avec hero, preuves de confiance, prestations, témoignages et CTA.
- `prestations.html`, `portfolio.html`, `tarifs.html`, `devis.html`, `a-propos.html`, `mentions-legales.html` : pages secondaires.
- `assets/css/style.css` : styles globaux (dark mode par défaut, glassmorphism, animations au scroll).
- `assets/js/main.js` : interactions (menu sticky, bascule de thème, compteurs animés, carrousel d'avis, filtre portfolio, formulaire de devis).
- `assets/data/site-config.json` : configuration centralisée (texte, services, tarifs...).
- `sitemap.xml`, `robots.txt` : fichiers SEO.

## Lancer le site en local

Utilisez n'importe quel serveur statique (ex. `python -m http.server`) depuis la racine du projet :

```bash
python -m http.server 8000
```

Ouvrez ensuite [http://localhost:8000](http://localhost:8000) dans votre navigateur.

## Formulaire de devis

Le formulaire `/devis.html` envoie les demandes via [FormSubmit](https://formsubmit.co/) vers `lucaspoullainpro@gmail.com`. Un honeypot, un délai minimal et une intégration reCAPTCHA optionnelle (configurable via `assets/data/site-config.json`) limitent le spam.

## Personnalisation

Modifiez `assets/data/site-config.json` pour ajuster :

- les prestations, processus, tarifs et maintenance ;
- les témoignages et le portfolio ;
- les options du formulaire (types de projets, budgets, délais) ;
- les informations de contact et le branding.

Les contenus du site se mettront à jour automatiquement au chargement.
