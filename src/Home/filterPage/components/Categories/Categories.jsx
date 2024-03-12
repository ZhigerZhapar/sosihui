import React, { useEffect, useRef, useState } from 'react';
import cl from '../SelectBlock/SelectBlock.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import axios from 'axios';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import { useDispatch } from "react-redux";
import { setActiveCategory } from "../../../../actions.js";
import Places from "../Places/Places.jsx";
import MyLine from "../UI/MyLine/MyLine.jsx";
import MyBigButton from "../UI/MyBigButton/MyBigButton.jsx";
import sun from "../../imgs/Header/sun.svg";
import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import SelectBlock from "../SelectBlock/SelectBlock.jsx";

const Categories = ({ activeCategory, onCategoryClick, handleFilterPageClose }) => {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Добавьте стейт для подкатегорий

    const [selectedButton, setSelectedButton] = useState(null);
    const [categoryTitles, setCategoryTitles] = useState({});
    const pathParts = location.pathname.split('/');
    const encodedCategory = pathParts[pathParts.length - 1];
    const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;
    const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
    const [data, setData] = useState({});
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
            'https://places-test-api.danya.tech/api/categories?populate=image,posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory'
        );
        setData(response.data || {});
        return response;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(activeCategory);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, [buttonRef]);

    useEffect(() => {
        fetching();
    }, []);

    const dispatch = useDispatch();

    useEffect(() => {
        if (data.data && activeCategory) {
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === activeCategory
            );

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);
                if (onCategoryClick) {
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: data?.data?.[defaultActiveCategoryIndex]?.id,
                    });
                }
            }
        }
    }, [data.data, activeCategory, onCategoryClick]);

    const [filterClosed, setFilterClosed] = useState(false);

    const handleCloseFilter = () => {
        setFilterClosed(true);
    };
    const handleResetSelection = () => {
        setSelectedButton(null);
        setActiveCategoryId(null);
        setSelectedSubcategory(null); // Сброс подкатегорий
        dispatch(setActiveCategory(null));
    };



    const handleButtonClick = (index, categoryId) => {
        dispatch(setActiveCategory(categoryId));
        setSelectedButton(null);
        setActiveCategoryId(null);
        setSelectedSubcategory(null); // Сброс подкатегорий

        dispatch(setActiveCategory(null));
        if (selectedButton !== index) {
            setSelectedButton(index);
        }


        const clickedCategoryId = data?.data?.[index]?.id;
        setActiveCategoryId(clickedCategoryId);
        clearLocalStorage();

        if (onCategoryClick) {
            onCategoryClick({
                category: data?.data?.[index],
                categoryId: clickedCategoryId,
            });
        }

    };

    useEffect(() => {
        if (data.data && activeCategory) {
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === activeCategory
            );

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);

                // Check if the active category has changed
                if (activeCategory !== selectedCategory) {
                    setSelectedSubcategory(null); // Reset subcategory when changing categories
                }

                if (onCategoryClick) {
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: data?.data?.[defaultActiveCategoryIndex]?.id,
                    });
                }
            }
        }

        setSelectedButton(null);
    }, [data.data, activeCategory, onCategoryClick, selectedCategory]);

    useEffect(() => {
        setSelectedButton(null);
    }, [activeCategory]);

    const clearLocalStorage = () => {
        localStorage.removeItem('selectedCategoryId');
        localStorage.removeItem('selectedSubcategory');
    };

    useEffect(() => {
        setSelectedButton(null);
    }, [activeCategory]);

    const [sup,setSup] = useState(false);
    // ...

    // ...

    return (
        <div>
            {loading && (
                <div className={cl.loadingSpinner}>
                    <img className={cl.loader} src={sun} alt="Loading" />
                </div>
            )}
            <div className={cl.button__select}>
                <div className={cl.button__select__row}>
                    {data?.data?.map((button, index) => (
                        <MySelectedButton
                            key={index}
                            isRed={selectedButton === index}
                            onClick={() => {
                                handleButtonClick(index);
                            }}
                            ref={index === 0 ? buttonRef : null}
                        >
                            <img
                                className={cl.button__image}
                                src={`https://places-test-api.danya.tech${button?.attributes?.image?.data?.attributes?.url}`}
                                alt={`Изображение ${index}`}
                            />
                            {button?.attributes?.title}
                        </MySelectedButton>
                    ))}
                </div>
            </div>
            <MyLine />
            {selectedButton !== null && (
                <>
                    <Places activeCategory={activeCategoryId} selectedSubcategory={selectedSubcategory} />
                    <MyLine />
                </>
            )}
            {isDataLoading ? (
                <div style={{ height: '40px' }} className={cl.loadingSpinner}>
                    <img style={{ width: 20 }} className={cl.loader} src={sun} alt="Loading" />
                </div>
            ) : (
                <div className={cl.cont}>
                    <MyBigButton
                        onSelectCategory={handleCategorySelect}
                        handleFilterPageClose={handleFilterPageClose}
                        categoryId={activeCategoryId}
                        onCloseFilter={handleCloseFilter}
                    >
                        Показать результаты
                    </MyBigButton>
                </div>
            )}
        </div>
    );

};

export default Categories;
