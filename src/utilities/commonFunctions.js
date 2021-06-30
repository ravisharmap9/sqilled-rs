export function validateEmail(email) {
    const re = new RegExp(['^(([^<>()\\[\\]\\,;:\\s@"]+(\\.[^<>()\\[\\]\\,;:\\s@"]+)*)',
        '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])',
        '|(([a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:\\-0-9]+\\.)',
        '+[a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:]{2,}))$'
    ].join(''));

    return re.test(email);
}


/**Validate name, should not have any space in sting */
export const validateNames = (val) => {
    if (val && /^\S*$/i.test(val)) {
        return true;
    }
    return false
}

export function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function parseGraphQLErrorMessage(error) {
    let errorMessage;
    errorMessage = error.toString().replace('Error: GraphQL error: ', '');
    errorMessage = errorMessage.toString().replace('400 - ', '');
    errorMessage = errorMessage.toString().replace('401 - ', '');

    if (IsJsonString(errorMessage)) {
        const errorObj = JSON.parse(errorMessage);
        errorMessage = errorObj.error.message;
    }

    if (errorMessage.toLowerCase().indexOf('network error') !== -1) {
        errorMessage = 'An error occurred please try again later.';
    }

    return errorMessage;
}

export function parseTypeErrorMessage(error) {
    let errorMessage;
    errorMessage = error.toString().replace('TypeError: ', '');

    if (IsJsonString(errorMessage)) {
        const errorObj = JSON.parse(errorMessage);
        errorMessage = errorObj.error.message;
    }

    if (errorMessage.toLowerCase().indexOf('network error') !== -1) {
        errorMessage = 'An error occurred please try again later.';
    }

    return errorMessage;
}

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const replaceAll = (str, term, replacement) => str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);

export const formatSearchQuery = (searchQuery) => {
    const searchQueryValue = searchQuery;
    return searchQueryValue;
};

export const deFormatSearchQuery = (searchQuery) => {
    let searchQueryValue = searchQuery;
    if (searchQueryValue) {
        searchQueryValue = replaceAll(searchQueryValue, 'Title:(', 'title:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Author:(', 'author:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Keywords:(', 'keywords:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Abstract:(', 'abstract:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Evaluation design:(', 'evaluation_design:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Evaluation method:(', 'evaluation_method:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Publication type:(', 'publication_type:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Product:(', 'product:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Sector:(', 'sector:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Region:(', 'region:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Funding by:(', 'funding_by:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Country:(', 'country:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Primary theme:(', 'primary_theme:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Equity focus:(', 'equity_focus:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Equity dimension:(', 'equity_dimension:(');
        searchQueryValue = replaceAll(searchQueryValue, 'Year of publication:(', 'year_of_publication:(');
    }
    return searchQueryValue;
};

export const buildOptionalFiltersQuery = (optionalFilters) => {
    let query = '';

    for (let i = 0, len = optionalFilters.length; i < len; i += 1) {
        let valueString = '';
        if (optionalFilters[i].type === 'Author' || optionalFilters[i].type === 'Keywords') {
            if (optionalFilters[i].value && typeof(optionalFilters[i].value) === 'string') {
                valueString = optionalFilters[i].value;
            } else {
                valueString = optionalFilters[i].value && optionalFilters[i].value.join(';');
                valueString = valueString && valueString.replace(/;/g, '";"');
            }
        } else {
            valueString = optionalFilters[i].value;
        }

        if (optionalFilters[i].type === 'Title' || optionalFilters[i].type === 'Abstract') {
            query += `${optionalFilters[i].logicOperator} ${optionalFilters[i].type}:(${valueString}) `;
        } else {
            query += `${optionalFilters[i].logicOperator} ${optionalFilters[i].type}:("${valueString}") `;
        }
    }

    return query;
};

export const buildAdvancedSearchQuery = (updatedFilter, allValues) => {
    let valueString = '';
    if ('optionalFilters' in allValues) {
        const { initialFilter: { type, value }, optionalFilters } = allValues;

        const filteredOptionalFilters = optionalFilters.filter((filter) => filter && 'logicOperator' in filter && 'type' in filter && 'value' in filter);

        let optionalFiltersQuery = buildOptionalFiltersQuery(filteredOptionalFilters).trim();

        optionalFiltersQuery = deFormatSearchQuery(optionalFiltersQuery);

        if (optionalFiltersQuery) {
            let query = '';

            if (type === 'Title' || type === 'Abstract') {
                if (type && value) {
                    query = `${type}:(${value}) ${optionalFiltersQuery}`;
                } else {
                    query = `${optionalFiltersQuery}`;
                }
                query = deFormatSearchQuery(query);
                return query;
            }

            if (type && value) {
                if (type === 'Author' || type === 'Keywords') {
                    if (value && typeof(value) === 'string') {
                        valueString = value;
                    } else {
                        valueString = value && value.join(';');
                        valueString = valueString && valueString.replace(/;/g, '";"');
                    }
                } else {
                    valueString = value;
                }
                if (type === 'Title' || type === 'Abstract') {
                    query = `${type}:(${valueString}) ${optionalFiltersQuery}`;
                } else {
                    query = `${type}:("${valueString}") ${optionalFiltersQuery}`;
                }
            } else {
                query = `${optionalFiltersQuery}`;
            }
            query = deFormatSearchQuery(query);
            return query;
        }

        if (type === 'Author' || type === 'Keywords') {
            if (value && typeof(value) === 'string') {
                valueString = value;
            } else {
                valueString = value && value.join(';');
                valueString = valueString && valueString.replace(/;/g, '";"');
            }
        } else {
            valueString = value;
        }

        let initialValues = '';
        if (type === 'Title' || type === 'Abstract') {
            initialValues = type && value ? `${type}:(${valueString})` : '';
        } else {
            initialValues = type && value ? `${type}:("${valueString}")` : '';
        }
        initialValues = deFormatSearchQuery(initialValues);
        return initialValues;
    }

    const { initialFilter: { type, value } } = allValues;

    if (type === 'Author' || type === 'Keywords') {
        if (value && typeof(value) === 'string') {
            valueString = value;
        } else {
            valueString = value && value.join(';');
            valueString = valueString && valueString.replace(/;/g, '";"');
        }
    } else {
        valueString = value;
    }

    let initialValues = '';

    if (type === 'Title' || type === 'Abstract') {
        initialValues = type && value ? `${type}:(${valueString})` : '';
    } else {
        initialValues = type && value ? `${type}:("${valueString}")` : '';
    }

    initialValues = deFormatSearchQuery(initialValues);

    return initialValues;
};

export const isKeywordSearch = (keywordSettings) => keywordSettings.searchSettings.keyword.length > 0;

export const buildFiltersObject = (allValues) => {
    const { initialFilter, optionalFilters } = allValues;
    let columnType = '';
    let columnValue = '';
    const andValues = [];
    const orValues = [];

    if (initialFilter && optionalFilters && optionalFilters[0] !== null) {
        const { type, value } = initialFilter;
        columnType = type;
        columnValue = value;
        for (let i = 0, len = optionalFilters.length; i < len; i += 1) {
            const currentItem = optionalFilters[i];
            if (currentItem.logicOperator === 'AND') {
                andValues.push({ column: currentItem.type, value: currentItem.value });
            }
            if (currentItem.logicOperator === 'OR') {
                orValues.push({ column: currentItem.type, value: currentItem.value });
            }
        }
    } else {
        const { type, value } = initialFilter;
        columnType = type;
        columnValue = value;
    }

    const filters = {
        column: columnType,
        value: columnValue,
        AND: andValues,
        OR: orValues,
    };

    return filters;
};

export const buildFiltersObjectWithQuery = (userQuery) => {
    const splitQueryValues = userQuery.split(/(?!\(.*)\s?(OR|AND)\s?(?![^(]*?\))/g);

    let columnType = '';
    let columnValue = '';
    const andValues = [];
    const orValues = [];
    for (let i = 0, len = splitQueryValues.length; i < len; i += 1) {
        const firstItem = splitQueryValues[0];
        const currentItem = splitQueryValues[i];
        const nextItem = splitQueryValues[i + 1];
        if (firstItem !== 'AND' && firstItem !== 'OR') {
            const splitByColon = firstItem.split(':');
            const [type, value] = splitByColon;
            columnType = type;
            if (type === 'Author Name') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(';');
            } else if (type === 'Keywords') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(',');
            } else {
                columnValue = value && value.replace(/[{()}]/g, '');
            }
        }
        if (currentItem === 'AND') {
            const splitByColon = nextItem.split(':');
            const [type, value] = splitByColon;
            columnType = type;
            if (type === 'Author Name') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(';');
            } else if (type === 'Keywords') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(',');
            } else {
                columnValue = value && value.replace(/[{()}]/g, '');
            }
            andValues.push({ column: columnType, value: columnValue });
        }
        if (currentItem === 'OR') {
            const splitByColon = nextItem.split(':');
            const [type, value] = splitByColon;
            columnType = type;
            if (type === 'Author Name') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(';');
            } else if (type === 'Keywords') {
                const newValue = value && value.replace(/[{()}]/g, '');
                columnValue = newValue && newValue.split(',');
            } else {
                columnValue = value && value.replace(/[{()}]/g, '');
            }
            orValues.push({ column: columnType, value: columnValue });
        }
    }
    const filters = {
        column: columnType,
        value: columnValue,
        AND: andValues,
        OR: orValues,
    };

    return filters;
};

export const randomKey = () => Math.random().toString(36).slice(-5);

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
    });
};

export const renderConfidenceMessage = () => 'We use an adapted version of the Supporting the Use of Research Evidence (SURE) Collaboration checklist to determine the level of confidence that should be placed in a systematic review of effects. We rate systematic reviews either as high, medium or low confidence. The checklist we use to assess reviews can be found';

export const renderLowConfidenceMessage = (studyStatus, reviewType) => {
    if (studyStatus && studyStatus === 'Protocol') {
        return 'We have not conducted confidence appraisals for systematic review protocols.';
    }
    if (studyStatus && studyStatus === 'Title') {
        return 'We have not conducted confidence appraisals for systematic review titles.';
    }
    if (reviewType && reviewType === 'Other') {
        return 'We have not conducted confidence appraisals for non-effectiveness reviews.';
    }
    return 'We have not yet completed a critical appraisal of this review, but please check back later.';
};

export const filterArray = (testArray) => {
    let index = -1;
    const arrayLength = testArray ? testArray.length : 0;
    let resIndex = -1;
    const result = [];

    while (index < arrayLength) {
        const value = testArray[index];

        if (value) {
            resIndex += 1;
            result[resIndex] = value;
        }

        index += 1;
    }
    return result;
};

export const getSearchParams = (keywordSearch, advancedSearch, KEYWORD_SEARCH_QUERY, ADVANCED_SEARCH_QUERY) => {
    let settings;
    let searchInput;
    let searchQuery;
    let searchVars;
    let searchData;
    let mainSearchQuery;
    let searchObject = localStorage.getItem('searchObj');
    let searchText = '';
    let searchQueryValue = '';
    let searchSortBy = '';
    let searchPage = 0;
    let searchPerPage = 50;
    let searchFilters = '';
    let searchType = '';
    let filterOptions = '';
    let filterOptionsExist = false;
    let tags = [];

    const path = window.location.href;
    const params = path.split('?');

    if (searchObject) {
        searchObject = JSON.parse(searchObject);
    } else {
        searchObject = { userQuery: '', initialFilter: {}, optionalFilters: {} };
    }

    if (params[1]) {
        const newParams = params[1].split('&');

        if (newParams[0].includes('search_text')) {
            searchText = newParams[0].replace('search_text=', '');
            searchText = atob(searchText);
            searchType = 'keyword';
        } else {
            searchQueryValue = newParams[0].replace('search_query=', '');
            searchQueryValue = JSON.parse(decodeURIComponent(escape(atob(searchQueryValue))));
            mainSearchQuery = searchQueryValue.userQuery;
            mainSearchQuery = deFormatSearchQuery(mainSearchQuery);
            searchQueryValue = searchQueryValue.userQuery;
            searchType = 'advanced';
        }

        searchPage = newParams[1].replace('page=', '');
        searchPerPage = newParams[2].replace('per_page=', '');
        searchSortBy = newParams[3].replace('sort_by=', '');
        searchFilters = newParams[4].replace('filters=', '');

        if (searchFilters) {
            searchFilters = JSON.parse(atob(searchFilters));
            searchFilters.sector_name.filter((val) => val !== '');
            searchFilters = {
                product_type: filterArray(searchFilters.product_type),
                sector_name: filterArray(searchFilters.sector_name),
                continents: filterArray(searchFilters.continents),
                threeie_funded: filterArray(searchFilters.threeie_funded),
                fcv_status: filterArray(searchFilters.fcv_status),
                countries: filterArray(searchFilters.countries),
                equity_dimension: filterArray(searchFilters.equity_dimension),
                primary_theme: filterArray(searchFilters.primary_theme),
                equity_focus: filterArray(searchFilters.equity_focus),
                year_of_publication: filterArray(searchFilters.year_of_publication),
                dataset_available: filterArray(searchFilters.dataset_available),
            };
        } else {
            searchFilters = {
                product_type: [],
                sector_name: [],
                continents: [],
                threeie_funded: [],
                fcv_status: [],
                countries: [],
                equity_dimension: [],
                primary_theme: [],
                equity_focus: [],
                year_of_publication: [],
                dataset_available: [],
            };
        }
    }

    if (searchType === 'advanced' && searchQueryValue !== '') {
        searchQueryValue = deFormatSearchQuery(searchQueryValue);
    }

    if (searchQueryValue && searchFilters.product_type.length > 0) {
        filterOptions += ` AND Product:(${searchFilters.product_type.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.sector_name.length > 0) {
        filterOptions += ` AND Sectors:(${searchFilters.sector_name.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.continents.length > 0) {
        filterOptions += ` AND Continent:(${searchFilters.continents.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.threeie_funded.length > 0) {
        filterOptions += ` AND Funding by:(${searchFilters.threeie_funded.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.fcv_status.length > 0) {
        filterOptions += ` AND Fragility and conflict:(${searchFilters.fcv_status.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.countries.length > 0) {
        filterOptions += ` AND Country:(${searchFilters.countries.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.equity_dimension.length > 0) {
        filterOptions += ` AND Equity dimension:(${searchFilters.equity_dimension.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.primary_theme.length > 0) {
        filterOptions += ` AND Primary theme:(${searchFilters.primary_theme.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.equity_focus.length > 0) {
        filterOptions += ` AND Equity focus:(${searchFilters.equity_focus.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.year_of_publication.length > 0) {
        filterOptions += ` AND Year of publication:(${searchFilters.year_of_publication.join( ', ' )})`;
        filterOptionsExist = true;
    }

    if (searchQueryValue && searchFilters.dataset_available.length > 0) {
        filterOptions += ` AND Dataset:(${searchFilters.dataset_available.join( ', ' )})`;
        filterOptionsExist = true;
    }

    searchQueryValue += filterOptions;

    const FcvFiltersData = searchFilters.fcv_status.map((fcv) => {
        if (fcv === 'Yes') {
            return 'Fragility and conflict: Yes';
        }
        if (fcv === 'No') {
            return 'Fragility and conflict: No';
        }

        return null;
    });

    const DatasetFiltersData = searchFilters.dataset_available.map((dataset) => {
        if (dataset === 'yes') {
            return 'Dataset: Yes';
        }
        if (dataset === 'no') {
            return 'Dataset: No';
        }

        return null;
    });

    if (searchFilters) {
        tags = [
            ...searchFilters.continents,
            ...searchFilters.countries,
            ...searchFilters.equity_dimension,
            ...searchFilters.equity_focus,
            ...searchFilters.primary_theme,
            ...searchFilters.product_type,
            ...searchFilters.sector_name,
            ...searchFilters.threeie_funded,
            ...searchFilters.year_of_publication,
            ...FcvFiltersData,
            ...DatasetFiltersData,
        ];
    }

    if (searchPage > 1) {
        searchPage = ((searchPage - 1) * searchPerPage) + 1;
    } else if (searchPage <= 1) {
        searchPage = 0;
    }

    if (searchType === 'keyword') {
        settings = keywordSearch.searchSettings;
        searchInput = settings.keyword || searchText;
        searchQuery = KEYWORD_SEARCH_QUERY;

        searchVars = {
            from: searchPage,
            keyword: searchText.replace(/%20/g, ' '),
            size: searchPerPage || settings.size,
            sort_by: searchSortBy || settings.sort_by,
        };

        searchData = {
            from: searchVars.from,
            keyword: searchVars.keyword,
            size: searchVars.size,
            sort_by: searchVars.sort_by,
            filters: searchFilters,
        };
    } else if (searchType === 'advanced') {
        settings = advancedSearch.advancedSearchSettings;
        searchInput = settings.input_query;
        searchQuery = ADVANCED_SEARCH_QUERY;

        searchVars = {
            from: searchPage,
            input_query: searchQueryValue || settings.input_query,
            size: searchPerPage || settings.size,
            sort_by: searchSortBy || settings.sort_by,
        };

        searchData = {
            from: searchVars.from,
            size: searchVars.size,
            sort_by: searchVars.sort_by,
            filters: filterOptionsExist === true ? searchFilters : '',
            query: mainSearchQuery,
        };
    } else {
        settings = advancedSearch.advancedSearchSettings;
        searchInput = settings.input_query;
        searchQuery = ADVANCED_SEARCH_QUERY;

        searchVars = {
            from: searchPage,
            input_query: settings.input_query,
            size: searchPerPage || settings.size,
            sort_by: settings.sort_by,
        };

        searchData = {
            from: searchVars.from,
            size: searchVars.size,
            sort_by: searchVars.sort_by,
            filters: searchFilters,
        };
    }

    return {
        searchInput,
        searchText,
        searchQueryValue,
        mainSearchQuery,
        searchFilters,
        tags,
        searchPerPage,
        searchQuery,
        searchVars,
        searchData,
        searchObject,
    };
};