// actions.js
export const setCategoryTitle = (categoryId, categoryTitle) => ({
    type: 'SET_CATEGORY_TITLE',
    payload: { categoryId, categoryTitle },
});
export const setSelectedSubcategory = (subcategory) => ({
    type: 'SET_SELECTED_SUBCATEGORY',
    payload: subcategory,
});
export const clearSelectedSubcategory = () => ({
    type: 'CLEAR_SELECTED_SUBCATEGORY',
});
export const setSelectedCategory = (categoryId) => ({
    type: 'SET_SELECTED_CATEGORY_ID',  // Используйте правильное имя
    payload: categoryId,
});

export const setActiveCategory = (categoryId) => ({
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryId,
});

const initialState = {
    categories: {},
    selectedCategoryId: null,

    activeCategory:0,
    activeCategoryFilter: null,
    selectedSubcategory: null,
    categoryData: null,
};
const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'SET_SELECTED_CATEGORY_ID':
            return {
                ...state,
                selectedCategoryId: action.payload,
            };
        case 'CLEAR_SELECTED_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: null,
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload,
            };
        case 'SET_SELECTED_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: action.payload,
            };

        case 'SET_CATEGORY_DATA':
            return {
                ...state,
                categoryData: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY_FILTER':
            return {
                ...state,
                activeCategoryFilter: action.payload,
            };
        case 'SET_CATEGORY_TITLE':
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [action.payload.categoryId]: action.payload.categoryTitle,
                },
            };
        default:
            return state;

    }
};

export default rootReducer;