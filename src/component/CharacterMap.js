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
            active: 0
        };
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

    render() {
        var self = this;
        var categoryList = [];
        var i = -1;

        // Loop through each category
        var charList = Object.keys(Chars).map(function(category, current) {
            i++;

            if ( parseInt(self.state.active,10) === i ) {
                // In the active category, loop through the characters and create the list
                var currentItems = Object.keys(Chars[category]).map(function(p,c){
                    return (<li key={'topli' + p}>
                        <a data-hex={Chars[category][p].hex}  data-entity={Chars[category][p].entity}  data-char={Chars[category][p].char} data-title={Chars[category][p].name}  onClick={ ((e) => self.charClickHandler(e,Chars[category][p])) }>
                        {Chars[category][p].char}
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


        return (
            <div className="charMap--container">
                <ul className="charMap--category-menu">
                { categoryList}
                </ul>
                <ul className="charMap--categories">
                { charList }
                </ul>
            </div>
        )
    }
}

export default CharacterMap;