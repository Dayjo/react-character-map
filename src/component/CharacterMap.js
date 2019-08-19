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
    }

    clickCategoryHandler(e) {
        var cat = e.target.getAttribute('data-category-index');
        this.setState({ active: cat });
    }

    // Run the callback function
    charClickHandler(e, char){
        e.preventDefault();
        return this.props.onSelect(char, e.target);
    }

    // Perform the search
    performSearch(search) {
        console.log('performing search %s', search);
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
            const {charList} = this.charListFromCharacters(filteredCharacters);
            this.setState({charList});
        }
        this.setState({search});
    }

    charListFromCharacters(characters) {
        var self = this;
        var i = -1;
        var categoryList = [];
        // Loop through each category
        var charList = Object.keys(characters).map(function(category, current) {
            i++;

            if ( parseInt(self.state.active,10) === i ) {
                // In the active category, loop through the characters and create the list
                var currentItems = Object.keys(characters[category]).map(function(p,c){
                    return (<li key={'topli' + p}>
                        <a data-hex={characters[category][p].hex}  data-entity={characters[category][p].entity}  data-char={characters[category][p].char} data-title={characters[category][p].name}  onClick={ ((e) => self.charClickHandler(e,characters[category][p])) }>
                        {characters[category][p].char}
                        </a>
                    </li>);
                });
            }

            categoryList.push((<li key={'clli' + category + i} className={"charMap--category-menu-item" + (parseInt(self.state.active,10) === i ? ' active' : '')}>
                <a data-category-index={i} onClick={ self.clickCategoryHandler.bind(self) } href={'#' + category}>
                    {category}
                </a>
            </li>));

            return (<li key={'innerli' + category + i} data-category-name={category}>
                <ul className={"charMap--category " + (parseInt(self.state.active,10) === i ? ' active' : '')}>
                    {currentItems}
                </ul>
            </li>);
        });
        return {charList,categoryList};
    }

    componentDidMount() {
        var { characterData } = this.props;
        var characters = characterData || Chars;
        const {charList,categoryList} = this.charListFromCharacters(characters);
        this.setState({charList,categoryList,fullCharList: charList});
    }

    render() {
        const {categoryList,charList,search} = this.state;

        return (
            <div className="charMap--container">
                <ul>
                    <label for="filter">Filter: </label>
                    <input
                        type="text"
                        name="filter"
                        aria-label="Filter"
                        value={search}
                        onChange={this.handleSearchChange}
                        autoComplete={false}
                    />
                </ul>
                { '' === search &&
                    <ul className="charMap--category-menu">
                        { categoryList}
                    </ul>
                }
                <ul className="charMap--categories">
                    { charList }
                </ul>
            </div>
        )
    }
}

export default CharacterMap;
