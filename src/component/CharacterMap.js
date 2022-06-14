import React from 'react';
import Chars from './chars.json';
import './style.css';

/**
 * <CharacterMap /> Element
 *
 * @example <CharacterMap onSelect={function(char,el){ console.log(char, el); }} />
 * @extends React
 */
class CharacterMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            search: '',
            categoryList: '',
            charList: '',
            fullCharList: '',
        };
        this.resultsCache=[];
        this.handleSearchChange = this.handleSearchChange.bind( this );
        this.clickCategoryHandler = this.clickCategoryHandler.bind( this );
        this.setupCharactersAtTab = this.setupCharactersAtTab.bind( this );

        // To-do: Update handling of refs. React 16.3+ has createRef. 16.8+ has useRef.
        this.bindInputRef = this.bindInputRef.bind( this );
        this.searchInput = null;
    }

    /**
     * Handle clicks to the category tabs.
     *
     * @param {Event} e The React synthetic event.
     */
    clickCategoryHandler(e) {
        var cat = e.target.getAttribute('data-category-index');
        this.setupCharactersAtTab( cat );
    }

    /**
     * Extract character data at a tab.
     *
     * @param {Number} tab The tab to display.
     */
    setupCharactersAtTab( tab ) {
        var {characterData} = this.props;
        var characters = characterData || Chars;
        const {charList,categoryList} = this.charListFromCharacters(characters, tab);
        this.setState({charList,categoryList,fullCharList: charList});
    }

    componentDidMount() {
        this.setupCharactersAtTab( 0 );

        // Focus search input on mount.
        if ( false !== this.props.autofocus && this.searchInput && 'focus' in this.searchInput ) {
            // This is more reliable after a short wait.
            window.setTimeout( () => {
                this.searchInput.focus();
            }, 25 );
        }
    }

    /**
     * Binds the input element to the component as a ref.
     *
     * @param {object} element The search input element.
     */
    bindInputRef( element ) {
        this.searchInput = element;
    }

    // Handle clicks to the characters, running the callback function.
    charClickHandler(e, char){
        e.preventDefault();
        return this.props.onSelect(char, e.target);
    }

    /**
     * Perform the character search.
     *
     * @param {string} search The search string.
     */
    performSearch(search) {
        var {characterData} = this.props;
        var characters = characterData || Chars;
        var filteredCharacters = {'Results': []};
        var sortedResults = [];
        Object.keys(characters).forEach(group => {
            Object.keys(characters[group]).forEach(character => {
                if (!characters[group][character].name) {
                    return;
                }
                // If search string is one character long, look for names that start with that character.
                if (1===search.length) {
                    if (0 === characters[group][character].name.toLowerCase().indexOf(search.toLowerCase())) {
                        filteredCharacters['Results'].push(characters[group][character]);
                    }
                } else {

                    // When the search string is two or more characters, do a full search of the name.
                    var index = characters[group][character].name.toLowerCase().indexOf(search.toLowerCase());
                    if (-1 !== index) {
                        // Store the results in a sorted array of buckets based on search result index.
                        // Matches with index of 20 or more are stored in the final bucket.
                        var sortPosition = index < 20 ? index : 20;
                        sortedResults[index] = sortedResults[index] || [];
                        sortedResults[index].push(characters[group][character]);
                    }
                }
            } );
        } );

        // If we built a sorted array, map that to filteredCharacters, preserving the sert order.
        if (0 !== sortedResults.length) {
            sortedResults.forEach(function(results) {
                results.forEach(function(result) {
                    filteredCharacters['Results'].push(result);
                } );
            } );
        }

        return filteredCharacters;
    }

    // Filter the displayed characters.
    handleSearchChange( e ) {
        const search = e.target.value;
        const {fullCharList,charList} = this.state;
        if ('' === search) {
            this.setState({charList: fullCharList})
        } else {
            var filteredCharacters = this.resultsCache[search] ? this.resultsCache[search] : this.performSearch(search);
            this.resultsCache[search] = filteredCharacters;
            const {charList} = this.charListFromCharacters(filteredCharacters, 0);
            this.setState({charList});
        }
        this.setState({search});
    }

    getCategoryName(category) {
        /**
         * The categoryNames prop is expected to be a JavaScript object with translated category names corresponding
         * to the object keys in chars.json. Keys are the untranslated names from chars.json; values are the translated
         * names.
         */
        const { categoryNames } = this.props;

        if (!categoryNames || 'object' !== typeof categoryNames) {
            return category;
        }

        if (!(category in categoryNames) || 'string' !== typeof categoryNames[category]) {
            return category;
        }

        return categoryNames[category];
    }

    charListFromCharacters(characters, active) {
        var self = this;
        var categoryList = [];
        var i = -1;
        self.activeTab = parseInt(active,10);
        // Loop through each category
        var charList = Object.keys(characters).map(function(category) {
            i++;

            if ( self.activeTab === i ) {
                // In the active category, loop through the characters and create the list
                var currentItems = Object.keys(characters[category]).map(function(p,c){
                    return (<li key={'topli' + p}>
                        <button
                            data-hex={characters[category][p].hex}
                            data-entity={characters[category][p].entity}
                            data-char={characters[category][p].char}
                            data-title={characters[category][p].name}
                            title={characters[category][p].name}
                            onClick={ ((e) => self.charClickHandler(e,characters[category][p])) }
                        >
                            {characters[category][p].char}
                        </button>
                    </li>);
                });
            }
            categoryList.push((<li key={'clli' + category + i} className={"charMap--category-menu-item" + ( self.activeTab === i ? ' active' : '' ) }>
                <button
                    data-category-index={i}
                    onClick={ self.clickCategoryHandler }
                >
                    {self.getCategoryName(category)}
                </button>
            </li>));

            return (
                <li key={'innerli' + category + i}
                    data-category-name={category}
                >
                    <ul
                        className={"charMap--category " + ( self.activeTab === i ? ' active' : '' )}
                    >
                        {currentItems}
                    </ul>
                </li>
            );
        });
        return {charList,categoryList};
    }


    render() {
        const {categoryList,charList,search} = this.state;

        const filterLabelText = this.props.filterLabelText || 'Filter';
        const categoriesLabelText = this.props.categoriesLabelText || 'Categories';
        const characterListLabelText = this.props.characterListLabelText || 'Character List';

        return (
            <div className="charMap--container">
                <ul className="charMap--filter">
                    <label htmlFor="filter">{`${filterLabelText}: `}</label>
                    <input
                        type="text"
                        name="filter"
                        aria-label={filterLabelText}
                        value={search}
                        onChange={this.handleSearchChange}
                        autoComplete="false"
                        ref={this.bindInputRef}
                    />
                </ul>
                { '' === search &&
                    <ul className="charMap--category-menu" aria-label={categoriesLabelText}>
                        { categoryList}
                    </ul>
                }
                <ul className="charMap--categories"  aria-label={characterListLabelText}>
                    { charList }
                </ul>
             </div>
        )
    }
}

export default CharacterMap;
