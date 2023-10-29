export const MOST_POPULAR_SUBCATEGORY_IDS = [
    8, // 'web-development'
    132, // 'it-certification'
    44, // 'data-and-analytics'
    14, // 'game-development'
    10, // 'mobile-apps'
    24, // 'finance'
    110, // 'graphic-design'
    142, // 'personal-transformation'
    26, // 'entrepreneurship'
    62, // 'digital-marketing'
];

export function parsePopularTopics() {
    // Map containing subcategoryId -> [topic...]
    const subcatTopics = {};
    // div containing <a href>s for each topic
    const subcategoryContainer = document.querySelectorAll('.js-side-nav-popular-topics');
    for (const subcatNode of subcategoryContainer) {
        const subcatId = parseInt(subcatNode.dataset.id, 10);
        subcatTopics[subcatId] = [];
        for (const topicNode of subcatNode.children) {
            subcatTopics[subcatId].push({
                id: parseInt(topicNode.dataset.id, 10),
                absolute_url: topicNode.getAttribute('href'),
                title: topicNode.textContent,
            });
        }
    }
    return subcatTopics;
}

// Parsed from udemy/templates/_header_v6/_browse/_seo_links.html !
export default function parseNavigationCategories() {
    const mostPopularSubcategoriesMap = {};
    MOST_POPULAR_SUBCATEGORY_IDS.forEach((id) => {
        mostPopularSubcategoriesMap[id] = null;
    });
    const popularTopics = parsePopularTopics();

    const navigationCategories = [];
    const catNodes = document.querySelectorAll('.js-side-nav-cat');
    let currentCat = null;
    for (const catNode of catNodes) {
        const cat = {
            id: parseInt(catNode.dataset.id, 10),
            absolute_url: catNode.getAttribute('href'),
            title: catNode.textContent,
            children: null,
        };
        if (catNode.classList.contains('js-subcat')) {
            currentCat.children.push(cat);
            if (cat.id in mostPopularSubcategoriesMap) {
                cat.parentId = parseInt(currentCat.id, 10);
                cat.popularTopics = popularTopics[cat.id] || [];
                mostPopularSubcategoriesMap[cat.id] = cat;
            }
        } else {
            cat.children = [];
            currentCat = cat;
            navigationCategories.push(cat);
        }
    }
    return {
        navigationCategories,
        mostPopularSubcategories: Object.values(mostPopularSubcategoriesMap).filter(Boolean),
    };
}
