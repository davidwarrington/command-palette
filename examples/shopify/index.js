import './command-palette.js';

const palette = document.querySelector('command-palette');

const fetchJson = (...args) => fetch(...args)
    .then(response => response.json());

/**
 * @param {string|string[]} path
 * @param {object} query
*/
const goTo = (path, query = {}) => {
    const newPath = Array.isArray(path)
        ? path.join('/')
        : path;
    const url = new URL(newPath);

    Object.entries(query).forEach(
        ([key, value]) =>
            url.searchParams.set(key, value),
    );

    window.location.href = url;
}

const getProducts = async (limit = 50) => {
    const { products } = await fetchJson(`/products.json?limit=${limit}`);

    return products;
}

const addToCart = async items => {
    const cart = await fetchJson(`/cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
    });

    return cart;
}

const commands = [
    {
        name: 'Cart: Clear',
        handler() {
            fetch('/cart/clear.js');
        },
    },
    {
        name: 'Cart: Add product',
        async handler() {
            const products = await getProducts(250);

            const chosenProduct = await palette.awaitCommand({
                placeholder: 'Choose a product',
                commands: products
                    .filter(product => product.variants.some(variant => variant.available))
                    .map(product => ({
                        name: product.title,
                        handler() {
                            return product;
                        },
                    })),
            });

            const firstAvailableVariant = chosenProduct.variants.find(variant => variant.available);

            const quantity = await palette.awaitInput({
                placeholder: 'How many would you like to add?',
            });

            const item = {
                id: firstAvailableVariant.id,
                quantity,
            };

            addToCart([item]);
        },
    },
    {
        name: 'Cart: Bulk add products',
        async handler() {
            const products = await getProducts(250);

            const firstAvailableProducts = products
                .filter(product => product.variants.some(variant => variant.available))
                .slice(0, 10);

            const firstAvailableVariants = firstAvailableProducts
                .map(product => product.variants.find(variant => variant.available));

            const items = firstAvailableVariants.map(variant => ({
                id: variant.id,
                quantity: 1,
            }));

            addToCart(items);
        },
    },
    {
        name: 'Store: Search',
        async handler() {
            const baseSearchUrl = `${window.location.origin}/search`;
            const query = await palette.awaitInput({
                placeholder: 'What are you searching for?',
            });

            goTo(baseSearchUrl, { q: query });
        },
    },
    {
        name: 'Utils: Copy preview URL for current page',
        async handler() {
            const url = new URL(window.location.href);
            url.searchParams.set('preview_theme_id', window.Shopify.theme.id);
            window.navigator.clipboard.writeText(url.toString());
        },
    },
    {
        name: 'Admin: Open current page (defaults to /admin/themes)',
        async handler() {
            const [, resourceType, , secondaryResourceType] = window.location.pathname.split('/');
            const baseAdminURL = `https://${window.Shopify.shop}/admin`;
            const resource = secondaryResourceType || resourceType;

            const goToAdminThemes = () => goTo([baseAdminURL, 'themes']);

            try {
                const response = await fetchJson(`${window.location.href}.json`);

                const responseKey = {
                    collections: 'collection',
                    pages: 'page',
                    products: 'product',
                }[resource];

                const { id } = response[responseKey];

                if (id) {
                    goTo([baseAdminURL, resource, id]);
                } else {
                    goToAdminThemes();
                }
            } catch {
                goToAdminThemes();
            }
        },
    },
    {
        name: 'Docs: Search Shopify Docs',
        async handler() {
            const baseDocsUrl = `https://shopify.dev`
            const query = await palette.awaitInput({
                placeholder: 'What are you searching for?',
            });

            goTo([baseDocsUrl, 'search'], { query });
        },
    },
];

palette.commands = commands;
